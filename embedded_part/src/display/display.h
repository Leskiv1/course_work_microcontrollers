#ifndef DISPLAY_H
#define DISPLAY_H

#include <Adafruit_SSD1306.h>
#include "config.h" // Для доступу до SCREEN_WIDTH, SCREEN_HEIGHT

// Прототипи функцій
void initDisplay(Adafruit_SSD1306& disp);
void drawBatteryIcon(Adafruit_SSD1306& disp, float voltage);
void drawWiFiSignal(Adafruit_SSD1306& disp,bool isSendingData);
void drawTime(Adafruit_SSD1306& disp, time_t& savedEpoch, uint32_t& lastSyncMillis, bool isWiFiConnected);
void drawAngle(Adafruit_SSD1306& disp, float angle);
void drawSpeed(Adafruit_SSD1306& disp, double speed);
void updateDisplayContent(Adafruit_SSD1306& disp, float batteryVoltage, float angle, double speed,bool isSendingData);
void showConnectingScreen(Adafruit_SSD1306& disp);
void showOfflineMode(Adafruit_SSD1306& disp);
int batteryToPercent(float voltage);

#endif