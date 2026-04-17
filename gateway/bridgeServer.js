require("dotenv").config();
const express = require("express");
const mqtt = require("mqtt");
const axios = require("axios");

const MQTT_URL = process.env.OHSTEM_MQTT_URL || "mqtt://mqtt.ohstem.vn:1883";
const MQTT_USER = process.env.OHSTEM_MQTT_USER || "";
const MQTT_PASSWORD = process.env.OHSTEM_MQTT_PASSWORD || "";
const TOPIC_PREFIX = (process.env.OHSTEM_TOPIC_PREFIX || "").replace(/\/$/, "");
const API_BASE_URL = process.env.API_BASE_URL || "http://127.0.0.1:3001";
const INTERNAL_INGEST_TOKEN = process.env.INTERNAL_INGEST_TOKEN || "";
const BRIDGE_PUBLISH_TOKEN = process.env.BRIDGE_PUBLISH_TOKEN || "";
const DEFAULT_AREA_ID = parseInt(process.env.DEFAULT_AREA_ID || "1", 10);
const PORT = parseInt(process.env.BRIDGE_PORT || "3000", 10);
/** Giữ bản tin cuối trên broker — bảng điều khiển OhStem web/App đọc đúng trạng thái */
const PUBLISH_RETAIN =
  String(process.env.OHSTEM_PUBLISH_RETAIN ?? "1").trim() !== "0";

const app = express();
app.use(express.json());

const client = mqtt.connect(MQTT_URL, {
  username: MQTT_USER || undefined,
  password: MQTT_PASSWORD || undefined,
  reconnectPeriod: 3000,
});

client.on("error", (err) => console.error("[mqtt]", err.message));
client.on("connect", () => {
  console.log("[mqtt] connected", MQTT_URL);
  if (!TOPIC_PREFIX) {
    console.warn(
      "[mqtt] OHSTEM_TOPIC_PREFIX empty — set e.g. myuser/feeds to subscribe"
    );
    return;
  }
  const subTopic = `${TOPIC_PREFIX}/#`;
  client.subscribe(subTopic, (err) => {
    if (err) console.error("[mqtt] subscribe error", err);
    else console.log("[mqtt] subscribed", subTopic);
  });
});

let _apiDown = false;
let _apiDownLoggedAt = 0;

client.on("message", async (topic, payloadBuf) => {
  if (!INTERNAL_INGEST_TOKEN) return;
  const suffix = topic.split("/").filter(Boolean).pop();
  if (!suffix) return;
  const value = payloadBuf.toString();
  try {
    await axios.post(
      `${API_BASE_URL}/api/iot/ingest`,
      {
        area_id: DEFAULT_AREA_ID,
        feedSuffix: suffix,
        value,
      },
      {
        headers: {
          "X-Internal-Token": INTERNAL_INGEST_TOKEN,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );
    if (_apiDown) {
      console.log("[ingest] API reconnected — ingest resumed");
      _apiDown = false;
    }
  } catch (e) {
    const status = e.response?.status;
    const data = e.response?.data;
    const isConn = /ECONNREFUSED|ECONNRESET|ETIMEDOUT|ENOTFOUND/.test(e.message);
    if (isConn) {
      const now = Date.now();
      if (!_apiDown || now - _apiDownLoggedAt > 30000) {
        console.warn(
          `[ingest] API unreachable (${API_BASE_URL}) — chạy API và khớp API_BASE_URL trong gateway/.env`
        );
        _apiDownLoggedAt = now;
      }
      _apiDown = true;
      return;
    }
    if (status === 400 && data?.error) {
      console.warn("[ingest] 400:", data.error);
    } else {
      console.error("[ingest]", e.message);
    }
  }
});

app.get("/", (_req, res) => {
  res.type("text").send("YoloFarm MQTT bridge — POST /bridge/publish");
});

app.post("/bridge/publish", (req, res) => {
  const token = req.get("X-Bridge-Token");
  if (!BRIDGE_PUBLISH_TOKEN || token !== BRIDGE_PUBLISH_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const topic = req.body.topic;
  const payload = req.body.payload;
  if (!topic) return res.status(400).json({ error: "topic required" });
  if (!client.connected) {
    return res.status(503).json({ error: "MQTT not connected" });
  }
  client.publish(topic, String(payload ?? ""), { retain: PUBLISH_RETAIN }, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ ok: true });
  });
});

app.listen(PORT, () => {
  console.log(`YoloFarm bridge HTTP on ${PORT}`);
});
