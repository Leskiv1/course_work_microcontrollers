#include "button_handler.h"
#include "./config.h" // Для доступу до SERIAL_OUTPUT_INTERVAL
#include <Arduino.h>

void sendTripStart();
void sendTripStop();

void handleButtonLogic(bool* isTripActive, int buttonPin, bool* lastState, unsigned long* pressStart, unsigned long longPressDur, bool* handled) {
    bool currentState = digitalRead(buttonPin);

    if (currentState == LOW && *lastState == HIGH) {
        // Натискання кнопки почалося (перехід з HIGH у LOW)
        *pressStart = millis();
        *handled = false; // Скидаємо прапорець обробки
    }

    if (currentState == LOW && !(*handled) && (millis() - *pressStart >= longPressDur)) {
        // Кнопка утримується більше ніж longPressDuration і ще не оброблена
        *isTripActive = !(*isTripActive);

        if (*isTripActive) {
            Serial.println("{\"trip\": \"start\"}");
            sendTripStart();
        } else {
            Serial.println("{\"trip\": \"end\"}");
            sendTripStop();
        }

        *handled = true; // Позначаємо, що обробили цю подію
    }

    if (currentState == HIGH) {
        // Кнопка відпущена
        *handled = false; // Дозволяємо обробляти наступне натискання
    }

    *lastState = currentState; // Запам'ятовуємо поточний стан для наступного циклу
}
