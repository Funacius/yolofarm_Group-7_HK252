// const express = require('express');
// const router = express.Router();

// const manageController = require('../controllers/manage.controller');


// router.post('/temp',manageController.createTempThreshold);
// router.get('/temp',manageController.readTempThreshold);


// router.post('/soil',manageController.createSoilThreshold);
// router.get('/soil',manageController.readSoilThreshold);


// router.post('/air',manageController.createAirThreshold);
// router.get('/air',manageController.readAirThreshold);

// router.post('/light',manageController.createLightThreshold);
// router.get('/light',manageController.readLightThreshold);


// module.exports = router;

const express = require("express");
const { container, setup } = require("../loaders/di.js");

setup();
const router = express.Router();
const manageController = container.resolve("manageController");
router.get("/temp", manageController.getTempThresh);
router.put("/temp/:id", manageController.updateTempThresh);

router.get("/light", manageController.getLightThresh);
router.put("/light/:id", manageController.updateLightThresh);

router.get("/air", manageController.getAirThresh);
router.put("/air/:id", manageController.updateAirThresh);

router.get("/soil", manageController.getSoilThresh);
router.put("/soil/:id", manageController.updateSoilThresh);


module.exports = router;
