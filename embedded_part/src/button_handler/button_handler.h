#ifndef BUTTON_HANDLER_H
#define BUTTON_HANDLER_H

#include <Arduino.h>
#include "./api_client/api_client.cpp" // Для функцій sendTripStart, sendTripStop

// Прототипи функцій
void handleButtonLogic(bool* isTripActive, int buttonPin, bool* lastState, unsigned long* pressStart, unsigned long longPressDur, bool* handled);

#endif