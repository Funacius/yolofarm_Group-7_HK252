const MQTTService = require("../services/mqttService");

var mqttClient = new MQTTService();

mqttClient.connect();

exports.subcriberTopic = (req, res) => {
  try {
    const topic = "Humid";
    console.log(topic);
    mqttClient.subscribe(topic);
  } catch (error) {
    console.log(error);
  }
};
