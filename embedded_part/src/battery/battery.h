#ifndef BATTERY_H
#define BATTERY_H

#include <Arduino.h>
#include "config.h" // Для доступу до BATTERY_PIN, VREF, R1, R2, BATTERY_SAMPLES

// Прототипи функцій
void initBattery(float* samplesBuffer, int bufferSize, float initialVoltage);
float readBatteryVoltage();
float getBatteryAverage(float* samplesBuffer, int bufferSize, bool filled, int currentIndex);
void updateBattery(float* samplesBuffer, int* currentIndex, bool* filledFlag, float* lastVoltage);
int batteryToPercent(float voltage); // Додаємо сюди, якщо використовується тільки тут
// Або залишаємо в display.cpp, якщо це функція виводу
#endif