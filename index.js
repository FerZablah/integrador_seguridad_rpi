const gpio = require('rpi-gpio');

gpio.on('change', (channel, value) => {
	console.log('Channel ' + channel + ' value is now ' + value);
});
gpio.setup(7, gpio.DIR_IN, gpio.EDGE_BOTH);

const SerialPort = require("serialport");
const SerialPortParser = require("@serialport/parser-readline");
const GPS = require("gps");

const port = new SerialPort("/dev/ttyS0", { baudRate: 9600 });
const gps = new GPS();

const parser = port.pipe(new SerialPortParser());

parser.on("data", data => {
    try {
        gps.update(data);
    } catch (e) {
        throw e;
    }
});
gps.on("data", async data => {
    //console.log(data);
    if(data.type == "GGA") {
        if(data.quality != null) {
            console.log(" [" + data.lat + ", " + data.lon + "]");
        } else {
            console.log("no gps fix available");
        }
    }
});