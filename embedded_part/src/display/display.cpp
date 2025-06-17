#include "display.h"
#include <Arduino.h>
#include <Wire.h>
#include <ESP8266WiFi.h> // Для WiFi.status() та WiFi.SSID()

// === Ініціалізація дисплею ===
void initDisplay(Adafruit_SSD1306& disp) {
  Wire.begin(D2, D1); // Ініціалізувати I2C для дисплея
  if (!disp.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("SSD1306 init failed!");
    while (true);
  }
  disp.clearDisplay();
  disp.setTextColor(SSD1306_WHITE);
  disp.setTextSize(1);
  disp.setCursor(0, 0);
  disp.println("Starting...");
  disp.display();
  delay(500);
}

// === Робота з батареєю ===
int batteryToPercent(float voltage) {
  if (voltage >= 4.1) return 100;
  if (voltage <= 3.3) return 0;
  return (int)((voltage - 3.3) / (4.1 - 3.3) * 100);
}

void drawBatteryIcon(Adafruit_SSD1306& disp, float voltage) {
  const uint8_t x = 0, y = 0, width = 18, height = 8;
  int percent = batteryToPercent(voltage);
  uint8_t fillWidth = map(percent, 0, 100, 0, width - 2);
  disp.drawRect(x, y, width, height, SSD1306_WHITE);
  disp.drawRect(x + width, y + 2, 2, 4, SSD1306_WHITE);
  disp.fillRect(x + 1, y + 1, fillWidth, height - 2, SSD1306_WHITE);
  disp.setTextSize(1);
  disp.setCursor(x, y + 10);
  disp.print(percent); disp.print("%");
}

void drawWiFiSignal(Adafruit_SSD1306& disp,bool sendingData) {
  if (WiFi.status() != WL_CONNECTED) return;
  const uint8_t x = 100, y = 5, barWidth = 4, barSpacing = 2;
  const uint8_t heights[3] = {4, 8, 12};
  for (uint8_t i = 0; i < 3; i++) {
    disp.fillRect(x + i * (barWidth + barSpacing), y + (12 - heights[i]), barWidth, heights[i], SSD1306_WHITE);
  }
  if (sendingData) {
    // Малюємо маленький квадрат поруч з останнім стовпчиком Wi-Fi
    // Розміри: x=100 (початок Wi-Fi), 2 стовпчики по 4 + 2 пробіли по 2 = 8 + 4 = 12
    // Отже, 100 + 12 + barWidth + barSpacing = 116 (приблизно)
    // Або просто після останнього стовпчика: x + 2*(barWidth + barSpacing) + barWidth + 2 (невеликий відступ)
    uint8_t iconX = x + 3 * (barWidth + barSpacing) + 2; // Приблизно 118
    uint8_t iconY = y + 4; // По центру відносно висоти сигналу
    disp.fillRect(iconX, iconY, 3, 3, SSD1306_WHITE); // Малюємо маленький квадрат 3x3
  }
}

void drawTime(Adafruit_SSD1306& disp, time_t& savedEpoch, uint32_t& lastSyncMillis, bool isWiFiConnected) {
  struct tm timeinfo;
  if (isWiFiConnected && getLocalTime(&timeinfo)) {
    savedEpoch = mktime(&timeinfo);
    lastSyncMillis = millis();
  } else {
    time_t now = savedEpoch + (millis() - lastSyncMillis) / 1000;
    localtime_r(&now, &timeinfo);
  }

  char timeStr[9];
  strftime(timeStr, sizeof(timeStr), "%H:%M:%S", &timeinfo);

  disp.setTextSize(2);
  int16_t x1, y1; uint16_t w, h;
  disp.getTextBounds(timeStr, 0, 0, &x1, &y1, &w, &h);
  disp.setCursor((SCREEN_WIDTH - w) / 2, 20);
  disp.print(timeStr);
}

void drawAngle(Adafruit_SSD1306& disp, float angle) {
  disp.setTextSize(1);
  disp.setCursor(0, 54);
  disp.print("Ang: ");
  disp.print((int)round(angle));
  disp.print((char)247); // символ градуса
}

void drawSpeed(Adafruit_SSD1306& disp, double speed) {
  disp.setTextSize(1);
  disp.setCursor(70, 54);
  disp.print("Spd: ");

  // Якщо пристрій стоїть — швидкість 0.0
  if (speed < 1.5) {
    disp.print("0.0");
  } else {
    disp.print(speed, 1);
  }
  disp.print("km/h");
}

void updateDisplayContent(Adafruit_SSD1306& disp, float batteryVoltage, float angle, double speed, bool sendingData) {
  disp.clearDisplay();
  drawBatteryIcon(disp, batteryVoltage);
  drawWiFiSignal(disp, isSendingData);
  drawTime(disp, savedEpoch, lastSyncMillis, (WiFi.status() == WL_CONNECTED));
  drawAngle(disp, angle);
  drawSpeed(disp, speed);
  disp.display();
}

void showConnectingScreen(Adafruit_SSD1306& disp) {
  disp.clearDisplay();
  disp.setCursor(0, 0);
  disp.setTextSize(1);
  disp.println("Connecting to WiFi...");
  disp.display();
}

void showOfflineMode(Adafruit_SSD1306& disp) {
  disp.clearDisplay();
  disp.setCursor(0, 0);
  disp.println("Offline mode");
  disp.display();
  delay(3000);
}