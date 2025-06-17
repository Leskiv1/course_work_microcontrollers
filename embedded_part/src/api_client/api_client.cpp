#include "api_client.h"
#include "./battery/battery.h" // Для batteryToPercent
#include "./gps/gps.h" // Для getAverageSpeed
#include "./display/display.h"
#include <ESP8266WiFi.h> // Для WiFi.status()

// Глобальні змінні для API (оголошені в config.h)
String baseURL = "https://pjuwztvjs5.execute-api.eu-north-1.amazonaws.com/default/api";
String espId = "Nazar";

void printHttpResponse(HTTPClient &http, int code) {
  if (code > 0) {
    Serial.printf("HTTP response code: %d\n", code);
    String response = http.getString();
    Serial.println("Response body:");
    Serial.println(response);
  } else {
    Serial.printf("HTTP request failed, error: %s\n", http.errorToString(code).c_str());
  }
}

void sendTripStart() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Wi-Fi not connected! Cannot send trip start.");
    return;
  }
  isSendingData = true;

  WiFiClientSecure client;
  client.setInsecure(); // ⛔ Не перевіряє сертифікат (лише для тестів)

  HTTPClient http;
  String url = baseURL + "/trip/start/" + espId;

  Serial.print("Sending trip start to: ");
  Serial.println(url);

  if (http.begin(client, url)) {
    int code = http.POST("");
    if (code > 0) {
      Serial.printf("Trip start sent, response code: %d\n", code);
      Serial.println(http.getString());
    } else {
      Serial.print("HTTP request failed, error: ");
      Serial.println(http.errorToString(code));
    }
    http.end();
  } else {
    Serial.println("Error sending trip start: connection failed");
  }
  isSendingData = false;
}

void sendTripStop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Wi-Fi not connected! Cannot send trip stop.");
    return;
  }
  isSendingData = true;

  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient http;

  String url = baseURL + "/trip/stop/" + espId;
  http.begin(client, url);
  int code = http.sendRequest("PUT", ""); // PUT-запит

  if (code > 0) {
    Serial.printf("Trip stop sent, response code: %d\n", code);
  } else {
    Serial.printf("Error sending trip stop: %s\n", http.errorToString(code).c_str());
  }
  printHttpResponse(http, code);
  http.end();
  isSendingData = false;
}

void sendTripDetail(TinyGPSPlus& gps, float currentAngle, float batteryVoltage, double currentSpeed) {
  if (!gps.location.isValid()) {
    Serial.println("GPS location not valid. Cannot send trip detail.");
    return;
  }
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Wi-Fi not connected! Cannot send trip detail.");
    return;
  }
  isSendingData = true;

  WiFiClientSecure client;
  client.setInsecure(); // ← ОБОВ'ЯЗКОВО, якщо не використовуєш сертифікат
  HTTPClient http;

  String url = baseURL + "/detail/" + espId;
  http.begin(client, url);
  http.addHeader("Content-Type", "application/json");

  // Формуємо тіло JSON
  int localHour = gps.time.hour() + 3; // Коригуємо на ваш часовий пояс (Дніпро: UTC+3)
  if (localHour >= 24) localHour -= 24;

  String payload = "{";

  // Location
  payload += "\"location\": {\"latitude\": ";
  payload += String(gps.location.lat(), 6) + ", \"longitude\": ";
  payload += String(gps.location.lng(), 6) + "},";

  payload += "\"speed\": {\"kmph\": ";
  if (currentSpeed < 1.5) { // Якщо швидкість дуже мала, вважаємо 0
    payload += "0.0},";
  } else {
    payload += String(currentSpeed, 1) + "},";
  }

  // Date
  payload += "\"date\": {\"day\": ";
  payload += gps.date.day();
  payload += ",\"month\": ";
  payload += gps.date.month();
  payload += ",\"year\": ";
  payload += gps.date.year();
  payload += "},";

  // Time
  payload += "\"time_local\": {\"hour\": ";
  payload += localHour;
  payload += ",\"minute\": ";
  payload += gps.time.minute();
  payload += ",\"second\": ";
  payload += gps.time.second();
  payload += "},";

  // Tilt angle
  payload += "\"tilt_angle\": ";
  payload += String((int)round(currentAngle)) + ",";

  // Battery
  payload += "\"battery_percent\": ";
  payload += batteryToPercent(batteryVoltage); // Використовуємо функцію з battery.cpp

  payload += "}";

  Serial.println("Final JSON payload:");
  Serial.println(payload);

  int code = http.POST(payload);

  if (code > 0) {
    Serial.printf("Trip detail sent, response code: %d\n", code);
  } else {
    Serial.printf("Error sending trip detail: %s\n", http.errorToString(code).c_str());
  }
  printHttpResponse(http, code);
  http.end();
  isSendingData = false;
}