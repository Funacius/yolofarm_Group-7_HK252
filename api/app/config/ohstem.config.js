/**
 * OhStem MQTT / IoT — load from environment (no secrets in source).
 */
require("dotenv").config();

const mqttHost = process.env.OHSTEM_MQTT_HOST || "mqtt.ohstem.vn";
const mqttPort = parseInt(process.env.OHSTEM_MQTT_PORT || "1883", 10);
const mqttUsername = process.env.OHSTEM_MQTT_USER || "";
const mqttPassword = process.env.OHSTEM_MQTT_PASSWORD || "";

module.exports = {
  mqttUrl:
    process.env.OHSTEM_MQTT_URL ||
    `mqtt://${mqttHost}:${mqttPort}`,
  mqttHost,
  mqttPort,
  mqttUsername,
  mqttPassword,
  /** Full topic prefix e.g. myuser/feeds — bridge subscribes to `${prefix}/#` */
  topicPrefix: process.env.OHSTEM_TOPIC_PREFIX || "",
  internalIngestToken: process.env.INTERNAL_INGEST_TOKEN || "dev-ingest-token-change-me",
  bridgeBaseUrl: process.env.BRIDGE_BASE_URL || "http://127.0.0.1:3000",
  bridgePublishToken: process.env.BRIDGE_PUBLISH_TOKEN || "dev-bridge-publish-change-me",
};
