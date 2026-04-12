const express = require('express')
const router = express.Router()


var subcriberController = require('../controllers/subcriber')

router.get("/:type", subcriberController.subcriberTopic)

module.exports = router