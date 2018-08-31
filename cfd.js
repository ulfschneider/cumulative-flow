'use strict'

var jsdom = require('jsdom');
var {JSDOM} = jsdom;
var d3 = require('d3');
var moment = require('moment');

function CFD(settings) {    
    this.settings = settings;
}

CFD[Symbol.species] = CFD;

CFD.prototype.validateSettings = function() {
    var self = this;

    if (!self.settings) {
       throw "No settings"
    }

    if (!self.settings.margin) {
        self.settings.margin = {top:0, right:0, bottom:0, left:0};
    } else {
        var marginKeys = ['top', 'right', 'bottom', 'left'];
        marginKeys.forEach(function(key) {
            if (! (key in self.settings.margin)) {
                margin[key] = 0;
            }
        });
    }

    if (! ('width' in self.settings)) {
        self.settings.width = 600;
    }
    self.settings.innerWidth = self.settings.width - self.settings.margin.left - self.settings.margin.right;
    
    if (! ('height' in self.settings)) {
        self.settings.height = 400;        
    }        
    self.settings.innerHeight = self.settings.height - self.settings.margin.top - self.settings.margin.left;
}

CFD.prototype.draw = function()  {
    var self = this;
    self.validateSettings();

    var dom = new JSDOM('svg');
    var domElement = d3.select(dom.body);
    self.svg = domElement.append('svg');
    self.g = self.svg.append("g")
                .attr("transform", "translate(" + self.settings.margin.left + "," + self.settings.margin.top + ")");

    return self.svg;
}
 
module.exports = CFD;