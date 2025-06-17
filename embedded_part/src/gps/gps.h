#ifndef GPS_H
#define GPS_H

#include <SoftwareSerial.h>
#include <TinyGPS++.h>
#include "config.h" // Для доступу до GPS_SPEED_INTERVAL, SPEED_BUFFER_SIZE, prevLat, prevLon

// Прототипи функцій
void initGPS(SoftwareSerial& ss);
void handleGpsSerial(TinyGPSPlus& gps, SoftwareSerial& ss);
double haversine(double lat1, double lon1, double lat2, double lon2);
void addSpeed(double newSpeed, double* speedBuf, int* speedIdx);
double getAverageSpeed(double* speedBuf, int bufferSize);
void updateAndGetSpeed(TinyGPSPlus& gps, double* prevLat, double* prevLon, double* speedBuf, int* speedIdx);
bool isStationary(float currentAngle, float lastAngle, const float angleThreshold);
bool isStationaryBasedOnAngle(float currentAngle, float* lastAngleRef, unsigned long* lastCheckTimeRef, float threshold, unsigned long checkInterval);

#endif