var util = require('util');
var bleno = require('bleno');

var SeguridadCharacteristic = require('./seguridad-characteristic');

function SeguridadService(seguridad) {
    bleno.PrimaryService.call(this, {
        uuid: '13333333333333333333333333333337',
        characteristics: [
            new SeguridadCharacteristic(seguridad),
        ]
    });
}

util.inherits(SeguridadService, bleno.PrimaryService);

module.exports = SeguridadService;