/**
 * Kiểm tra kết nối MQTT OhStem + subscribe prefix (dùng cùng biến môi trường với bridge).
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mqtt = require("mqtt");

const MQTT_URL = process.env.OHSTEM_MQTT_URL || "mqtt://mqtt.ohstem.vn:1883";
const MQTT_USER = process.env.OHSTEM_MQTT_USER || "";
const MQTT_PASSWORD = process.env.OHSTEM_MQTT_PASSWORD || "";
const TOPIC_PREFIX = (process.env.OHSTEM_TOPIC_PREFIX || "").replace(/\/$/, "");

const client = mqtt.connect(MQTT_URL, {
  username: MQTT_USER || undefined,
  password: MQTT_PASSWORD || undefined,
  reconnectPeriod: 0,
  connectTimeout: 10_000,
});

client.on("error", (err) => {
  console.error("[ohstem-check] MQTT error:", err.message);
  process.exit(1);
});

client.on("connect", () => {
  console.log("[ohstem-check] OK — connected to", MQTT_URL);
  if (!TOPIC_PREFIX) {
    console.warn("[ohstem-check] OHSTEM_TOPIC_PREFIX trống — chỉ kiểm tra connect.");
    client.end();
    process.exit(0);
    return;
  }
  const subTopic = `${TOPIC_PREFIX}/#`;
  client.subscribe(subTopic, (err) => {
    if (err) {
      console.error("[ohstem-check] subscribe failed:", err.message);
      process.exit(1);
    }
    console.log("[ohstem-check] OK — subscribed", subTopic);
    console.log("[ohstem-check] Done (connect + subscribe).");
    client.end();
    process.exit(0);
  });
});

setTimeout(() => {
  console.error("[ohstem-check] Timeout connecting to broker");
  process.exit(1);
}, 12_000);
