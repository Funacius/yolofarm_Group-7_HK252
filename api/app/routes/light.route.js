const express = require("express");
const { container, setup } = require("../loaders/di.js");

setup();
const router = express.Router();
const lightController = container.resolve("lightController");
const areaController = container.resolve("areaController")

router.get("/", areaController.getAll);
router.get("/bulb/:id", lightController.getLightById);
router.get("/bulbs/:id", lightController.getLightByAreaId);
router.put("/bulbs", lightController.changeStateLight)
router.put("/bulbs/setting", lightController.changeAuto)
router.get("/bulbs/setting/:id", lightController.getTimer)
router.put("/bulbs/setting/:id", lightController.updateTimer)
router.put("/bulbs/auto", lightController.changeLightOn)


module.exports = router;
