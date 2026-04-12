const express = require('express')
const router = express.Router()

const analysisController = require('../controllers/AnalysisController');

router.get("/home", analysisController.home);
router.get("/export/csv", analysisController.exportCsv);

module.exports = router;

