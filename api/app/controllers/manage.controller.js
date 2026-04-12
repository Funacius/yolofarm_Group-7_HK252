// const axios = require('axios');
// const adafruit_url = require('../config/adafruit.config');
// const {TemperatureThreshold, SoilMoistureThreshold, AirHumidityThreshold, LightThreshold} = require('../models/models');


// const readTempThreshold = async (req,res)=>{
//     try {
//         const temp = await TemperatureThreshold.find({});
//         return res.status(200).json(temp);
//     } catch (error) {
//         res.json({
//             error: error
//         })
//     }
// }

// const createTempThreshold = async (req,res)=>{
//     try {
//         const newTemp = new TemperatureThreshold();
//         newTemp.level1 = req.body.level1;
//         newTemp.level2 = req.body.level2;
//         newTemp.area_id = req.body.area_id;

//         await newTemp.save();

//         return res.status(200).json(newTemp);
//     } catch (error) {
//         res.json({
//             error: error
//         })
//     }
// }

// const updateTempThreshold = async(req,res)=>{
//     try {
//         const id = req.params.id;
//         const level1 = req.body.level1;
//         const level2 = req.body.level2;
//         const area_id = req.body.area_id;

//         const temp = await TemperatureThreshold.updateOne(
//             { _id : id},
//             {
//                 $set: { level1: level1, level2: level2, area_id:area_id },
//             }

//         );

//         return res.status(200).json(temp);
//     } catch (error) {
//         res.json({
//             error: error
//         })
//     }
// }

// const deleteTempThreshold = async(req,res)=>{
//     try {
//         const id = req.params.id;
//         const temp = await TemperatureThreshold.deleteOne({_id:id});

//         return res.status(200).json(temp);
//     } catch (error) {
//         res.json({
//             error: error
//         })
//     }
// }




// const readAirThreshold = async (req,res)=>{
//     try {
//         const temp = await AirHumidityThreshold.find({});
//         return res.status(200).json(temp);
//     } catch (error) {
//         res.json({
//             error: error
//         })
//     }
// }

// const createAirThreshold = async (req,res)=>{
//     try {
//         const newTemp = new AirHumidityThreshold();
//         newTemp.level1 = req.body.level1;
//         newTemp.level2 = req.body.level2;
//         newTemp.area_id = req.body.area_id;

//         await newTemp.save();

//         return res.status(200).json(newTemp);
//     } catch (error) {
//         res.json({
//             error: error
//         })
//     }
// }

// const updateAirThreshold = async(req,res)=>{
//     try {
//         const id = req.params.id;
//         const level1 = req.body.level1;
//         const level2 = req.body.level2;
//         const area_id = req.body.area_id;

//         const temp = await AirHumidityThreshold.updateOne(
//             { _id : id},
//             {
//                 $set: { level1: level1, level2: level2, area_id:area_id },
//             }

//         );

//         return res.status(200).json(temp);
//     } catch (error) {
//         res.json({
//             error: error
//         })
//     }
// }

// const deleteAirThreshold = async(req,res)=>{
//     try {
//         const id = req.params.id;
//         const temp = await AirHumidityThreshold.deleteOne({_id:id});

//         return res.status(200).json(temp);
//     } catch (error) {
//         res.json({
//             error: error
//         })
//     }
// }


// const readSoilThreshold = async (req,res)=>{
//     try {
//         const temp = await SoilMoistureThreshold.find({});
//         return res.status(200).json(temp);
//     } catch (error) {
//         res.json({
//             error: error
//         })
//     }
// }

// const createSoilThreshold = async (req,res)=>{
//     try {
//         const newTemp = new SoilMoistureThreshold();
//         newTemp.level1 = req.body.level1;
//         newTemp.level2 = req.body.level2;
//         newTemp.area_id = req.body.area_id;

//         await newTemp.save();

//         return res.status(200).json(newTemp);
//     } catch (error) {
//         res.json({
//             error: error
//         })
//     }
// }

// const updateSoilThreshold = async(req,res)=>{
//     try {
//         const id = req.params.id;
//         const level1 = req.body.level1;
//         const level2 = req.body.level2;
//         const area_id = req.body.area_id;

