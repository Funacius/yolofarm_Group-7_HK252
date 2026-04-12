var mqtt = require("mqtt");

var options = {
  host: "mqtt://io.adafruit.com",
  port: 8883,
  protocol: "mqtts",
  username: "viet_hcmut",
};

// initialize the MQTT client
var client = mqtt.connect(options.host, {
  username: options.username,
  password: options.password,
});

// setup the callbacks
client.on("connect", function () {
  console.log("Connected");
  client.subscribe("viet_hcmut/feeds/khuvuc1.data-anhsang", (err) => {
    console.log(err);
  });
});

client.on("error", function (error) {
  console.log(error);
});

client.on("message", function (topic, message) {
  // called each time a message is received
  console.log("Received message:", topic, message.toString());
});

// subscribe to topic 'my/test/topic'
// client.subscribe("viet_hcmut/feeds/khuvuc1.led1");

// publish message 'Hello' to topic 'my/test/topic'
// client.publish('my/test/topic', 'Hello');
// client.publish("viet_hcmut/feeds/khuvuc1.led1", "Hello 111");
