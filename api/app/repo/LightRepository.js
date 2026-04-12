const { Area, Light, LightTimer } = require("../models/models");
const axios = require("axios");
class LightRepository {
  constructor({ db }) {
    this.db = db;
  }
  async all(req, res) {
    try {
      const lights = await Light.find({});
      return res.status(200).json(lights);
    } catch (error) {
      console.log(error);
    }
  }

  async findLightById(id) {
    try {
      const LightRecord = await Light.findById({ _id: id });
      // console.log(LightRecord)
      return LightRecord;
    } catch (error) {
      console.log(error);
    }
  }

  async FindByIdArea(area_id) {
    try {
      const LightRecord = await Light.find({ area_id: area_id });
      return LightRecord;
    } catch (error) {
      console.log(error);
    }
  }

  async update(bulb_id) {
    try {
      const LightRecord = await Light.findById({ _id: bulb_id });
      LightRecord.status = !LightRecord.status;
      const data = LightRecord.status === true ? "1" : "0";
      // console.log("Repo", LightRecord, " | ", data, " | ", LightRecord.ada_id);
      await this.createRequest(LightRecord.ada_id, data);
      await LightRecord.save();
    } catch (error) {
      console.log(error);
    }
  }

  async updateMode(bulb_id, mode, status) {
    try {
      const LightRecord = await Light.findById({ _id: bulb_id });
      if (mode == "sensor") {
        LightRecord.is_applied_sensor = status;
        LightRecord.is_applied_timer = false;
      } else if (mode == "timer") {
        LightRecord.is_applied_timer = status;
        LightRecord.is_applied_sensor = false;
      } else if (mode == "both") {
        LightRecord.is_applied_timer = status;
        LightRecord.is_applied_sensor = status;
      }
      return await LightRecord.save();
    } catch (error) {
      console.log(error);
    }
  }

  async updateMany(bulb_id, action, status) {
    try {
      if (action === "one") {
        const LightRecord = await Light.findOne({ _id: bulb_id });
        LightRecord.status = status === "on" ? true : false;
        // var data = status === true ? "1" : "0";
        await this.createRequest(
          LightRecord.ada_id,
          status === "on" ? "1" : "0"
        );
        await LightRecord.save();
      } else if (action === "many") {
        const LightRecord = await Light.findById({ _id: bulb_id });
        const LightRecords = await Light.find({
          area_id: LightRecord.area_id,
        });
        const data = status === "on" ? "1" : "0";
        LightRecords.map((f) => {
          f.status = LightRecord.status = status === "on" ? true : false;
          this.createRequest(f.ada_id, data);
          f.save();
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getTimer(bulb_id) {
    try {
      console.log("repo", bulb_id);
      const timeSchedule = await LightTimer.findOne({ light_id: bulb_id });
      return timeSchedule;
    } catch (error) {
      console.log(error);
    }
  }

  async updateTimer(bulb_id, ontime, offtime) {
    try {
      console.log("repo", bulb_id);
      const timeSchedule = await LightTimer.findOneAndUpdate(
        { light_id: bulb_id },
        {
          on_time: ontime,
          off_time: offtime,
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

module.exports = LightRepository;
