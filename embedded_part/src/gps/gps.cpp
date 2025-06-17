#include "gps.h"
#include <Arduino.h>
#include <math.h>

void initGPS(SoftwareSerial& ss) {
    ss.begin(9600);
    Serial.println("GPS serial initialized.");
}

void handleGpsSerial(TinyGPSPlus& gps, SoftwareSerial& ss) {
    while (ss.available()) {
        gps.encode(ss.read());
    }
}

double haversine(double lat1, double lon1, double lat2, double lon2) {
    double lat_avg_rad = ((lat1 + lat2) / 2.0) * DEG_TO_RAD;

    double meters_per_deg_lat = 110574.0;
    double meters_per_deg_lon = 111320.0 * cos(lat_avg_rad);

    double dy = (lat2 - lat1) * meters_per_deg_lat;
    double dx = (lon2 - lon1) * meters_per_deg_lon;

    return sqrt(dx * dx + dy * dy);
}

void addSpeed(double newSpeed, double* speedBuf, int* speedIdx) {
    speedBuf[*speedIdx] = newSpeed;
    *speedIdx = (*speedIdx + 1) % SPEED_BUFFER_SIZE;
}

bool isStationaryBasedOnAngle(float currentAngle, float* lastAngleRef, unsigned long* lastCheckTimeRef, float threshold, unsigned long checkInterval) {
    unsigned long now = millis();

    // Якщо пройшов достатній інтервал для перевірки
    if (now - *lastCheckTimeRef >= checkInterval) {
        float angleDiff = abs(currentAngle - *lastAngleRef);
        *lastAngleRef = currentAngle; // Оновлюємо останній кут для наступної перевірки
        *lastCheckTimeRef = now;     // Оновлюємо час останньої перевірки

        return angleDiff < threshold;
    }
    return false; // Повертаємо false, якщо не час перевіряти або якщо кут змінився
}


double getAverageSpeed(double* speedBuf, int bufferSize) {
    double sum = 0;
    for (int i = 0; i < bufferSize; i++) {
        sum += speedBuf[i];
    }
    return sum / bufferSize;
}

void updateAndGetSpeed(TinyGPSPlus& gps, double* prevLat, double* prevLon, double* speedBuf, int* speedIdx) {
    double currentLat = gps.location.lat();
    double currentLon = gps.location.lng();

    if (*prevLat != 0.0 && *prevLon != 0.0) {
        double distance = haversine(*prevLat, *prevLon, currentLat, currentLon); // в метрах
        double speedMps = distance / (GPS_SPEED_INTERVAL / 1000.0);  // м/с
        double speedKmph = speedMps * 3.6; // км/год
        addSpeed(speedKmph, speedBuf, speedIdx);
        Serial.print("Calculated GPS Speed: ");
        Serial.println(speedKmph);
    }
    *prevLat = currentLat;
    *prevLon = currentLon;
}

bool isStationary(float currentAngle, float lastAngle, const float angleThreshold) {
    float angleDiff = abs(currentAngle - lastAngle);
    return angleDiff < angleThreshold;
}