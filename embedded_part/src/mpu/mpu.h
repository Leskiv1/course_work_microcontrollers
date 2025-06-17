#ifndef MPU_H
#define MPU_H

#include <MPU6050_tockn.h>
#include "./kalman/kalman.h" // Для доступу до класу Kalman
#include "config.h" // Для доступу до CALIB_DURATION

// Прототипи функцій
void initMPU(MPU6050& mpu);
void calibrateMPU(MPU6050& mpu, float* calibSum, int* calibCount, unsigned long calibStartTime, float* initialAngle, bool* calibrated, Kalman& kalman);
void updateAngle(MPU6050& mpu, Kalman& kalman, float initialAngle, uint32_t dt_ms, float* filteredAngle);

#endif