#ifndef WIFI_HANDLER_H
#define WIFI_HANDLER_H

#include <WiFiManager.h>
#include "config.h" // Для доступу до display, savedEpoch, lastSyncMillis, wasWiFiConnected

// Прототипи функцій
void setupWiFi(WiFiManager& wm);
void checkWiFiReconnectAndSyncTime(bool* wasConnected, time_t* savedEpoch, uint32_t* lastSyncMillis);

#endif