'use strict'

var jsdom = require('jsdom');
var {
    JSDOM
} = jsdom;
var d3 = require('d3');
var moment = require('moment');

function validateSettings(settings) {
    if (!settings) {
        throw "No settings"
    }
    prepareMargins(settings);
}

function prepareMargins(settings) {
    if (!settings.margin) {
        settings.margin = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };
    } else {
        var marginKeys = ['top', 'right', 'bottom', 'left'];
        marginKeys.forEach(function(key) {
            if (!(key in settings.margin)) {
                margin[key] = 0;
            }
        });
    }

    if (!('width' in settings)) {
        settings.width = 600;
    }
    settings.innerWidth = settings.width - settings.margin.left - settings.margin.right;

    if (!('height' in settings)) {
        settings.height = 400;
    }
    settings.innerHeight = settings.height - settings.margin.top - settings.margin.left;

}

function prepareScales(settings) {

}



function CFD(settings) {
    this.settings = settings;
}

CFD[Symbol.species] = CFD;

CFD.prototype.draw = function() {
    var self = this;
    validateSettings(self.settings);

    var dom = JSDOM.fragment('<svg></svg>');
    self.svg = d3.select(dom.firstChild);

    self.svg
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('width', self.settings.width)
        .attr('height', self.settings.height);

    self.g = self.svg.append("g");
    if (self.settings.margin.left || self.settings.margin.top) {
        g.attr("transform", "translate(" + self.settings.margin.left + "," + self.settings.margin.top + ")");
    }

    console.log(dom.firstChild.outerHTML);

    return dom.firstChild.outerHTML;
}

module.exports = CFD;