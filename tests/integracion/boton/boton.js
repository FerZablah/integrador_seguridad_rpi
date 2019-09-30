//Importar librerias de npm
const gpio = require('rpi-gpio');
let pressCount = 0;

gpio.on('change', async (channel, value) => {
    //Si se presiona el pin 7
    if(channel === 7 && value){
        //Sumar a contador de pulsos
        pressCount++;
        //Si son dos pulsos llamar a funcion del servidor
        if(pressCount == 2){
            console.log('Dos toques detectados...');
        }
        //Reiniciar contador despues de dos segundos
        setTimeout(() => {
            pressCount = 0;
        }, 2000);
    }
});
gpio.setup(7, gpio.DIR_IN, gpio.EDGE_BOTH);