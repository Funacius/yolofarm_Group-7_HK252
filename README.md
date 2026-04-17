

## 📌Introduction 
the **Yolo Farm** project adopts the "Agriculture 4.0" philosophy—inspired by global leaders like Israel—to transition from labor-intensive practices to high-tech, data-driven automation. By integrating IoT (Internet of Things) and AI, the system creates a resilient framework for modern cultivation.


## Purpose
- Mitigates Environmental Risks
- Optimizes Resource Managemen
- Enhances Crop Quality
- Empowers Data-Driven Decisions

## ✨ Key Feature
- **Environmental Monitoring**: Continuous, automated tracking of crop con-
 ditions with local and remote reporting.
- **Smart Irrigation**: Dual-mode water management (Scheduled/Timer-based
and Sensor-based/Autonomous)
- **IoT Dashboard**: A centralized interface for remote monitoring and manual
override via the OhStem cloud server.
- **Data Analytics**: Capability to export historical logs to Excel for trend visu-
alization and growth cycle assessment.

- **AI Anomaly Detection**: Real-time identification of plant health issues (e.g.,
pests or leaf discoloration) using Computer Vision. ( Coming soon...)
- **AI Fruit Classification**: Automated grading of harvested produce based on
visual ripeness and color ( Coming soon...)


## Video demo


https://github.com/user-attachments/assets/c39d4f0d-584f-488e-a0f5-2ecb3b0cc652

## Tech Stacks
- Language: JavaScript 

- Backend Core: Express

- Frontend: React.js / HTML5 / CSS3

- Database: NOSQL (MongoDB)


 ## Member in charge
 - Ho Quoc Huy: CS
 - Nguyen Do Gia Bao: CS
 - Dinh Cao Thien Loc: CS
 - Bui Quoc Thai: CS
 - Tran Duy Tuan: CE
 - Ho Tran Minh Dat: CE

## How to run

**Prerequisites:** [Node.js](https://nodejs.org/) (LTS), [MongoDB](https://www.mongodb.com/) running locally (default `mongodb://127.0.0.1:27017`), and optionally [Python 3](https://www.python.org/) for the USB serial ↔ OhStem gateway in `iot/`.

### 1. API (Express + MongoDB)

```bash
cd api
npm install
npm start
```

API listens at `http://localhost:3001` (e.g. routes under `/api/...`).

### 2. Gateway — MQTT bridge (ingest + publish)

Subscribes to OhStem MQTT and forwards messages to the API; exposes `POST /bridge/publish` for the API/UI stack.

```bash
cd gateway
npm install
npm run bridge
```

Optional connectivity check:

```bash
npm run check:ohstem
```

> **Note:** `gateway/main.js` (`npm start` in `gateway`) is a separate small Express app on port 3000; the stack described above uses **`bridgeServer.js`** via `npm run bridge`.

### 3. UI (Vite + React)

```bash
cd ui
npm install
npm run dev
```

Open the URL printed in the terminal (Vite dev server). Production build: `npm run build`.

### 4. IoT gateway (optional — serial ↔ OhStem)

For a PC connected to the YoloBit/micro:bit over USB serial while using OhStem MQTT.

```bash
cd iot
pip install -r requirements.txt
```

Copy `iot/.env.example` to `iot/.env` and set `OHSTEM_TOPIC_PREFIX`, credentials, and `SERIAL_PORT` if auto-detect fails.

```bash
python IoT_Gateway.py
```

### Typical local order

1. Start **MongoDB**.  
2. Start **API** (`api`).  
3. Start **bridge** (`gateway` → `npm run bridge`).  
4. Start **UI** (`ui` → `npm run dev`).  
5. Optionally start **`iot/IoT_Gateway.py`** if you use the USB serial path.


## UI/UX
- **DASHBOARD**

<img width="1862" height="907" alt="image" src="https://github.com/user-attachments/assets/ab64a3f9-8e2f-4956-b366-d413a8bb01ae" />

## Contributor
<a href="https://github.com/funacius/yolofarm_Group-7_HK252/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=funacius/yolofarm_Group-7_HK252" />
</a>
