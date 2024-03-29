var util = require('util');
var bleno = require('bleno');
var pizza = require('./seguridad');

function SeguridadCharacteristic(pizza) {
  bleno.Characteristic.call(this, {
    uuid: '13333333333333333333333333330003',
    properties: ['notify', 'write'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2901',
        value: 'Bakes the pizza and notifies when done baking.'
      })
    ]
  });

  this.seguridad = seguridad;
}

util.inherits(SeguridadCharacteristic, bleno.Characteristic);

SeguridadCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  if (offset) {
    callback(this.RESULT_ATTR_NOT_LONG);
  }
  else if (data.length !== 2) {
    callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
  }
  else {
    var temperature = data.readUInt16BE(0);
    var self = this;
    this.seguridad.once('ready', function(result) {
      if (self.updateValueCallback) {
        var data = new Buffer(1);
        data.writeUInt8(result, 0);
        self.updateValueCallback(data);
      }
    });
    this.seguridad.bake(temperature);
    callback(this.RESULT_SUCCESS);
  }
};

module.exports = SeguridadCharacteristic;