const express = require("express");
const router = express.Router();

var publisherController = require("../controllers/publisher.js");

router.post("/", publisherController.publishMQTTMessage);

module.exports = router;
