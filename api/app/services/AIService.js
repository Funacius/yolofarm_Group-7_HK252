// AiInferenceService.js
const { AiInference } = require("../models/models");

async function countDiseasedPlants(selectedFruit) {
  // Count records where fruit_type matches AND label is NOT "healthy"
  const errorCount = await AiInference.countDocuments({
    fruit_type: selectedFruit,
    label: { $ne: "healthy" } 
  });
  
  return errorCount;
}

async function countDiseasesByFruit(selectedFruit) {
  const diseaseCounts = await AiInference.aggregate([
    // Filter by fruit_type and exclude "healthy" plants
    { 
      $match: { 
        fruit_type: selectedFruit, 
        label: { $ne: "healthy" } 
      } 
    },
    // Group by the 'label' field and sum them up
    { 
      $group: { 
        _id: "$label", 
        count: { $sum: 1 } 
      } 
    },
    // Format the output nicely to rename '_id' to 'disease'
    { 
      $project: { 
        _id: 0, 
        disease: "$_id", 
        count: 1 
      } 
    }
  ]);
  
  return diseaseCounts;
}

module.exports = { countDiseasedPlants, countDiseasesByFruit };