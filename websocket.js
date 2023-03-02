const express = require('express');
const aedes = require('aedes')();
const ws = require('websocket-stream');
const fs = require("fs");
const server = require('net').createServer(aedes.handle);
const app = express();


const ports = {
    mqtt : 1883,
    ws : 8080,
    wss : 8081,
}


const host = '0.0.0.0' // localhost


server.listen(ports.mqtt, function () {
    console.log(`MQTT Broker running on port: ${ports.mqtt}`);
});


// -------- non-SSL websocket port -------------
var wsServer = require('http').createServer(app)
ws.createServer({ server: wsServer}, aedes.handle)
wsServer.listen(ports.ws, host, function () {
    console.log('WS server listening on port', ports.ws)
})




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
  