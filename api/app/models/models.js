const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const TemperatureThresholdSchema = new mongoose.Schema({
  level1: Number,
  level2: Number,
  level3: Number,
  level4: Number,
  area_id: Number,
});

const AirHumidityThresholdSchema = new mongoose.Schema({
  level1: Number,
  level2: Number,
  level3: Number,
  level4: Number,
  area_id: Number,
});

const SoilMoistureThresholdSchema = new mongoose.Schema({
  level1: Number,
  level2: Number,
  level3: Number,
  level4: Number,
  area_id: Number,
});

const LightThresholdSchema = new mongoose.Schema({
  level1: Number,
  level2: Number,
  level3: Number,
  level4: Number,
  area_id: Number,
});

const AreaSchema = new mongoose.Schema({
  name: String,
});

const WateringTimerSchema = new mongoose.Schema({
  on_time_1: String,
  on_time_2: String,
  // on_time: String,
  // off_time: String,
  pump_id: { type: String },
});

const WaterPumpSchema = new mongoose.Schema({
  name: { type: String },
  ada_id: { type: String },
  status: { type: Boolean, default: false },
  area_id: { type: String },
  is_applied_timer: { type: Boolean, default: false },
  is_applied_sensor: { type: Boolean, default: false },
});

const LightSchema = new mongoose.Schema({
  name: { type: String },
  ada_id: { type: String },
  status: { type: Boolean, default: false },
  area_id: { type: String },
  is_applied_timer: { type: Boolean, default: false },
  is_applied_sensor: { type: Boolean, default: false },
});

const LightTimerSchema = new mongoose.Schema({
  on_time: String,
  off_time: String,
  light_id: { type: String },
});

const LogSchema = new mongoose.Schema({
  temperature: Number,
  air_humidity: Number,
  soil_moisture: Number,
  light: Number,
  date: Date,
  time: String,
  area_id: Number,
});

const BuzzerSchema = new mongoose.Schema({
  name: String,
  status: Boolean,
  area_id: Number,
});

const LCDScreenSchema = new mongoose.Schema({
  name: String,
  status: Boolean,
  area_id: Number,
});

const Account = mongoose.model("Account", AccountSchema);
const TemperatureThreshold = mongoose.model(
  "TemperatureThreshold",
  TemperatureThresholdSchema
);
const AirHumidityThreshold = mongoose.model(
  "AirHumidityThreshold",
  AirHumidityThresholdSchema
);
const SoilMoistureThreshold = mongoose.model(
  "SoilMoistureThreshold",
  SoilMoistureThresholdSchema
);
const LightThreshold = mongoose.model("LightThreshold", LightThresholdSchema);
const Area = mongoose.model("Area", AreaSchema);
const WateringTimer = mongoose.model("WateringTimer", WateringTimerSchema);
const WaterPump = mongoose.model("WaterPump", WaterPumpSchema);
const Light = mongoose.model("Light", LightSchema);
const LightTimer = mongoose.model("LightTimer", LightTimerSchema);
const Log = mongoose.model("Log", LogSchema);
const Buzzer = mongoose.model("Buzzer", BuzzerSchema);
const LCDScreen = mongoose.model("LCDScreen", LCDScreenSchema);

module.exports = {
  Account,
  TemperatureThreshold,
  AirHumidityThreshold,
  SoilMoistureThreshold,
  LightThreshold,
  Area,
  WateringTimer,
  WaterPump,
  Light,
  LightTimer,
  Log,
  Buzzer,
  LCDScreen,
};
