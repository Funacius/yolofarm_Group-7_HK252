const axios = require("axios");
const ohstem = require("../config/ohstem.config");
const channelMap = require("../config/channel-map");

/** Map legacy Adafruit feed keys → logical fields (then → V* via channel-map). */
const LEGACY_ADA_ID_TO_FIELD = {
  maybom: "pump1",
  "khuvuc1.maybom": "pump1",
  led1: "led1",
  "khuvuc1.led1": "led1",
  led2: "led2",
  "khuvuc1.led2": "led2",
  buzzer: "buzzer",
  "khuvuc1.buzzer": "buzzer",
  lcd: "lcd",
  "khuvuc1.lcd": "lcd",
};

/**
 * Publish a value to OhStem via the gateway bridge.
 * @param {string} adaIdOrField — OhStem feed suffix (e.g. V10) or logical field (e.g. led1)
 * @param {string|number} value
 */
async function publishToOhStem(adaIdOrField, value) {
  const prefix = (ohstem.topicPrefix || "").replace(/\/$/, "");
  if (!prefix) {
    console.warn("[mqttPublish] OHSTEM_TOPIC_PREFIX not set; skip publish");
    return;
  }

  let suffix = String(adaIdOrField || "").trim();
  if (!suffix) return;

  const legacyField = LEGACY_ADA_ID_TO_FIELD[suffix];
  if (legacyField) {
    const mapped = channelMap.fieldToSuffix(legacyField);
    suffix = mapped || suffix;
  } else if (!/^V\d+$/i.test(suffix)) {
    const mapped = channelMap.fieldToSuffix(suffix);
    if (mapped) suffix = mapped;
  } else {
    suffix = suffix.toUpperCase();
  }

  const topic = `${prefix}/${suffix}`;
  try {
    await axios.post(
      `${ohstem.bridgeBaseUrl}/bridge/publish`,
      { topic, payload: String(value) },
      {
        headers: {
          "X-Bridge-Token": ohstem.bridgePublishToken,
          "Content-Type": "application/json",
        },
        timeout: 8000,
      }
    );
  } catch (e) {
    console.error("[mqttPublish]", e.message);
  }
}

module.exports = { publishToOhStem };
