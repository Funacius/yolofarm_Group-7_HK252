const mqtt = require("mqtt");

var options = {
  host: "",
  port: 8883,
  protocol: "mqtts",
  username: "",
  password: "",
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
  publish(topic, message, options) {
    this.mqttClient.publish(topic, message);
  }
  subscribe(topic, options) {
    this.mqttClient.subscribe(topic, options);
  }
}

module.exports = MQTTService;
