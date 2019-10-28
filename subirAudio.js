const upload = require("./uploadAudio.js");
upload('./tests/integracion/grabarAudio/1571601972801.wav').then((gCloudFileName) => {
    console.log(gCloudFileName);
});