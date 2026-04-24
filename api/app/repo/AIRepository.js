const { AiInference } = require("../models/models");
const { publishToOhStem } = require("../services/mqttPublish");
const channelMap = require("../config/channel-map");


class AIRepository {
  constructor({ db }) {
    this.db = db;
  }

  async all() {
    return AiInference.find({});
  }

  async FindByType(type) {
    try {
      return await AiInference.find({ fruit_type: type });
    } catch (error) {
      console.log(error);
    }
  }

  async FindByDisease(disease) {
    try {
      return await AiInference.find({ label: disease });
    } catch (error) {
      console.log(error);
    }
  }

  async FindByConfidence(confidence) {
    try {
      return await AiInference.find({ confidence: confidence });
    } catch (error) {
      console.log(error);
    }
  }


  async update(inference_id, disease, confidence) {
    const FruitRecord = await AiInference.findById(inference_id);
    if (!FruitRecord) {
      throw new Error("Fruit record not found");
    }
    FruitRecord.label = disease;
    FruitRecord.confidence = confidence;
    await FruitRecord.save();
  }

  async createRequest(ada_id, data) {
    const suf = String(ada_id || "").toUpperCase();
    await publishToOhStem(ada_id, data);

    const alias = suf === "V12";
    if (alias) {
      await publishToOhStem(alias, data);
    }
  }
}

module.exports = AIRepository;
