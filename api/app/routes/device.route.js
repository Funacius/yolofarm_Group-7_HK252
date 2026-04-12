const express = require("express");
const router = express.Router();
const { publish } = require("../controllers/DeviceCommandController");

router.post("/publish", publish);

module.exports = router;
