#include <Arduino.h>
#include <Wire.h>
#include <ESP8266WiFi.h>
#include <WiFiManager.h>
#include <time.h>

// Підключаємо заголовкові файли наших модулів
#include "config.h"
#include "./display/display.h"
#include "./gps/gps.h"
#include "./mpu/mpu.h"
#include "./battery/battery.h"
#include "./kalman/kalman.h"
#include "./wifi_handler/wifi_handler.h"
#include "./button_handler/button_handler.h"
#include "./api_client/api_client.h"

// === Глобальні змінні (якщо потрібні між файлами, оголошуємо extern тут) ===
// Дивіться config.h для більшості глобальних змінних.

// Об'єкти, що є глобальними для всієї програми
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
MPU6050 mpu(Wire);
Kalman kalmanX;
SoftwareSerial gpsSerial(GPS_RX_PIN, -1);
TinyGPSPlus gps;
WiFiManager wifiManager;

// Змінні стану
time_t savedEpoch = 0;
uint32_t lastSyncMillis = 0;
bool wasWiFiConnected = false;
float filteredAngle = 0;
float initialAngle = 0;
bool calibrated = false;
unsigned long calibStartTime = 0;
float calibSum = 0;
int calibCount = 0;
bool isTripActive = false;
bool isSendingData = false;

// Таймери та інтервали
uint32_t lastCalc = 0;
uint32_t lastScreenUpdate = 0;
uint32_t lastSerialOutput = 0;
uint32_t lastBatteryUpdate = 0;
unsigned long lastAngleCheckTime = 0;
unsigned long lastSpeedCalc = 0;

// Змінні для GPS та швидкості
double prevLat = 0.0;
double prevLon = 0.0;
double speedBuffer[SPEED_BUFFER_SIZE];
int speedIndex = 0;

// Змінні для батареї
float batterySamples[BATTERY_SAMPLES];
int batterySampleIndex = 0;
bool batterySamplesFilled = false;
float lastBatteryVoltage = 0;

// Змінні для кнопки
bool lastButtonState = HIGH;
unsigned long buttonPressStart = 0;
bool buttonHandled = false;

float lastAngle = 0; // <--- ІНІЦІАЛІЗАЦІЯ


// === Setup ===
void setup() {
  Serial.begin(115200);
  Serial.println("Starting setup...");

  // Ініціалізація периферії
  initDisplay(display);
  initMPU(mpu);
  initGPS(gpsSerial);
  initBattery(batterySamples, BATTERY_SAMPLES, initialBatteryVoltage);
  mpu.update(); // Оновимо значення MPU
  lastAngle = mpu.getAngleX(); // <--- ІНІЦІАЛІЗАЦІЯ lastAngle початковим значенням

  // Налаштування WiFi
  showConnectingScreen(display);
  setupWiFi(wifiManager);

  // Ініціалізація кнопки
  pinMode(BUTTON_PIN, INPUT_PULLUP);

  // Калібрування MPU
  calibStartTime = millis();
  Serial.println("Setup complete.");
}

// === Loop ===
void loop() {
  uint32_t now = millis();

  // Обробка GPS даних
  handleGpsSerial(gps, gpsSerial);
  if (now - lastSpeedCalc >= GPS_SPEED_INTERVAL && gps.location.isValid()) {
    lastSpeedCalc = now;
    updateAndGetSpeed(gps, &prevLat, &prevLon, speedBuffer, &speedIndex);
  }

  // Калібрування MPU
  if (!calibrated) {
    calibrateMPU(mpu, &calibSum, &calibCount, calibStartTime, &initialAngle, &calibrated, kalmanX);
    return; // Не продовжуємо, поки не відкалібровано
  }

  // Обчислення кута
  if (now - lastCalc >= CALC_INTERVAL) {
    lastCalc = now;
    updateAngle(mpu, kalmanX, initialAngle, CALC_INTERVAL, &filteredAngle);
  }

  double currentSmoothedSpeed = getAverageSpeed(speedBuffer, SPEED_BUFFER_SIZE);
  // Перевірка на стаціонарність на основі кута
  bool wasStationary = (currentSmoothedSpeed == 0.0); // Зберігаємо попередній стан швидкості
  bool stationary = isStationaryBasedOnAngle(filteredAngle, &lastAngle, &lastAngleCheckTime, ANGLE_THRESHOLD_STATIONARY, ANGLE_CHECK_INTERVAL);

  // Якщо пристрій стаціонарний, швидкість дорівнює 0
  if (stationary) {
    currentSmoothedSpeed = 0.0; // Тут вона може бути змінена
    // Якщо пристрій щойно став стаціонарним (раніше рухався)
    if (!wasStationary) {
      // Обнуляємо буфер швидкості, щоб уникнути "інерції"
      for (int i = 0; i < SPEED_BUFFER_SIZE; i++) {
        speedBuffer[i] = 0.0;
      }
      speedIndex = 0; // Скидаємо індекс буфера
    }
  }
  // Оновлення дисплею
  if (now - lastScreenUpdate >= SCREEN_UPDATE_INTERVAL) {
    lastScreenUpdate = now;
    if (now - lastBatteryUpdate >= BATTERY_UPDATE_INTERVAL) {
      lastBatteryUpdate = now;
      updateBattery(batterySamples, &batterySampleIndex, &batterySamplesFilled, &lastBatteryVoltage);
    }
    updateDisplayContent(display, lastBatteryVoltage, filteredAngle, getAverageSpeed(speedBuffer, SPEED_BUFFER_SIZE),isSendingData);
  }

  // Обробка кнопки
  handleButtonLogic(&isTripActive, BUTTON_PIN, &lastButtonState, &buttonPressStart, LONG_PRESS_DURATION, &buttonHandled);

  // Відправка даних на сервер (якщо поїздка активна)
  if (isTripActive && now - lastSerialOutput >= SERIAL_OUTPUT_INTERVAL) {
    lastSerialOutput = now;
    sendTripDetail(gps, filteredAngle, lastBatteryVoltage, getAverageSpeed(speedBuffer, SPEED_BUFFER_SIZE));
  }

  // Перевірка та повторне підключення до WiFi, синхронізація часу
  checkWiFiReconnectAndSyncTime(&wasWiFiConnected, &savedEpoch, &lastSyncMillis);
}