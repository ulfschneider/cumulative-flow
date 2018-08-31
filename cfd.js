'use strict'

var jsdom = require('jsdom');
var {
    JSDOM
} = jsdom;
var d3 = require('d3');
var moment = require('moment');

//Helper functions

function validateSettings(settings) {
    if (!settings) {
        throw "No settings";
    }
    //TODO check for data
    //TODO check for data is array with suitable size
    //TODO check for existence of columns, fromData, toData
    //TODO check for doneState, indeterminateState, newState

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

function prepareSVG(settings) {
    settings.dom = JSDOM.fragment('<svg></svg>');
    settings.svg = d3.select(settings.dom.firstChild);

    settings.svg
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('width', settings.width)
        .attr('height', settings.height);

    var g = settings.svg.append("g");
    if (settings.margin.left || settings.margin.top) {
        g.attr("transform", "translate(" + settings.margin.left + "," + settings.margin.top + ")");
    }
}

function prepareScales(settings) {
    settings.x = d3.scaleTime()
        .range([0, settings.width]);
    settings.y = d3.scaleLinear()
        .range([settings.height, 0]);
}

function prepareDataFunctions(settings) {

    settings.stack = d3.stack();
    settings.area = d3.area()
        .x(function(d, i) {
            return settings.x(d.data.date);
        })
        .y0(function(d) {
            return settings.y(d[0]);
        })
        .y1(function(d) {
            return settings.y(d[1]);
        });

    var xRange = d3.extent(settings.data, function(d) {
        return d.date;
    });
    if (settings.fromDate) {
        xRange[0] = settings.fromDate;
    }
    if (settings.toDate) {
        xRange[1] = settings.toDate;
    }
    settings.x.domain(xRange);
    settings.keys = settings.data.columns.slice(1);
    settings.stack.keys(settings.keys);
    settings.y.domain([0, d3.max(settings.data, function(d) {
        var sum = 0;
        for (var i = 1, n = settings.data.columns.length; i < n; i++) {
            sum += d[settings.data.columns[i]];
        }
        return sum;
    })]);
}



//Object with API

function CFD(settings) {
    this.settings = settings;
}

CFD[Symbol.species] = CFD;

CFD.prototype.draw = function(settings) {
    var self = this;
    if (settings) {
        self.settings = settings;
    }
    validateSettings(self.settings);
    prepareSVG(self.settings);
    prepareScales(self.settings);
    //TODO after checks for data, call prepareDataFunctions(self.settings);

    console.log(self.settings.dom.firstChild.outerHTML);

    return self.settings.dom.firstChild.outerHTML;
}

module.exports = CFD;