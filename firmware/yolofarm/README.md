# YoloFarm — Yolo:Bit firmware (FR1, FR3–FR5, FR8)

Implement on [OhStem](https://app.ohstem.vn) using blocks or MicroPython. This repo does not ship compiled firmware; follow the **YoloFarm___AIoT** textbook (Phần V).

## MQTT (OhStem server)

- Broker: `mqtt.ohstem.vn`, port `1883` (see current OhStem docs for TLS).
- Topics: `{username}/feeds/{V1|V2|…}` — align **V1–V11** with [api/app/config/channel-map.js](../api/app/config/channel-map.js) defaults.

## FR1 — Giám sát

- Read **DHT20** (I2C), **soil moisture**, **light**; refresh **LCD** locally.
- Publish sensor values on a timer (e.g. every 5 minutes) to the matching feeds.
- Dashboard widgets on `app.ohstem.vn` mirror the same feeds.

## FR3 — Tưới tự động

- Compare soil moisture to **on/off thresholds** with **hysteresis** (separate low/high) and a **minimum time between pump state changes** (e.g. ≥ 120 s) to avoid chatter.
- Publish pump state to **V10** / **V11** when it changes.

## FR4 — Tưới theo giờ

- Load watering windows from MQTT/API or store locally after receiving a config message; textbook uses minute-of-day ranges.

## FR5 — Tưới thủ công

- Subscribe to command feeds for pumps; apply immediately and publish **ack/state** back.

## FR8 — Phân loại thu hoạch

- Subscribe to **V12** (`rc_servo`) for RC / actuator commands driven by the backend AI stub (`POST /api/ai/harvest`).

## Đồng bộ với backend

Run the **gateway** bridge so MQTT messages are ingested into MongoDB (`FarmSnapshot`, `Log`) for the React app and CSV export.
