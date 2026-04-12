const express = require("express");
const logger = require("morgan");
const bodyPraser = require("body-parser");
const cors = require("cors");
const lightRouter = require("../routes/light.route.js");
const waterRouter = require("../routes/water.route.js");
const manageRouter = require("../routes/manage.route.js");
const analysisRouter = require("../routes/analysis.route.js");
const iotRouter = require("../routes/iot.route.js");
const deviceRouter = require("../routes/device.route.js");
const aiRouter = require("../routes/ai.route.js");
const waterScheduleRouter = require("../routes/water-schedule.route.js");

async function expressLoader({ app }) {
  app.use(logger("dev"));
  app.use(bodyPraser.json());
  app.use(cors());


  app.use("/api/manage", manageRouter);
  app.use("/api/water", waterRouter);
  app.use("/api/water/schedule", waterScheduleRouter);
  app.use("/api/light", lightRouter);
  app.use("/api/analysis", analysisRouter);
  app.use("/api/iot", iotRouter);
  app.use("/api/device", deviceRouter);
  app.use("/api/ai", aiRouter);
  //catch 404 error
  app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  });

  // error handler (must be 4-arg so Express treats it as error middleware)
  app.use((err, req, res, next) => {
    const status = err.status || 500;
    const payload =
      app.get("env") === "development"
        ? { message: err.message, stack: err.stack }
        : { message: err.message };

    return res.status(status).json({
      error: payload,
    });
  });

  return app;
}

module.exports = {
  expressLoader,
};
