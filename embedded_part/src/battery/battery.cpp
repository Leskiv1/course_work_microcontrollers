#include "battery.h"
#include <Arduino.h>

void initBattery(float* samplesBuffer, int bufferSize, float initialVoltage) {
    float currentVoltage = readBatteryVoltage();
    for (int i = 0; i < bufferSize; i++) {
        samplesBuffer[i] = currentVoltage; // Ініціалізуємо буфер поточним значенням
    }
    Serial.print("Battery initialized with voltage: ");
    Serial.println(currentVoltage);
}

float readBatteryVoltage() {
    int raw = analogRead(BATTERY_PIN);
    float v_adc = raw * VREF / 1023.0;
    return v_adc * (R1 + R2) / R2;
}

float getBatteryAverage(float* samplesBuffer, int bufferSize, bool filled, int currentIndex) {
    float sum = 0;
    int count = filled ? bufferSize : currentIndex;
    for (int i = 0; i < count; i++) {
        sum += samplesBuffer[i];
    }
    return count == 0 ? 0 : sum / count;
}

void updateBattery(float* samplesBuffer, int* currentIndex, bool* filledFlag, float* lastVoltage) {
    float voltage = readBatteryVoltage();
    samplesBuffer[*currentIndex] = voltage;
    (*currentIndex)++;
    if (*currentIndex >= BATTERY_SAMPLES) {
        *currentIndex = 0;
        *filledFlag = true;
    }
    *lastVoltage = getBatteryAverage(samplesBuffer, BATTERY_SAMPLES, *filledFlag, *currentIndex);
}

// Залишаємо batteryToPercent тут, якщо вона потрібна тільки для внутрішніх розрахунків батареї.
// Якщо вона потрібна для виводу на дисплей, то її краще залишити в display.cpp або винести в common.h
