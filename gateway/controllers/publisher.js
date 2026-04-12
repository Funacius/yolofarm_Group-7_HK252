const MQTTService = require("../services/mqttService");


var mqttClient = new MQTTService();

mqttClient.connect();


exports.publishMQTTMessage = async function (req, res) {
  try {
    const topic = req.body.topic;
    const message = req.body.message;

    console.log(`Request topic ${topic}`);
    console.log(`Request message ${message}`);

    mqttClient.publish(topic, message)
    res.status(200).json({ message: "Published to topic" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to publish to topic" });
  }
};
