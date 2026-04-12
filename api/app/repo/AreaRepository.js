const { Area, Light, WaterPump } = require("../models/models");
const axios = require("axios");
class AreaRepository {
  constructor({ db }) {
    this.db = db;
  }
  async all() {
    try {
      const areas = await Area.find({});
    //   console.log(area);
      return areas;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = AreaRepository;
