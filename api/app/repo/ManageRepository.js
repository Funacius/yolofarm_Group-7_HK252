const { TemperatureThreshold, LightThreshold, SoilMoistureThreshold, AirHumidityThreshold } = require("../models/models");

class ManageRepository {
  constructor({ db }) {
    this.db = db;
  }
  
    async getTempThresh(){
        try {
            const temp = await TemperatureThreshold.find({});
            return temp;
        } catch (error) {
            console.log(error);
        }
    }

    async updateTempThresh(ids, body){
        try {
            const id = ids;
            const level1 = body.level1;
            const level2 = body.level2;
            const area_id = body.area_id;
    
            const temp = await TemperatureThreshold.updateOne(
                { _id : id},
                {
                    $set: { level1: level1, level2: level2, area_id:area_id },
                }
    
            );
    
            return temp;
        } catch (error) {
            console.log(error);
        }
    }

    async getLightThresh(){
        try {
            const temp = await LightThreshold.find({});
            return temp;
        } catch (error) {
            console.log(error);
        }
    }

    async updateLightThresh(ids, body){
        try {
            const id = ids;
            const level1 = body.level1;
            const level2 = body.level2;
            const area_id = body.area_id;
    
            const temp = await LightThreshold.updateOne(
                { _id : id},
                {
                    $set: { level1: level1, level2: level2, area_id:area_id },
                }
    
            );
    
            return temp;
        } catch (error) {
            console.log(error);
        }
    }

    async getAirThresh(){
        try {
            const temp = await AirHumidityThreshold.find({});
            return temp;
        } catch (error) {
            console.log(error);
        }
    }

    async updateAirThresh(ids, body){
        try {
            const id = ids;
            const level1 = body.level1;
            const level2 = body.level2;
            const area_id = body.area_id;
    
            const temp = await AirHumidityThreshold.updateOne(
                { _id : id},
                {
                    $set: { level1: level1, level2: level2, area_id:area_id },
                }
    
            );
    
            return temp;
        } catch (error) {
            console.log(error);
        }
    }

    async getSoilThresh(){
        try {
            const temp = await SoilMoistureThreshold.find({});
            return temp;
        } catch (error) {
            console.log(error);
        }
    }

    async updateSoilThresh(ids, body){
        try {
            const id = ids;
            const level1 = body.level1;
            const level2 = body.level2;
            const area_id = body.area_id;
    
            const temp = await SoilMoistureThreshold.updateOne(
                { _id : id},
                {
                    $set: { level1: level1, level2: level2, area_id:area_id },
                }
    
            );
    
            return temp;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = ManageRepository;
