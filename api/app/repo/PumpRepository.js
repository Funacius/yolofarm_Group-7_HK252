const { Area, WaterPump, WateringTimer } = require("../models/models");
const axios = require("axios");
class PumpRepository {
  constructor({ db }) {
    this.db = db;
  }
  async all(req, res) {
    try {
      const pumps = await WaterPump.find({});
      return res.status(200).json(pumps);
    } catch (error) {
      console.log(error);
    }
  }

  async findPumpById(id) {
    try {
      const PumpRecord = await WaterPump.findById({ id: id });
      return PumpRecord;
    } catch (error) {
      console.log(error);
    }
  }

  async FindByIdArea(area_id) {
    try {
      const PumpRecord = await WaterPump.find({ area_id: area_id });
      return PumpRecord;
    } catch (error) {
      console.log(error);
    }
  }

  async update(pump_id) {
    try {
      const PumpRecord = await WaterPump.findById({ _id: pump_id });
      PumpRecord.status = !PumpRecord.status;
      const data = PumpRecord.status === true ? "1" : "0";
      await this.createRequest(PumpRecord.ada_id, data);
      await PumpRecord.save();
    } catch (error) {
      console.log(error);
    }
  }


  async updateMode(pump_id, mode, status) {
    try {
      const PumpRecord = await WaterPump.findById({ _id: pump_id });
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
    } catch (error) {
      console.log(error);
    }
  }
  
  async updateMany(pump_id, action, status) {
    try {
      if (action === "one") {
        const PumpRecord = await WaterPump.findOne({ _id: pump_id });
        PumpRecord.status = status === "on" ? true : false;
        // var data = status === true ? "1" : "0";
        await this.createRequest(
          PumpRecord.ada_id,
          status === "on" ? "1" : "0"
        );
        await PumpRecord.save();
      } else if (action === "many") {
        const PumpRecord = await WaterPump.findById({ _id: pump_id });
        const PumpRecords = await WaterPump.find({
          area_id: PumpRecord.area_id,
        });
        const data = status === "on" ? "1" : "0";
        PumpRecords.map((f) => {
          f.status = PumpRecord.status = status === "on" ? true : false;
          this.createRequest(f.ada_id, data);
          f.save();
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getTimer(pump_id) {
    try {
      console.log("repo", pump_id);
      const timeSchedule = await WateringTimer.findOne({ WaterPump_id: pump_id });
      return timeSchedule;
    } catch (error) {
      console.log(error);
    }
  }

  async updateTimer(pump_id, ontime1, ontime2) {
    try {
      console.log("repo", pump_id);
      const timeSchedule = await WateringTimer.findOneAndUpdate(
        { WaterPump_id: pump_id },
        {
          on_time_1: ontime1,
          on_time_2: ontime2,
          // on_time: ontime,
          // off_time: offtime,
        },
        { upsert: true, new: true }
      );
      return timeSchedule;
    } catch (error) {
      console.log(error);
    }
  }

  async createRequest(ada_id, data) {
    try {
      await axios
        .post(
          `https://io.adafruit.com/api/v2/viet_hcmut/feeds/${ada_id}/data/`,
          { value: data },
          {
            headers: {
              "Content-Type": "application/json",
              "X-AIO-Key": process.env.ADA_FEEDKEY,
            },
          }
        )
        .then((res) => {
          // console.log(res);
          return res;
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = PumpRepository;
