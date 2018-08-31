'use strict'

var jsdom = require('jsdom');
var {
    JSDOM
} = jsdom;
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
        self.settings.margin = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };
    } else {
        var marginKeys = ['top', 'right', 'bottom', 'left'];
        marginKeys.forEach(function(key) {
            if (!(key in self.settings.margin)) {
                margin[key] = 0;
            }
        });
    }

    if (!('width' in self.settings)) {
        self.settings.width = 600;
    }
    self.settings.innerWidth = self.settings.width - self.settings.margin.left - self.settings.margin.right;

    if (!('height' in self.settings)) {
        self.settings.height = 400;
    }
    self.settings.innerHeight = self.settings.height - self.settings.margin.top - self.settings.margin.left;
}

CFD.prototype.draw = function() {
    var self = this;
    self.validateSettings();




    var dom = new JSDOM();
    var d3Element = d3.select(dom.window.document.body);

    self.svg = d3Element.append('svg')
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('width', self.settings.width)
        .attr('height', self.settings.height);

    self.g = self.svg.append("g");
    if (self.settings.margin.left || self.settings.margin.top) {
        g.attr("transform", "translate(" + self.settings.margin.left + "," + self.settings.margin.top + ")");
    }

    console.log(dom.serialize());
    console.log(dom.window.document.documentElement.outerHTML);

    return self.svg;
}

module.exports = CFD;