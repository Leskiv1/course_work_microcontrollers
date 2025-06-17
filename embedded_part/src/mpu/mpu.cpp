#include "mpu.h"
#include <Arduino.h>

void initMPU(MPU6050& mpu) {
    Wire.begin(D2, D1); // Ініціалізувати I2C для MPU
    mpu.begin();
    Serial.println("MPU6050 initialized. Calibrating gyroscope...");
    mpu.calcGyroOffsets(true); // Калібрування гіроскопа
    Serial.println("Gyroscope calibration complete.");
}

void calibrateMPU(MPU6050& mpu, float* calibSum, int* calibCount, unsigned long calibStartTime, float* initialAngle, bool* calibrated, Kalman& kalman) {
    mpu.update();
    *calibSum += mpu.getAngleX();
    (*calibCount)++;
    if (millis() - calibStartTime >= CALIB_DURATION) {
        *initialAngle = *calibSum / *calibCount;
        *calibrated = true;
        kalman.getAngle(*initialAngle, 0, 0); // Ініціалізація Kalman фільтра
        Serial.print("MPU calibrated. Initial Angle: ");
        Serial.println(*initialAngle);
    }
}

void updateAngle(MPU6050& mpu, Kalman& kalman, float initialAngle, uint32_t dt_ms, float* filteredAngle) {
    mpu.update();
    float accAngleX = mpu.getAngleX();
    float gyroRateX = mpu.getGyroX();
    float correctedAngle = accAngleX - initialAngle;
    float dt = dt_ms / 1000.0f;
    *filteredAngle = kalman.getAngle(correctedAngle, gyroRateX, dt);
}