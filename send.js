
const mq = require("mqemitter");

const aedes = require("aedes")({
  id: "BROKER_" + 1,
  mq: mq({ concurrency: 2 })
});

const server = require('net').createServer(aedes.handle);



const ports = {
    mqtt : 1883
}


server.listen(ports.mqtt, function () {
    console.log(`MQTT Broker running on port: ${ports.mqtt}`);


    aedes.mq.emit({
      topic: "hello",
      payload: "I'm broker " + aedes.id,
      qos: 0
    });

});



aedes.mq.on("hello", (d, cb) => {
  console.log(d);
  console.log(d.payload.toString());
  cb();
});





aedes.on("subscribe", function (subscriptions, client) {
  console.log(
    "MQTT client \x1b[32m" +
      (client ? client.id : client) +
      "\x1b[0m subscribed to topics: " +
      subscriptions.map((s) => s.topic).join("\n"),
    "from broker",
    aedes.id
  );
});

aedes.on("unsubscribe", function (subscriptions, client) {
  console.log(
    "MQTT client \x1b[32m" +
      (client ? client.id : client) +
      "\x1b[0m unsubscribed to topics: " +
      subscriptions.join("\n"),
    "from broker",
    aedes.id
  );
});

// fired when a client connects
aedes.on("client", function (client) {
  console.log(
    "Client Connected: \x1b[33m" + (client ? client.id : client) + "\x1b[0m",
    "to broker",
    aedes.id
  );
});

// fired when a client disconnects
aedes.on("clientDisconnect", function (client) {
  console.log(
    "Client Disconnected: \x1b[31m" + (client ? client.id : client) + "\x1b[0m",
    "to broker",
    aedes.id
  );
});
