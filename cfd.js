'use strict'
var d3 = require('d3');
var moment = require('moment');

function CFD(settings, data) {    
    this.settings = settings;
}

CFD.prototype.validateSettings = function(settings) {
    if (!settings) {
        throw "Empty settings"
    }

    if (!settings.id) {
        throw "No id defined for the svg DOM element to use"
    }
}

CFD.prototype.draw = function() {
    this.validateSettings(settings);
    var cfd = d3.select(this.settings.id);



    
}

CFD[Symbol.species] = CFD;

module.exports = CFD;