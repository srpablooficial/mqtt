const mq = require("mqemitter");
const http = require("http");
const server = http.createServer();
const ws = require("ws");

const aedes = require("aedes")({
  id: "BROKER_" + 1,
  mq: mq({ concurrency: 2 })
});
const port = 1883;

new ws.Server(
  {
    server: server
  },
  aedes.handle
);

server.listen(port, function () {
  console.log("Aedes listening on port N:", port);
  aedes.mq.emit({
    topic: "aedes/hello",
    payload: "I'm broker " + aedes.id,
    qos: 0
  });

});

aedes.mq.on("aedes/hello", (d, cb) => {
  console.log(d);
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
