var fs = require('fs');
var portAudio = require('naudiodon');
 
// Create an instance of AudioIO with inOptions, which will return a ReadableStream
var ai = new portAudio.AudioIO({
  inOptions: {
    channelCount: 2,
    sampleFormat: portAudio.SampleFormat16Bit,
    sampleRate: 44100
  }
});
 
// Create a write stream to write out to a raw audio file
var ws = fs.createWriteStream('rawAudio.raw');
 
//Start streaming
ai.pipe(ws);
ai.start();
 