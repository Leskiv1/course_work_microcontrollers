#ifndef KALMAN_H
#define KALMAN_H

// Клас Kalman (перенесено сюди)
class Kalman {
public:
    Kalman();
    float getAngle(float newAngle, float newRate, float dt);
private:
    float Q_angle, Q_bias, R_measure;
    float angle, bias, rate;
    float P[2][2];
};

#endif