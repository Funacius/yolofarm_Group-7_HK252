const MQTTService = require("../services/mqttService");

var mqttClient = new MQTTService();

mqttClient.connect();

exports.subcriberTopic = (req, res) => {
  try {

    const topic = req.params.type;
    console.log(`Request topic ${topic}`);
    mqttClient.subscribe(topic);
    res.status(200).json({ message: "Subscribed to topic" });
   
  } catch (error) {
    console.log(error);
  }
};
