#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h> // Потрібно для HIGH, LOW, String, float, uint32_t
#include <Adafruit_SSD1306.h> // Для доступу до об'єкта display
#include <MPU6050_tockn.h> // Для доступу до об'єкта mpu
#include <WiFiManager.h> // Для доступу до об'єкта wifiManager
#include <TinyGPS++.h> // Для доступу до об'єкта gps
#include <SoftwareSerial.h> // Для доступу до об'єкта gpsSerial

// === OLED ===
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

// === GPS ===
#define GPS_RX_PIN D7
extern SoftwareSerial gpsSerial;
extern TinyGPSPlus gps;
extern String baseURL;
extern String espId;
extern bool isSendingData;

// === MPU6050 ===
extern MPU6050 mpu;

// === Kalman фільтр ===
// Клас Kalman краще оголосити в окремому файлі kalman.h/kalman.cpp
// А тут лише extern об'єкт
extern class Kalman kalmanX;

// === Батарея ===
#define BATTERY_PIN A0
#define VREF 3.3
const float R1 = 110000.0;
const float R2 = 110000.0;
#define BATTERY_SAMPLES 10
extern float batterySamples[BATTERY_SAMPLES];
extern int batterySampleIndex;
extern bool batterySamplesFilled;
extern float lastBatteryVoltage;
extern uint32_t lastBatteryUpdate;
const uint32_t BATTERY_UPDATE_INTERVAL = 30000;
const float initialBatteryVoltage = 3.7; // Початкове значення для калібрування

// === Швидкість ===
#define SPEED_BUFFER_SIZE 5
extern double speedBuffer[SPEED_BUFFER_SIZE];
extern int speedIndex;
const unsigned long GPS_SPEED_INTERVAL = 3000;
extern double prevLat;
extern double prevLon;
extern float lastAngle; // <--- НОВА ЗМІННА: останній зафіксований кут для перевірки на стаціонарність
extern unsigned long lastAngleCheckTime; // <--- НОВА ЗМІННА: час останньої перевірки кута
const float ANGLE_THRESHOLD_STATIONARY = 1.0; // <--- НОВА КОНСТАНТА: поріг зміни кута (1 градус)
const unsigned long ANGLE_CHECK_INTERVAL = 4000; // <--- НОВА КОНСТАНТА: інтервал перевірки кута (4 секунди)


// === Час, кут ===
extern time_t savedEpoch;
extern uint32_t lastSyncMillis;
extern bool wasWiFiConnected;
extern float filteredAngle;
extern float initialAngle;
extern bool calibrated;
extern unsigned long calibStartTime;
const unsigned long CALIB_DURATION = 3000;
extern float calibSum;
extern int calibCount;
const float ANGLE_THRESHOLD = 5.0; // Для функції isStationary

// === Інтервали ===
const uint32_t CALC_INTERVAL = 20;
const uint32_t SCREEN_UPDATE_INTERVAL = 1000;
const uint32_t SERIAL_OUTPUT_INTERVAL = 5000; // Інтервал відправки даних на сервер

// === Кнопка ===
const int BUTTON_PIN = D5;
const unsigned long LONG_PRESS_DURATION = 5000;
extern bool lastButtonState;
extern unsigned long buttonPressStart;
extern bool isTripActive;
extern bool buttonHandled;

// === WiFiManager ===
extern WiFiManager wifiManager;

// === Об'єкти для доступу з інших файлів ===
extern Adafruit_SSD1306 display;

#endif