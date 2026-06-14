# GPS Tracker based on ESP8266 Microcontroller

A comprehensive IoT project combining embedded microcontroller programming, handling various sensors (via I2C and UART interfaces), and a cross-platform mobile web application. This device is developed for automated monitoring of location, speed, and spatial orientation, with the ability to transmit data to a remote server.

🔗 [**Link to the full coursework document**](https://docs.google.com/document/d/16zchHsyPTA041JjlDAiv4CFaGJgIYefF2d7jnglmTL0/edit?tab=t.0)

🔗 [**Посилання на документ курсової роботи**](https://docs.google.com/document/d/1qE3p58uqOJ2yrC6sXMuU2gNqOeEeb6X66bSXnlZ8Xtg/edit?tab=t.0)

---

## 📌 About the Project

The main idea was to create a fully functional and autonomous tracker that solves the issues of processing raw sensor data, power management, and provides a user-friendly interface without needing to re-flash the device to change the network.

The project consists of two main parts:
1. **Hardware Embedded System:** A physical device in a custom enclosure with a microcontroller, sensors, power module, and display.
2. **Mobile Application (React Native):** A client-side app for visualizing active and archived trips on an interactive map.

## ⚙️ Core Features & Engineering Solutions

* **Positioning and Speed:** Utilizes the NEO-6M GPS module. Since raw speed data from GPS can often "jump," the project implements an additional speed calculation based on coordinate changes using the **Haversine formula**. The data is passed through an averaging buffer for a stable display.
* **3D Motion Processing:** The MPU6050 inertial module (accelerometer + gyroscope) is used to monitor the tilt angle. To eliminate the accelerometer's sensitivity to vibrations and the gyroscope's drift, a mathematical **Kalman filter** is successfully implemented, providing perfectly smooth readings.
* **On-device Visualization:** An energy-efficient OLED display dynamically shows the current time (synchronized via NTP), coordinates, calculated speed, tilt angle, connection status, and battery charge percentage.
* **Smart Trip Management:** A special physical button allows the user to initiate or end a "trip" (by holding it for >5 seconds), which sends the corresponding HTTP POST/PUT requests to the server.
* **Wi-Fi Auto-configuration (Captive Portal):** Thanks to the `WiFiManager` library, if the device cannot find a known network, it creates its own Access Point (`ESP8266_MPUScreen`). The user can connect to it from a smartphone and enter their home Wi-Fi password through a convenient web interface.

## 🛠 Hardware Architecture & Components

* **Microcontroller:** Wemos D1 Mini (ESP8266) — the computational core of the system with built-in Wi-Fi.
* **GPS Module:** NEO-6M (communicates via software UART using `SoftwareSerial` on pin D7).
* **IMU Sensor:** MPU6050 (connected via I2C bus: D1 - SCL, D2 - SDA).
* **Display:** 128x64 OLED display using the SSD1306 controller (connected via I2C in parallel with the MPU6050).
* **Power & Monitoring:** The device is powered by a Li-ion battery. The charging process (CC/CV) and battery protection are provided by the TP4056 module. Overall power is managed by a physical toggle switch, while the charge level is read by the microcontroller through a voltage divider on the analog pin A0.

## 📱 Web Part (React Native)

A cross-platform application was created to monitor the collected data:
* **CurrentTripPage:** Real-time tracking of active trips. The route is drawn as polylines on the map, with the color dynamically changing depending on the current speed or tilt angle.
* **FinishedTripsPage:** Access to archived data. Allows viewing the statistics of completed trips (such as maximum/average speed, duration) and their full map routes.

---

## 📸 Device & App Gallery

**1. Assembled Hardware Device:**

<img width="367" height="352" alt="Знімок екрана 2026-06-14 194556" src="https://github.com/user-attachments/assets/11d86cfa-2dee-4089-b187-be1e195f4f36" />


*Description: Component layout inside the case: ESP8266, GPS antenna, power module.*

**2. OLED Display in Action:**

<img width="452" height="352" alt="Знімок екрана 2026-06-14 194201" src="https://github.com/user-attachments/assets/667848f8-73cc-4412-8cd2-8bdb70a60843" />

*Description: Real-time display of the current time, speed, tilt angle, and battery level.*

**3. Mobile App (Current Trip):**

<img width="325" height="692" alt="Знімок екрана 2026-06-14 194829" src="https://github.com/user-attachments/assets/8175f098-a79e-44b8-bd12-283b9e3d2c15" />

*Description: Dynamic coloring of the route on the map based on the user's speed.*

**4. Mobile App (Completed Trip Statistics):**

<img width="332" height="697" alt="Знімок екрана 2026-06-14 194925" src="https://github.com/user-attachments/assets/64879c66-511d-4115-b7c9-c28a943174ac" />

*Description: Summary of the traveled route and data analysis.*

---
**Author:** Leskiv  N.O. 
Group IR-21 Student, Lviv Polytechnic National University
