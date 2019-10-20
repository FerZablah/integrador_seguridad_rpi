const upload = require("../../../uploadAudio.js");
upload('../grabarAudio/1571601972801.wav').then((gCloudFileName) => {
    console.log(gCloudFileName);
});