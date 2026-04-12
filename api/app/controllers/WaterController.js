// const axios = require("axios");
// const adafruit = require("../config/adafruit.config");
// const { Area, WaterPump } = require("../models/models");

// const index = (req, res) => {
//   axios
//     .get(adafruit_url)
//     .then((response) => {
//       res.json(response.data);
//     })
//     .catch((error) => {
//       console.error("Error fetching data:", error);
//     });
// };
// //  Get All Area
// const getAllArea = async (req, res) => {
//   try {
//     const areas = await Area.find({});
//     return res.status(200).json(areas);
//   } catch (error) {
//     console.log(error);
//   }
// };
// // Create Area
// const createArea = async (req, res) => {
//   try {
//     const newArea = new Area();
//     newArea.name = req.body.name;
//     await newArea.save();
//     return res.status(200).json({
//       newArea,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
// // Get All Pump from One Area
// const getPumpFromArea = async (req, res) => {
//   try {
//     const area_id = req.params.id;
//     const pumps = await WaterPump.find({ area_id });
//     return res.status(200).json(pumps);
//   } catch (error) {
//     console.log(error);
//   }
// };
// const getPumpFromAda = async (req, res) => {
//   try {
//     axios
//       .get(`https://io.adafruit.com/api/v2/viet_hcmut/feeds/data/${feedKey}`)
//       .then((response) => {
//         res.json(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//       });
//   } catch (error) {
//     console.log(error);
//   }
// };
// // Create Pump
// const createPumpFromArea = async (req, res) => {
//   try {
//     const newPump = new WaterPump();
//     newPump.name = req.body.name;
//     newPump.area_id = req.body.area_id;
//     await newPump.save();
//     return res.status(200).json({
//       newPump,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
// // Update Pumps By Id
// const updatePumpById = async (req, res) => {
//   try {
//     const pump = await WaterPump.findOneAndUpdate(
//       { _id: req.params.id },
//       { ada_id: req.body.ada_id }
//     );
//     if (!pump) {
//       return res.status(404).json({
//         message: "Not found pump",
//       });
//     }
//     return res.status(200).json({
//       pump,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
// // Change State Pump
// const getPumpById = async (req, res) => {
//   try {
//     const pump = await WaterPump.findById(req.params.id);
//     if (!pump) {
//       return res.status(404).json({
//         message: "Not found pump",
//       });
//     }
//     return res.status(200).json({
//       pump,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
// // Turn On off
// const changeStatePump = async (req, res) => {
//   try {
//     const pump_id = req.body.pump_id;
//     const pump = await WaterPump.findById(pump_id);
//     pump.status = !pump.status;
//     data = pump.status === true ? "1" : "0";
//     await axios
//       .post(
//         `https://io.adafruit.com/api/v2/viet_hcmut/feeds/${pump.ada_id}/data/`,
//         { value: data },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "X-AIO-Key": adafruit.feedKey,
//           },
//         }
//       )
//       .then((res) => {
//         // console.log(res);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//     await pump.save();
//     return res.status(200).json(pump);
//   } catch (error) {
//     console.log(error);
//   }
// };

// const getAutoTimeByWaterId = async(req,res) => {

// }

// // set up auto for timer
// const changeAutoTimer = async (req, res) => {

// }
// // set up auto for sensor
// const changeAutoSensor = async (req,res) => {

// }


// module.exports = {
//   index,
//   getAllArea,
//   createArea,
//   getPumpFromArea,
//   createPumpFromArea,
//   changeStatePump,
//   getPumpById,
//   getPumpFromAda,
//   updatePumpById,
//   changeAutoSensor,
//   changeAutoTimer,
//   getAutoTimeByWaterId,
// };

// const WaterService = require("../services/WaterService.js");
// const PumpRepository = require("../repo/PumpRepository.js");

// class WaterController {
//   constructor({ waterService }) {
//     this._waterService = waterService;
//     this.getAll = this.getAll.bind(this);
//     this.getPumpById = this.getPumpById.bind(this);
//     this.changeStatePump = this.changeStatePump.bind(this);
//   }
//   async getAll(req, res) {
//     return this._waterService.getAllPump(req, res);
//   }

//   async getPumpById(req, res) {
//     return this._waterService.getOnePump(req, res);
//   }

//   async changeStatePump(req, res) {
//     try {
//       return this._waterService.update(req, res);
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }

// module.exports = WaterController;


class WaterController {
  constructor({ waterService }) {
    this._waterService = waterService;
    this.getAll = this.getAll.bind(this);
    this.getPumpById = this.getPumpById.bind(this);
    this.changeStatePump = this.changeStatePump.bind(this);
    this.getPumpByAreaId = this.getPumpByAreaId.bind(this);
    this.changeAuto = this.changeAuto.bind(this);
    this.changePumpOn = this.changePumpOn.bind(this);
    this.getTimer = this.getTimer.bind(this);
    this.updateTimer = this.updateTimer.bind(this);
    this.createTimer = this.createTimer.bind(this);
  }
  async getAll(req, res) {
    return this._waterService.getAllPump(req, res);
  }

  async getPumpById(req, res) {
    try {
      const pump = await this._waterService.getOnePump(req, res);
      // .then((res) => console.log(res));
      return res.status(200).json(pump);
    } catch (error) {
      console.log(error);
    }
  }

  async changeStatePump(req, res) {
    try {
      return await this._waterService.update(req, res);
      // .then((result) => console.log(result));
    } catch (error) {
      console.log(error);
    }
  }

  async getPumpByAreaId(req, res) {
    try {
      this._waterService.getPumpByAreaId(req, res).then((result) => {
        const pumps = result;
        // console.log(pumps);
        return res.status(200).json(pumps);
      });
    } catch (error) {
      console.log(error);
    }
  }
  
  async changeAuto(req, res) {
    try {
      this._waterService.changeAuto(req, res);
      // .then((res) => console.log(res));
      return res.status(200).json("The Auto Change");
    } catch (error) {
      console.log(error);
    }
  }

  async changePumpOn(req, res) {
    try {
      this._waterService.updateMany(req, res);
      return res.status(200).json("Updated Pumps Successfull");
    } catch (error) {
      console.log(error);
    }
  }

  async updateTimer(req, res) {
    try {
      this._waterService.updateTimer(req, res).then((result) => {
        // console.log(res);
        return res.status(200).json(result);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getTimer(req, res) {
    try {
      this._waterService.getTimer(req, res).then((result) => {
        return res.status(200).json(result);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async createTimer(req, res) {
    try {
      this._waterService.creatTimer(req, res).then((res) => console.log(res));
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = WaterController;
