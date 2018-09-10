'use strict'

var jsdom = require('jsdom');
var {
    JSDOM
} = jsdom;
var d3 = require('d3');
var moment = require('moment');


const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 400;
const DAY_FORMAT = 'dddd D-MMM YYYY HH:mm[, GMT]Z';
const DATE_FORMAT = 'YYYY-MM-DD';

//Helper functions

function validateSettings(settings) {
    if (!settings) {
        throw "No settings";
    }

    validateData(settings);
    validateMargins(settings);
    validateStyles(settings);
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
        }
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

function validateStyles(settings) {
    if (!settings.style) {
        settings.style = {
            fontSize: 12,
            fontFamily: 'sans-serif',
            color: '#000',
            axis: {
                color: '#000'
            },
            toDo: {
                fill: '#bec0c2',
                stroke: '#fff',
                color: '#bec0c2'
            },
            progress: {
                fill: '#808285',
                stroke: '#fff',
                color: '#808285'
            },
            done: {
                fill: '#000',
                stroke: '#fff',
                color: '#000'
            },
            legend: {
                color: '#000'
            },
            predict: {
                backgroundColor: '#fff',
                color: '#000'
            },            
            marker: {
                backgroundColor: '#fff',
                color: '#000'
            }
        }
    } else {
        if (!settings.style.fontSize) {
            settings.style.fontSize = 12;
        }
        if (!settings.style.fontFamily) {
            settings.style.fontFamily = 'sans-serif';
        }
        if (!settings.style.color) {
            settings.style.color = '#000';
        }
        if (!settings.style.axis) {
            settings.style.axis = {
                color: settings.style.color
            }
        } else {
            if (!settings.style.axis.color) {
                settings.style.axis.color = settings.style.color
            }
        }
        if (!settings.style.toDo) {
            settings.style.toDo = {
                fill: '#bec0c2',
                stroke: '#fff',
                color: '#bec0c2'
            }
        } else {
            if (!settings.style.toDo.fill) {
                settings.style.toDo.fill = '#bec0c2'
            }
            if (!settings.style.toDo.stroke) {
                settings.style.toDo.stroke = '#fff'
            }
            if (!settings.style.toDo.color) {
                settings.style.toDo.color = '#bec0c2'
            }
        }
        if (!settings.style.progress) {
            settings.style.progress = {
                fill: '#808285',
                stroke: '#fff',
                color: '#808285',
            }
        } else {
            if (!settings.style.progress.fill) {
                settings.style.progress.fill = '#808285'
            }
            if (!settings.style.progress.stroke) {
                settings.style.progress.stroke = '#fff'
            }
            if (!settings.style.progress.color) {
                settings.style.progress.color = '#808285'
            }
        }
        if (!settings.style.done) {
            settings.style.done = {
                fill: '#000',
                stroke: '#fff',
                color: '#000',
            }
        } else {
            if (!settings.style.done.fill) {
                settings.style.done.fill = '#000'
            }
            if (!settings.style.done.stroke) {
                settings.style.done.stroke = '#fff'
            }
            if (!settings.style.done.color) {
                settings.style.done.color = '#000'
            }
        }
        if (!settings.style.predict) {
            settings.style.predict = {
                backgroundColor: '#000',
                color: '#fff'
            }
        } else {
            if (!settings.style.predict.backgroundColor) {
                settings.style.predict.backgroundColor = '#000'
            }
            if (!settings.style.predict.color) {
                settings.style.predict.color = '#fff'
            }
        }        
        if (!settings.style.marker) {
            settings.style.marker = {
                backgroundColor: '#000',
                color: '#fff'
            }
        } else {
            if (!settings.style.marker.backgroundColor) {
                settings.style.marker.backgroundColor = '#000'
            }
            if (!settings.style.marker.color) {
                settings.style.marker.color = '#fff'
            }
        }
    }
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
        .x(function (d) {
            return settings.x(d.data.date);
        })
        .y0(function (d) {
            return settings.y(d[0]);
        })
        .y1(function (d) {
            return settings.y(d[1]);
        });

    settings.fromDate = settings.fromDate ? moment(settings.fromDate)
        .startOf('day') : settings.fromDate;
    settings.toDate = settings.toDate ? moment(settings.toDate)
        .startOf('day') : settings.toDate;


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

    var xAxis = settings.g.append('g')
        .attr('transform', 'translate(0,' + settings.innerHeight + ')')
        .call(d3.axisBottom(settings.x));
    xAxis
        .selectAll('path')
        .style('stroke', settings.style.axis.color);
    xAxis
        .selectAll('line')
        .style('stroke', settings.style.axis.color);
    xAxis
        .selectAll('text')
        .style('fill', settings.style.axis.color)
        .attr('font-size', settings.style.fontSize + 'px')
        .attr('font-family', settings.style.fontFamily);



    var yAxis = settings.g.append('g')
        .attr('transform', 'translate(' + settings.innerWidth + ' ,0)')
        .call(d3.axisRight(settings.y));
    yAxis
        .selectAll('path')
        .style('stroke', settings.style.axis.color);
    yAxis
        .selectAll('line')
        .style('stroke', settings.style.axis.color);
    yAxis
        .selectAll('text')
        .style('fill', settings.style.axis.color)
        .attr('font-size', settings.style.fontSize + 'px')
        .attr('font-family', settings.style.fontFamily);
}

