#ifndef API_CLIENT_H
#define API_CLIENT_H

#include <Arduino.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h> // Якщо потрібно для формування JSON
#include <TinyGPS++.h> // Для доступу до gps об'єкта
#include "config.h"

// Прототипи функцій
void printHttpResponse(HTTPClient &http, int code);
void sendTripStart();
void sendTripStop();
void sendTripDetail(TinyGPSPlus& gps, float currentAngle, float batteryVoltage, double currentSpeed);

#endif