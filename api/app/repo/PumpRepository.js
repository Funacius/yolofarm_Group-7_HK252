const { WaterPump, WateringTimer, FarmSnapshot } = require("../models/models");
const { publishToOhStem } = require("../services/mqttPublish");
const channelMap = require("../config/channel-map");

/** Payload MQTT — khớp OhStem / YoloBit (Blockly thường so sánh == 'ON'), không dùng '1'/'0'. */
function pumpWire(isOn) {
  return isOn ? "ON" : "OFF";
}

function pumpSnapshotStr(isOn) {
  return isOn ? "ON" : "OFF";
}

async function syncFarmSnapshotForPump(area_id_str, ada_id, onOffStr) {
  const suf = String(ada_id || "").toUpperCase();
  const field = channelMap.suffixToField[suf];
  if (field !== "pump1" && field !== "pump2") return;
  const areaNum = Number(area_id_str);
  if (!Number.isFinite(areaNum)) return;
  await FarmSnapshot.findOneAndUpdate(
    { area_id: areaNum },
    { $set: { [field]: onOffStr, updatedAt: new Date() } },
    { upsert: true }
  );
}

function sortPumpsForUi(pumps) {
  const rank = (p) => {
    const ada = String(p.ada_id || "").toUpperCase();
    if (ada === "V10") return 0;
    if (ada === "V11") return 1;
    return 10;
  };
  return [...(pumps || [])].sort(
    (a, b) => rank(a) - rank(b) || String(a._id).localeCompare(String(b._id))
  );
}

class PumpRepository {
  constructor({ db }) {
    this.db = db;
  }

  async ensureDefaultPumpsForArea(areaIdRaw) {
    const areaId = String(areaIdRaw ?? "1");
    const defaults = [
      { name: "Máy bơm 1", ada_id: "V10", area_id: areaId },
      { name: "Máy bơm 2", ada_id: "V11", area_id: areaId },
    ];
    for (const d of defaults) {
      const exists = await WaterPump.findOne({ area_id: areaId, ada_id: d.ada_id });
      if (!exists) {
        await WaterPump.create({
          ...d,
          status: false,
          is_applied_timer: false,
          is_applied_sensor: false,
        });
      }
    }
  }

  async all() {
    return WaterPump.find({});
  }

  async findPumpById(id) {
    try {
      return await WaterPump.findById(id);
    } catch (error) {
      console.log(error);
    }
  }

  async FindByIdArea(area_id) {
    try {
      return await WaterPump.find({ area_id: String(area_id) });
    } catch (error) {
      console.log(error);
    }
  }

  async update(pump_id) {
    const PumpRecord = await WaterPump.findById(pump_id);
    if (!PumpRecord) {
      throw new Error("Pump not found");
    }
    PumpRecord.status = !PumpRecord.status;
    const on = PumpRecord.status === true;
    const wire = pumpWire(on);
    const snap = pumpSnapshotStr(on);
    await this.createRequest(PumpRecord.ada_id, wire);
    await PumpRecord.save();
    try {
      await syncFarmSnapshotForPump(PumpRecord.area_id, PumpRecord.ada_id, snap);
    } catch (e) {
      console.error("[PumpRepository] syncFarmSnapshotForPump", e.message);
    }
  }

  async updateMode(pump_id, mode, status) {
    const PumpRecord = await WaterPump.findById(pump_id);
    if (!PumpRecord) {
      throw new Error("Pump not found");
    }
    if (mode == "sensor") {
      PumpRecord.is_applied_sensor = status;
      PumpRecord.is_applied_timer = false;
    } else if (mode == "timer") {
      PumpRecord.is_applied_timer = status;
      PumpRecord.is_applied_sensor = false;
    } else if (mode == "both") {
      PumpRecord.is_applied_timer = status;
      PumpRecord.is_applied_sensor = status;
    }
    return await PumpRecord.save();
  }

  async updateMany(pump_id, action, status) {
    if (action === "one") {
      const PumpRecord = await WaterPump.findById(pump_id);
      if (!PumpRecord) {
        throw new Error("Pump not found");
      }
      const on = status === "on";
      PumpRecord.status = on;
      const wire = pumpWire(on);
      const snap = pumpSnapshotStr(on);
      await this.createRequest(PumpRecord.ada_id, wire);
      await PumpRecord.save();
      try {
        await syncFarmSnapshotForPump(PumpRecord.area_id, PumpRecord.ada_id, snap);
      } catch (e) {
        console.error("[PumpRepository] syncFarmSnapshotForPump", e.message);
      }
      return;
    }
    if (action === "many") {
      const PumpRecord = await WaterPump.findById(pump_id);
      if (!PumpRecord) {
        throw new Error("Pump not found");
      }
      const PumpRecords = await WaterPump.find({
        area_id: PumpRecord.area_id,
      });
      const on = status === "on";
      const wire = pumpWire(on);
      const snap = pumpSnapshotStr(on);
      for (const f of PumpRecords) {
        f.status = on;
        await this.createRequest(f.ada_id, wire);
        await f.save();
        try {
          await syncFarmSnapshotForPump(f.area_id, f.ada_id, snap);
        } catch (e) {
          console.error("[PumpRepository] syncFarmSnapshotForPump", e.message);
        }
      }
      return;
    }
    throw new Error('updateMany: action must be "one" or "many"');
  }

  async getTimer(pump_id) {
    try {
      return await WateringTimer.findOne({ WaterPump_id: pump_id });
    } catch (error) {
      console.log(error);
    }
  }

  async updateTimer(pump_id, ontime1, ontime2) {
    try {
      return await WateringTimer.findOneAndUpdate(
        { WaterPump_id: pump_id },
        {
          on_time_1: ontime1,
          on_time_2: ontime2,
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async createRequest(ada_id, data) {
    const suf = String(ada_id || "").toUpperCase();
    await publishToOhStem(ada_id, data);
    // Blockly mẫu OhStem dùng topic ngắn pump-1 / pump-2 (song song với V10 / V11)
    const alias = suf === "V10" ? "pump-1" : suf === "V11" ? "pump-2" : null;
    if (alias) {
      await publishToOhStem(alias, data);
    }
  }
}

PumpRepository.sortPumpsForUi = sortPumpsForUi;
module.exports = PumpRepository;