//         const temp = await SoilMoistureThreshold.updateOne(
//             { _id : id},
//             {
//                 $set: { level1: level1, level2: level2, area_id:area_id },
//             }

//         );

//         return res.status(200).json(temp);
//     } catch (error) {
//         res.json({
//             error: error
//         })
//     }
// }

// const deleteSoilThreshold = async(req,res)=>{
//     try {
//         const id = req.params.id;
//         const temp = await SoilMoistureThreshold.deleteOne({_id:id});

//         return res.status(200).json(temp);
//     } catch (error) {
//         res.json({
//             error: error
//         })
//     }
// }




// const readLightThreshold = async (req,res)=>{
//     try {
//         const temp = await LightThreshold.find({});
//         return res.status(200).json(temp);
//     } catch (error) {
//         res.json({
//             error: error
//         })
//     }
// }

// const createLightThreshold = async (req,res)=>{
//     try {
//         const newTemp = new LightThreshold();
//         newTemp.level1 = req.body.level1;
//         newTemp.level2 = req.body.level2;
//         newTemp.area_id = req.body.area_id;

//         await newTemp.save();

//         return res.status(200).json(newTemp);
//     } catch (error) {
//         res.json({
//             error: error
//         })
//     }
// }

// const updateLightThreshold = async(req,res)=>{
//     try {
//         const id = req.params.id;
//         const level1 = req.body.level1;
//         const level2 = req.body.level2;
//         const area_id = req.body.area_id;

//         const temp = await LightThreshold.updateOne(
//             { _id : id},
//             {
//                 $set: { level1: level1, level2: level2, area_id:area_id },
//             }

//         );

//         return res.status(200).json(temp);
//     } catch (error) {
//         res.json({
//             error: error
//         })
//     }
// }

// const deleteLightThreshold = async(req,res)=>{
//     try {
//         const id = req.params.id;
//         const temp = await LightThreshold.deleteOne({_id:id});

//         return res.status(200).json(temp);
//     } catch (error) {
//         res.json({
//             error: error
//         })
//     }
// }



// module.exports = {
//     readTempThreshold, createTempThreshold, deleteTempThreshold, updateTempThreshold, 
//     readAirThreshold, createAirThreshold, deleteAirThreshold, updateAirThreshold,
//     readSoilThreshold, createSoilThreshold, deleteSoilThreshold, updateSoilThreshold,
//     readLightThreshold, createLightThreshold, deleteLightThreshold, updateLightThreshold,
    
// }







const ManageService = require("../services/ManageService.js");
const ManageRepository = require("../repo/ManageRepository.js");

class ManageController {
  constructor({ manageService }) {
    this._manageService = manageService;
    this.getTempThresh = this.getTempThresh.bind(this);
    this.updateTempThresh = this.updateTempThresh.bind(this);
    this.getLightThresh = this.getLightThresh.bind(this);
    this.updateLightThresh = this.updateLightThresh.bind(this);
    this.getAirThresh = this.getAirThresh.bind(this);
    this.updateAirThresh = this.updateAirThresh.bind(this);
    this.getSoilThresh = this.getSoilThresh.bind(this);
    this.updateSoilThresh = this.updateSoilThresh.bind(this);
  }
  async getTempThresh(req, res) {
    return this._manageService.getTempThresh(req, res);
  }

  async updateTempThresh(req, res) {
    return this._manageService.updateTempThresh(req, res);
  }

  async getLightThresh(req, res) {
    return this._manageService.getLightThresh(req, res);
  }

  async updateLightThresh(req, res) {
    return this._manageService.updateLightThresh(req, res);
  }

  async getAirThresh(req, res) {
    return this._manageService.getAirThresh(req, res);
  }

  async updateAirThresh(req, res) {
    return this._manageService.updateAirThresh(req, res);
  }

  async getSoilThresh(req, res) {
    return this._manageService.getSoilThresh(req, res);
  }

  async updateSoilThresh(req, res) {
    return this._manageService.updateSoilThresh(req, res);
  }

}

module.exports = ManageController;
