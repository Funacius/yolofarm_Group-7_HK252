const AiService = require("../services/AiInferenceService");

const getDiseaseCount = async (req, res) => {
  try {
    const fruitType = req.query.fruit_type;
    
    if (!fruitType) {
      return res.status(400).json({ error: "Missing fruit_type parameter" });
    }

    const count = await AiService.countDiseasedPlants(fruitType);

    res.json({
      fruit_type: fruitType,
      errored_plants: count
    });
  } catch (error) {
    res.status(500).json({ error: String(error.message) });
  }
};

const getDetailedDiseaseCount = async (req, res) => {
  try {
    const fruitType = req.query.fruit_type;
    
    if (!fruitType) {
      return res.status(400).json({ error: "Missing fruit_type parameter" });
    }

    // Call the aggregation function to get detailed disease counts
    const detailedCounts = await AiService.countDiseasesByFruit(fruitType);

    res.json({
      fruit_type: fruitType,
      details: detailedCounts
    });
  } catch (error) {
    res.status(500).json({ error: String(error.message) });
  }
};

module.exports = { getDiseaseCount, getDetailedDiseaseCount };