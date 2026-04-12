const mqtt = require("mqtt");

var options = {
  host: "c73bd1c56f45418d8508c933ca205712.s1.eu.hivemq.cloud",
  port: 8883,
  protocol: "mqtts",
  username: "ptho1504",
  password: "Ptho1504",
};
class MQTTService {
  constructor(messageCallBack) {
    this.mqttClient = null;
    this.options = options;
    this.messageCallBack = messageCallBack;
  }

  connect() {
    this.mqttClient = mqtt.connect(this.options);

    this.mqttClient.on("error", (err) => {
      console.log(err);
    });
    this.mqttClient.on("connect", () => {
      console.log(`Mqtt client connect`);
    });
  }
  public(topic, message, options) {
    this.mqttClient.publish(topic, message);
  }
  subscribe(topic, options) {
    this.mqttClient.subscribe(topic, options);
  }
}

module.exports = MQTTService;
