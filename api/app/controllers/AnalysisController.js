const axios = require("axios");
const adafruit = require("../config/adafruit.config");
const { Log } = require("../models/models")

const storeData = (req,res) => {
    axios
    .get(adafruit.url)
    .then((response) => {
      data = response.data
      light = []
      soil_moisture = []
      air_humidity = []
      temperature = []
      data.forEach((item) => {
        if (item.name == 'data_anhsang') {
            light.push(item.last_value)
            light.push(item.last_value_at)
        }
        if (item.name == 'data_nhietdo') {
            temperature.push(item.last_value)
            temperature.push(item.last_value_at)
        }
        if (item.name == 'data_doamkk') {
            air_humidity.push(item.last_value)
            air_humidity.push(item.last_value_at)
        }
        if (item.name == 'data_doamdat') {
            soil_moisture.push(item.last_value)
            soil_moisture.push(item.last_value_at)
        }
      })
      /*temperature: Number,
  air_humidity: Number,
  soil_moisture: Number,
  light: Number, */
      Log.create({
        date: light[1],
        light: light[0],
        temperature: temperature[0],
        air_humidity: air_humidity[0],
        soil_moisture: soil_moisture[0]
      })
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

const home = async (req,res) => {
    try {
        const data = await Log.find()
        res.json(data)
    }
    catch (error) {
        res.json({
            error: error
        })
    }
}

setInterval(storeData, 25000)
module.exports = {
    home
}