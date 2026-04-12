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
  gdd: Number,
  date: Date,
  time: String,
  area_id: Number,
});

/** Latest merged telemetry + actuator state per zone (updated by MQTT bridge). */
const FarmSnapshotSchema = new mongoose.Schema(
  {
    area_id: { type: Number, required: true, unique: true },
    temperature: Number,
    air_humidity: Number,
    soil_moisture: Number,
    light: Number,
    gdd: Number,
    pump1: String,
    pump2: String,
    rc_servo: String,
    buzzer: String,
    led1: String,
    led2: String,
    lcd: String,
    updatedAt: { type: Date, default: Date.now },
    lastHistoryAt: Date,
  },
  { collection: "farmsnapshots" }
);

/** FR4 — watering time windows per pump (minutes from midnight). */
const IrrigationScheduleSchema = new mongoose.Schema({
  area_id: { type: Number, required: true },
  pumpKey: { type: String, required: true },
  windows: [
    {
      startMinute: { type: Number, required: true },
      endMinute: { type: Number, required: true },
    },
  ],
});

/** FR3 — hysteresis / anti-chatter for auto irrigation (used by edge or future server logic). */
const IrrigationConfigSchema = new mongoose.Schema({
  area_id: { type: Number, required: true, unique: true },
  soilMoistureOnBelow: { type: Number, default: 40 },
  soilMoistureOffAbove: { type: Number, default: 65 },
  minPumpSwitchIntervalSec: { type: Number, default: 120 },
});

const AiInferenceSchema = new mongoose.Schema({
  area_id: Number,
  kind: { type: String, enum: ["plant_health", "harvest"], required: true },
  label: String,
  confidence: Number,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
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
const FarmSnapshot = mongoose.model("FarmSnapshot", FarmSnapshotSchema);
const IrrigationSchedule = mongoose.model(
  "IrrigationSchedule",
  IrrigationScheduleSchema
);
const IrrigationConfig = mongoose.model(
  "IrrigationConfig",
  IrrigationConfigSchema
);
const AiInference = mongoose.model("AiInference", AiInferenceSchema);
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
  FarmSnapshot,
  IrrigationSchedule,
  IrrigationConfig,
  AiInference,
  Buzzer,
  LCDScreen,
};
