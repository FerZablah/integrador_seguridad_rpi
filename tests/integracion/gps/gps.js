//Importar librerias de npm
const SerialPort = require("serialport");
const SerialPortParser = require("@serialport/parser-readline");
const GPS = require("gps");
//Escuchar puerto serial con 9600 baudios
const port = new SerialPort("/dev/ttyS0", { baudRate: 9600 });
//Crear instancia de libreria GPS
const gps = new GPS();
//Crear parseador de puerto serial
const parser = port.pipe(new SerialPortParser());

//Escuchar puerto
parser.on("data", data => {
    try {
        gps.update(data);
    } catch (e) {
        throw e;
    }
});
//Escuchar nueva informacion recibida al objeto de gps
gps.on("data", async data => {
    if(data.type == "GGA") {
        if(data.quality != null) {
            console.log(" [" + data.lat + ", " + data.lon + "]");
        } else {
            console.log("no gps fix available");
        }
    }
});