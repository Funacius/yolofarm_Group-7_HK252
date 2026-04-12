const mongoose = require("mongoose");
const axios = require("axios");
const adafruit_url = require("../config/adafruit.config");
const models = require("../models/models");

dbname = "FarmDB";
url =
  "mongodb+srv://sangdanghs0812:3.14159@smart-tomato-db.pcuu6ow.mongodb.net/?retryWrites=true&w=majority&appName=Smart-tomato-DB";
connectDB = mongoose
  .connect(url, { dbname })
  .then(() => {
    console.log("Connect MongoDB successfully");
  })
  .catch((err) => {
    console.error("Connect fail, try again", err);
  });

module.exports = connectDB;

// const mongoose = require("mongoose");
// const axios = require("axios");
// const adafruit_url = require("../config/adafruit.config");
// const models = require("../models/models");

// dbname = "FarmDB";
// url =
//   "mongodb+srv://sangdanghs0812:3.14159@smart-tomato-db.pcuu6ow.mongodb.net/?retryWrites=true&w=majority&appName=Smart-tomato-DB";
// connectDB = mongoose
//   .connect(url, { dbname })
//   .then(() => {
//     console.log("Connect MongoDB successfully");
//     // axios.get(adafruit_url).then((response) => {
//     //   const newData = response.data;
//     //   const logs = models.Log;
//     //   for (var i = 0; i < newData.length; i++) {
//     //     if (newData[i].name == "cambien_doam") {
//     //       doam_kk = newData[i];
//     //     }
//     //     if (newData[i].name == "cambien_nhietdo") {
//     //       nhietdo = newData[i];
//     //     }
//     //     if (newData[i].name == "cambien_anhsang") {
//     //       anhsang = newData[i];
//     //     }
//     //     if (newData[i].name == "doam_dat") {
//     //       doam_dat = newData[i];
//     //     }
//     //   }

//     //   data = [
//     //     {
//     //       temperature: nhietdo.last_value,
//     //       air_humidity: doam_kk.last_value,
//     //       soil_moisture: doam_dat.last_value,
//     //       light: anhsang.last_value,
//     //       date: doam_kk.created_at,
//     //       area_id: "01",
//     //     },
//     //   ];

//     //   logs
//     //     .create(data)
//     //     .then(() => {
//     //       console.log("Data added from adafruit successfully");
//     //     })
//     //     .catch((err) => console.error("Error adding data:", err));
//     // });
//   })
//   .catch((err) => {
//     console.error("Connect fail, try again", err);
//   });

// module.exports = connectDB;