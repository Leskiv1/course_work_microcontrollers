#include "wifi_handler.h"
#include "./display/display.h" // Для функцій showConnectingScreen, showOfflineMode
#include <ESP8266WiFi.h> // Для WiFi.status()
#include <time.h> // Для configTime, getLocalTime

void setupWiFi(WiFiManager& wm) {
    wm.setTimeout(15); // Таймаут для порталу налаштувань

    if (wm.autoConnect("ESP8266_MPUScreen")) {
        Serial.println("Connected to WiFi!");
        display.clearDisplay();
        display.setCursor(0, 0);
        display.println("Connected to WiFi!");
        display.println(WiFi.SSID());
        display.display();
        delay(1000);
    } else {
        // Якщо autoConnect не вдалося, спробувати запустити портал з довшим таймаутом
        wm.setTimeout(60);
        if (!wm.startConfigPortal("ESP8266_MPUScreen")) {
            WiFi.softAP("ESP8266_MPUScreen"); // Якщо портал не запустився, створити точку доступу
            showOfflineMode(display);
        }
    }
}

void checkWiFiReconnectAndSyncTime(bool* wasConnected, time_t* savedEpoch, uint32_t* lastSyncMillis) {
    bool wifiNow = WiFi.status() == WL_CONNECTED;
    if (wifiNow && !(*wasConnected)) {
        Serial.println("WiFi reconnected. Syncing time...");
        configTime(3 * 3600, 0, "pool.ntp.org", "time.nist.gov"); // Налаштування NTP
        struct tm timeinfo;
        if (getLocalTime(&timeinfo)) {
            *savedEpoch = mktime(&timeinfo);
            *lastSyncMillis = millis();
            Serial.println("Time synchronized.");
        } else {
            Serial.println("Failed to obtain time.");
        }
    }
    *wasConnected = wifiNow;
}