function drawLayers(settings) {
    let layer = settings.g.selectAll('.layer')
        .data(settings.stack(settings.data.filter(function (d) {
            return isDateInRange(d.date, settings);
        })))
        .enter()
        .append('g')
        .attr('class', 'layer');

    layer
        .append('path')
        .attr('class', 'area')
        .style('fill', function (d) {
            if (isProgressStatus(d.key, settings)) {
                return settings.style.progress.fill;
            } else if (isDoneStatus(d.key, settings)) {
                return settings.style.done.fill;
            }
            return settings.style.toDo.fill;
        })
        .style('stroke', function (d) {
            if (isProgressStatus(d.key, settings)) {
                return settings.style.progress.stroke;
            } else if (isDoneStatus(d.key, settings)) {
                return settings.style.done.stroke;
            }
            return settings.style.toDo.stroke;
        })
        .style('stroke-width', '.5')
        .attr('d', settings.area)

    layer.filter(function (d) {
            return settings.y(d[d.length - 1][0]) - settings.y(d[d.length - 1][1]) >= settings.style.fontSize;
        })
        .append('text')
        .attr('x', settings.innerWidth + 50)
        .attr('y', function (d) {
            return settings.y(d[d.length - 1][1]);
        })
        .attr('dy', '.35em')
        .attr('font-size', settings.style.fontSize + 'px')
        .attr('font-family', settings.style.fontFamily)
        .style('text-anchor', 'start')
        .style('fill', function (d) {
            if (isProgressStatus(d.key, settings)) {
                return settings.style.progress.color;
            } else if (isDoneStatus(d.key, settings)) {
                return settings.style.done.color;
            }
            return settings.style.toDo.color;
        })
        .text(function (d) {
            return (d[d.length - 1][1] - d[d.length - 1][0]) + ' ' + d.key;
        });
}

function drawPrediction(settings) {
    let summarizeDone = function (date) {
        for (var entry of settings.data) {
            if (moment(entry.date).isSame(date, 'day')) {
                var sum = 0;
                for (var key of settings.keys) {
                    if (isDoneStatus(key, settings)) {
                        sum += entry[key];
                    }
                }
                return sum;
            }
        }
        return 0;
    }

    if (settings.predict) {
        
        var startDate = moment(settings.predict);
        var currentDate = moment(settings.data[settings.data.length - 1].date);
        if (startDate && startDate.isBefore(currentDate) && isDateInRange(startDate, settings)) {
            var x1 = settings.x(startDate);
            var x2 = settings.x(currentDate);
            var y1 = settings.y(summarizeDone(startDate));
            var y2 = settings.y(summarizeDone(currentDate));
            var m = (y2 - y1) / (x2 - x1);

            var predictX = function () {
                return -y1 / m + x1;
            }

            var dateFromX = function (x) {
                let m = (x2 - x1) / (currentDate - startDate);
                let c = x1 - m * startDate;
                return moment((x - c) / m);
            }

            var x3 = settings.x(settings.toDate ? settings.toDate : currentDate);
            var y3 = y1 + m * (x3 - x1);
            if (y3 < 0) {
                x3 = -y1 / m + x1;
                y3 = y1 + m * (x3 - x1);
            }

            
            settings.g.append('line')
                .attr('x1', x1)
                .attr('y1', y1)
                .attr('x2', x3)
                .attr('y2', y3)
                .style('stroke-width', '3')
                .style('stroke', settings.style.predict.backgroundColor);
            settings.g.append('line')
                .attr('x1', x1)
                .attr('y1', y1)
                .attr('x2', x3)
                .attr('y2', y3)
                .style('stroke-width', '1')
                .style('stroke', settings.style.predict.color);

            settings.g.append('text')
                .attr('x', x3)
                .attr('y', -35)
                .attr('dy', '.35em')
                .attr('font-size', settings.style.fontSize)
                .attr('font-family', settings.style.fontFamily)    
                .style('text-anchor', 'middle')
                .style('fill', settings.style.predict.color)
                .text(dateFromX(predictX()).format(DATE_FORMAT));
        }
    }
}

