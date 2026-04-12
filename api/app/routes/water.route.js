const express = require('express');
const { container, setup } = require("../loaders/di.js");

setup();
const router = express.Router();
const waterController = container.resolve("waterController");
const areaController = container.resolve("areaController")

router.get("/", areaController.getAll);
router.get("/pump/:id", waterController.getPumpById);
router.get("/pumps/:id", waterController.getPumpByAreaId);
router.put("/pumps", waterController.changeStatePump)
router.put("/pumps/setting", waterController.changeAuto)
router.get("/pumps/setting/:id", waterController.getTimer)
router.put("/pumps/setting/:id", waterController.updateTimer)
router.put("/pumps/auto", waterController.changePumpOn)


module.exports = router

// const express = require("express");
// const { container, setup } = require("../loaders/di.js");

// setup();
// const router = express.Router();
// const waterController = container.resolve("waterController");
// router.get('/all', waterController.getAll);


// module.exports = router;
