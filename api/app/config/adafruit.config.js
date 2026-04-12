/**
 * @deprecated YoloFarm uses OhStem MQTT. Kept for optional migration scripts only.
 */
require("dotenv").config();

const username = process.env.ADAFRUIT_USERNAME || "";
const feedKey = process.env.ADAFRUIT_AIO_KEY || "";
const url = `https://io.adafruit.com/api/v2/${username}/feeds`;

module.exports = { url, feedKey, username };