function isDateInRange(date, settings) {
    var dataFromDate, dataToDate;
    var momentDate = moment(date);

    if (settings.data.length) {
        dataFromDate = settings.data[0].date;
        dataToDate = settings.data[settings.data.length - 1].date;
    }

    if (settings.fromDate && momentDate.isBefore(settings.fromDate)) {
        return false;
    } else if (!settings.fromDate && dataFromDate && momentDate.isBefore(dataFromDate)) {
        return false;
    }

    if (settings.toDate && momentDate.isAfter(settings.toDate)) {
        return false;
    } else if (!settings.toDate && dataToDate && momentDate.isAfter(dataToDate)) {
        return false;
    }
    return true;
}


function drawMarkers(settings) {

    var mark = function (date, label) {
        var x1 = settings.x(date);
        var y1 = settings.innerHeight;
        var y2 = 0;
        settings.g.append('line')
            .attr('x1', x1)
            .attr('y1', y1)
            .attr('x2', x1)
            .attr('y2', y2)
            .style('stroke-width', '3')
            .style('stroke', settings.style.marker.backgroundColor);
        settings.g.append('line')
            .attr('x1', x1)
            .attr('y1', y1)
            .attr('x2', x1)
            .attr('y2', y2)
            .style('stroke-width', '1')
            .style('stroke', settings.style.marker.color);

        settings.g.append('text')
            .attr('x', x1)
            .attr('y', -15)
            .attr('dy', '.35em')
            .attr('font-size', settings.style.fontSize)
            .attr('font-family', settings.style.fontFamily)
            .style('text-anchor', 'middle')
            .style('fill', settings.style.marker.color)
            .text(label ? label : moment(date).format(DATE_FORMAT));
    }

    if (settings.markers) {
        settings.markers.forEach(m => {
            if (isDateInRange(m.date, settings)) {
                mark(m.date, m.label);
            }
        });
    }
}

function drawLegend(settings) {

    //title 
    settings.g.append('text')
        .attr('x', 5)
        .attr('y', -55)
        .attr('dy', '.35em')
        .attr('font-size', settings.style.fontSize + 'px')
        .attr('font-family', settings.style.fontFamily)
        .style('text-anchor', 'start')
        .style('fill', settings.style.legend.color)
        .text(settings.title +
            ' at ' +
            moment().format(DAY_FORMAT));

    //toDo legend
    settings.g.append('text')
        .attr('x', 5)
        .attr('y', 0)
        .attr('dy', settings.style.fontSize + 'px')
        .attr('font-size', settings.style.fontSize + 'px')
        .attr('font-family', settings.style.fontFamily)
        .style('text-anchor', 'start')
        .style('fill', settings.style.toDo.color)
        .text('To Do');

    //progress legend
    settings.g.append('text')
        .attr('x', 5)
        .attr('y', 15)
        .attr('dy', settings.style.fontSize + 'px')
        .attr('font-size', settings.style.fontSize + 'px')
        .attr('font-family', settings.style.fontFamily)
        .style('text-anchor', 'start')
        .style('fill', settings.style.progress.color)
        .text('In Progress');

    //done legend
    settings.g.append('text')
        .attr('x', 5)
        .attr('y', 30)
        .attr('dy', settings.style.fontSize + 'px')
        .attr('font-size', settings.style.fontSize + 'px')
        .attr('font-family', settings.style.fontFamily)
        .style('text-anchor', 'start')
        .style('fill', settings.style.done.color)
        .text('Done');

    //unit
    let counting = settings.g.append('text')
        .attr('x', settings.innerWidth + 50)
        .attr('y', -35)
        .attr('dy', '.35em')
        .attr('font-size', settings.style.fontSize + 'px')
        .attr('font-family', settings.style.fontFamily)
        .style('text-anchor', 'start')
        .style('fill', settings.style.legend.color)
        .text(settings.data.unit == 'points' ? 'Story Points' : 'Issues');        
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
    drawPrediction(self.settings);
    drawMarkers(self.settings);    
    drawAxis(self.settings);
    drawLegend(self.settings);

    return self.settings.dom.firstChild;
}

module.exports = CFD;