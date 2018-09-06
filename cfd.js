'use strict'

var jsdom = require('jsdom');
var {
    JSDOM
} = jsdom;
var d3 = require('d3');
var moment = require('moment');


const FONT_SIZE = '16';
const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 400;

//Helper functions

function validateSettings(settings) {
    if (!settings) {
        throw "No settings";
    }

    validateData(settings);
    validateMargins(settings);
}

function validateData(settings) {
    if (!settings.data) {
        throw "No data";
    }

    if (!Array.isArray(settings.data)) {
        throw "Data is not an array";
    }

    if (!settings.data.length) {
        throw "Empty data";
    }

}

function validateMargins(settings) {
    if (!settings.margin) {
        settings.margin = {
            top: 75,
            right: 210,
            bottom: 30,
            left: 80
        };
    } else {
        var marginKeys = ['top', 'right', 'bottom', 'left'];
        marginKeys.forEach(function (key) {
            if (!(key in settings.margin)) {
                margin[key] = 0;
            }
        });
    }

    if (!('width' in settings)) {
        settings.width = DEFAULT_WIDTH;
    }
    settings.innerWidth = settings.width - settings.margin.left - settings.margin.right;

    if (!('height' in settings)) {
        settings.height = DEFAULT_HEIGHT;
    }
    settings.innerHeight = settings.height - settings.margin.top - settings.margin.bottom;

}

function prepareSVG(settings) {
    settings.dom = JSDOM.fragment('<svg></svg>');
    settings.svg = d3.select(settings.dom.firstChild);

    settings.svg
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('width', settings.width)
        .attr('height', settings.height);

    settings.g = settings.svg.append("g");
    if (settings.margin.left || settings.margin.top) {
        settings.g.attr("transform", "translate(" + settings.margin.left + "," + settings.margin.top + ")");
    }
}

function prepareScales(settings) {
    settings.x = d3.scaleTime()
        .range([0, settings.innerWidth]);
    settings.y = d3.scaleLinear()
        .range([settings.innerHeight, 0]);
}

function prepareDataFunctions(settings) {

    settings.stack = d3.stack();
    settings.area = d3.area()
        //.curve(d3.curveStepAfter) - this kind of interpolation is more correct, but not very readable
        .x(function (d, i) {
            return settings.x(d.data.date);
        })
        .y0(function (d) {
            return settings.y(d[0]);
        })
        .y1(function (d) {
            return settings.y(d[1]);
        });

    var xRange = d3.extent(settings.data, function (d) {
        return d.date;
    });
    if (settings.fromDate) {
        xRange[0] = settings.fromDate;
    }
    if (settings.toDate) {
        xRange[1] = settings.toDate;
    }
    settings.x.domain(xRange);
    //settings.keys = settings.data.columns.slice(1);
    settings.keys = settings.data.done;
    settings.keys = settings.keys.concat(settings.data.progress);
    settings.keys = settings.keys.concat(settings.data.toDo);
    settings.stack.keys(settings.keys);
    settings.y.domain([0, d3.max(settings.data, function (d) {
        var sum = 0;
        for (var i = 0, n = settings.keys.length; i < n; i++) {
            sum += d[settings.keys[i]];
        }
        return sum;
    })]);
}


function isProgressStatus(status, settings) {
    return settings.data.progress.indexOf(status) >= 0;
}

function isDoneStatus(status, settings) {
    return settings.data.done.indexOf(status) >= 0;
}


function drawAxis(settings) {
    settings.axisStyle = {
        color: '#000'
    }
    var xAxis = settings.g.append('g')
        .attr('transform', 'translate(0,' + settings.innerHeight + ')')
        .call(d3.axisBottom(settings.x));
    xAxis
        .selectAll('path')
        .style('stroke', settings.axisStyle.color);
    xAxis
        .selectAll('line')
        .style('stroke', settings.axisStyle.color);
    xAxis
        .selectAll('text')
        .style('fill', settings.axisStyle.color)
        .style('font', FONT_SIZE + 'px sans-serif');

    var yAxis = settings.g.append('g')
        .attr('transform', 'translate(' + settings.innerWidth + ' ,0)')
        .call(d3.axisRight(settings.y));
    yAxis
        .selectAll('path')
        .style('stroke', settings.axisStyle.color);
    yAxis
        .selectAll('line')
        .style('stroke', settings.axisStyle.color);
    yAxis
        .selectAll('text')
        .style('fill', settings.axisStyle.color)
        .style('font', FONT_SIZE + 'px sans-serif');
}

function drawLayers(settings) {
    settings.toDoStyle = {
        fill: '#bec0c2',
        stroke: '#fff',
        color: '#bec0c2'
    };
    settings.progressStyle = {
        fill: '#808285',
        stroke: '#fff',
        color: '#808285'
    };
    settings.doneStyle = {
        fill: '#000',
        stroke: '#fff',
        color: '#000'
    };

    let layer = settings.g.selectAll('.layer')
        .data(settings.stack(settings.data))
        .enter()
        .append('g')
        .attr('class', 'layer');

    layer.append('path')
        .attr('class', 'area')
        .style('fill', function (d) {
            if (isProgressStatus(d.key, settings)) {
                return settings.progressStyle.fill;
            } else if (isDoneStatus(d.key, settings)) {
                return settings.doneStyle.fill;
            }
            return settings.toDoStyle.fill;
        })
        .style('stroke', function (d) {
            if (isProgressStatus(d.key, settings)) {
                return settings.progressStyle.stroke;
            } else if (isDoneStatus(d.key, settings)) {
                return settings.doneStyle.stroke;
            }
            return settings.toDoStyle.stroke;
        })
        .style('stroke-width', '.5')
        .attr('d', settings.area);

    layer.filter(function (d) {
            return settings.data.length && settings.y(d[d.length - 1][0]) - settings.y(d[d.length - 1][1]) >= FONT_SIZE;
        })
        .append('text')
        .attr('x', settings.width + 50)
        .attr('y', function (d) {
            return settings.y(d[d.length - 1][1]);
        })
        .attr('dy', '.35em')
        .style('font', FONT_SIZE + 'px sans-serif')
        .style('text-anchor', 'start')
        .style('fill', function (d) {
            if (isProgressStatus(d.key, settings)) {
                return settings.progressStyle.color;
            } else if (isDoneStatus(d.key, settings)) {
                return settings.doneStyle.color;
            }
            return settings.toDoStyle.color;
        })
        .text(function (d) {
            return (d[d.length - 1][1] - d[d.length - 1][0]) + ' ' + d.key;
        });
}


//Object with API

function CFD(settings) {
    this.settings = settings;
    this.defaultWidth = DEFAULT_WIDTH;
    this.defaultHeight = DEFAULT_HEIGHT;
}

CFD[Symbol.species] = CFD;

CFD.prototype.draw = function (settings) {
    var self = this;
    if (settings) {
        self.settings = settings;
    }
    validateSettings(self.settings);
    prepareSVG(self.settings);
    prepareScales(self.settings);
    prepareDataFunctions(self.settings);

    drawLayers(self.settings);
    drawAxis(self.settings);

    return self.settings.dom.firstChild;
}

module.exports = CFD;