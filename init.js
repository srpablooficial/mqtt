
const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);

const ports = {
    mqtt : 1883
}


server.listen(ports.mqtt, function () {
    console.log(`MQTT Broker running on port: ${ports.mqtt}`);
});


