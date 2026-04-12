/**
 * Maps OhStem dashboard feed suffix (e.g. V1, V5, V10) → FarmSnapshot / ingest field.
 * Override with env OHSTEM_CHANNEL_MAP (JSON object).
 */
const ohstem = require("./ohstem.config");

const DEFAULT_MAP = {
  V1: "temperature",
  V2: "air_humidity",
  V3: "soil_moisture",
  V4: "light",
  V5: "gdd",
  V6: "buzzer",
  V7: "led1",
  V8: "led2",
  V9: "lcd",
  V10: "pump1",
  V11: "pump2",
  /** FR8 RC / actuator — map to your OhStem feed name if different */
  V12: "rc_servo",
};

function loadMap() {
  const raw = process.env.OHSTEM_CHANNEL_MAP;
  if (!raw) return { ...DEFAULT_MAP };
  try {
    return { ...DEFAULT_MAP, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_MAP };
  }
}

const suffixToField = loadMap();

/** Reverse: logical field → feed suffix (first match) */
function fieldToSuffix(field) {
  for (const [suf, f] of Object.entries(suffixToField)) {
    if (f === field) return suf;
  }
  return null;
}

function feedSuffixFromTopic(topic) {
  if (!topic || !ohstem.topicPrefix) return null;
  const prefix = ohstem.topicPrefix.endsWith("/")
    ? ohstem.topicPrefix.slice(0, -1)
    : ohstem.topicPrefix;
  if (!topic.startsWith(prefix + "/")) return null;
  const rest = topic.slice(prefix.length + 1);
  const parts = rest.split("/");
  return parts[parts.length - 1] || null;
}

module.exports = {
  DEFAULT_MAP,
  suffixToField,
  fieldToSuffix,
  feedSuffixFromTopic,
};
