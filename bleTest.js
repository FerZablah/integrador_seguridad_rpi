const bleno = require('bleno');


var Descriptor = bleno.Descriptor;
var descriptor = new Descriptor({
    uuid: '2901',
    value: 'value' // static value, must be of type Buffer or string if set
});

const handleWrite = (data, offset, withoutResponse, callback) => {
    
    console.log(data);
}

var Characteristic = bleno.Characteristic;
var characteristic = new Characteristic({
    uuid: 'fffffffffffffffffffffffffffffff1', // or 'fff1' for 16-bit
    properties: ['write', 'read', 'writeWithoutResponse'], // can be a combination of 'read', 'write', 'writeWithoutResponse', 'notify', 'indicate'
    secure: ['write', 'read', 'writeWithoutResponse'], // enable security for properties, can be a combination of 'read', 'write', 'writeWithoutResponse', 'notify', 'indicate'
    value: null, // optional static value, must be of type Buffer - for read only characteristics
    descriptors: [
        descriptor
    ],
    onReadRequest: null, // optional read request handler, function(offset, callback) { ... }
    onWriteRequest: handleWrite, // optional write request handler, function(data, offset, withoutResponse, callback) { ...}
    onSubscribe: null, // optional notify/indicate subscribe handler, function(maxValueSize, updateValueCallback) { ...}
    onUnsubscribe: null, // optional notify/indicate unsubscribe handler, function() { ...}
    onNotify: null, // optional notify sent handler, function() { ...}
    onIndicate: null // optional indicate confirmation received handler, function() { ...}
});

var PrimaryService = bleno.PrimaryService;
var servicioseguridad = new PrimaryService({
    uuid: 'fffffffffffffffffffffffffffffff0', // or 'fff0' for 16-bit
    characteristics: [
       characteristic
    ]
});

bleno.on('advertisingStart', function(state) {
    console.log('Advertising started');
    bleno.setServices([servicioseguridad]);
});

bleno.on('servicesSet', (err) => {
    if(err) console.log(err);
    else console.log('services set');
});

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('brazalete seguridad', [servicioseguridad.uuid]);
  } else {
    bleno.stopAdvertising();
  }
});