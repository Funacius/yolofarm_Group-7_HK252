const express = require('express')
const router = express.Router()


var subcriberController = require('../controllers/subcriber')

router.get("/", subcriberController.subcriberTopic)

module.exports = router