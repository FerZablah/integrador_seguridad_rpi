//Importar librerias de npm
const gpio = require('rpi-gpio');
const SerialPort = require("serialport");
const SerialPortParser = require("@serialport/parser-readline");
const GPS = require("gps");
const p = require("phin");
const upload = require("./uploadAudio.js");
const record = require("./record.js");
const util = require('util');
const exec = util.promisify(require('child_process').exec);
exec(`cat /proc/cpuinfo | grep Serial | cut -d ' ' -f 2`).then(({stdout}) => {
    const serialNumber = stdout.replace('\n','');
    console.log(serialNumber);
    let pressCount = 0;
    let coordinates = {
        lat: "25.661863",
        lon: "-100.420751"
    }
    let idEvento = -1;
    const recordAudio = () => {
        //Grabar audio localmente
        record().then((filename) => {
            console.log('filename: ' + filename);
            //Volver a grabar audio
            setTimeout(() => {
                recordAudio();
            }, 2000);
            //Subir a google cloud
            upload('./' + filename).then((gCloudFileName) => {
                //Subir metadata del audio al servidor
                console.log(idEvento);
                p({
                    url: 'https://seguridad-integrador.herokuapp.com/audio',
                    method: 'POST',
                    data: {
                        liga: gCloudFileName,
                        idEvento
                    }
                }).then((res) => {
                    //Imprimir respuesta de servidor
                    console.log("Server response to post audio:", 'data: ' + res.body, 'code: ' + res.statusCode);
                }).catch((e) => {
                    //Imprimir error de llamada
                    console.log("Request error", e);
                });
            });
        }).catch((e) => {
            console.log(e);
        })
    }
    const callSOS = async () => {
        //Llamada post a servidor
        console.log("Dos toques detectados, Enviando coordenadas lat: " + coordinates.lat + " lon: " + coordinates.lon);
        const postObj = {
            lat: coordinates.lat,
            lon: coordinates.lon,
            idDispositivo: serialNumber
        };
        
        //Si tenemos llave del evento la mandamos
        if (idEvento !== -1)
            postObj.idEvento = idEvento;
        p({
            url: 'https://seguridad-integrador.herokuapp.com/sos',
            method: 'POST',
            data: postObj
        }).then((data) => {
            if(data.body.includes('{')){
                console.log('JSON:' + data.body);
                const res = JSON.parse(data.body);
                //Si el servidor devuelve una llave del evento, la guardamos en variable
                if (res.idEvento)
                    idEvento = res.idEvento;
                //Imprimir respuesta de servidor
            }
            console.log("Server response:", 'data: ' + data.body, 'code: ' + data.statusCode);
        }).catch((e) => {
            //Imprimir error de llamada
            console.log("Request error", e);
        });
    }
    //Escuchar cambios en el pin 7

    gpio.on('change', async (channel, value) => {
        //Si se presiona el pin 7
        if (channel === 7 && value) {
            console.log('Channel ' + channel + 'pressed, count:' + pressCount);
            //Sumar a contador de pulsos
            pressCount++;
            //Si son dos pulsos llamar a funcion del servidor
            if (pressCount == 2) {
                callSOS().then(() => {
                    recordAudio();
                });
            setInterval(() => {
                    callSOS();
                }, 10000);
            }
            //Reiniciar contador despues de dos segundos
            setTimeout(() => {
                pressCount = 0;
            }, 2000);
        }
    });
    gpio.setup(7, gpio.DIR_IN, gpio.EDGE_BOTH);

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
        if (data.type == "GGA") {
            if (data.quality != null) {
                coordinates.lat = data.lat;
                coordinates.lon = data.lon;
                console.log(" [" + data.lat + ", " + data.lon + "]");
            } else {
                console.log("no gps fix available");
            }
        }
    });
})