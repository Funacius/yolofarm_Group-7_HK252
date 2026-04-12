const MQTTService = require("../services/mqttService");


var mqttClient = new MQTTService();

mqttClient.connect();


exports.publishMQTTMessage = async function (req, res) {
  try {
    const topic = "Humid";
    const message = "111111111";

    console.log(`Request topic ${topic}`);
    console.log(`Request message ${message}`);

    mqttClient.public(topic, message)
  } catch (error) {
    console.log(error);
  }
};
