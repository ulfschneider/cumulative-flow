'use babel';

let d3 = require('d3');
let moment = require('moment');
let Base64 = require('js-base64').Base64;

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 400;
const DAY_FORMAT = 'dddd D-MMM YYYY HH:mm[, GMT]Z';
const DATE_FORMAT = 'YYYY-MM-DD';

//Helper functions

function validateSettings(settings) {
    if (!settings) {
        throw "No settings";
    }

    if (!settings.svg || settings.svg.tagName !== 'svg') {
        throw "No svg";
    }

    validateData(settings);
    validateMargins(settings);
    validateStyles(settings);
    validateDrawOptions(settings);
}

function validateData(settings) {
    if (!settings.data) {
        throw "No data";
    }

    if (!settings.data.entries) {
        throw "No data entries";
    }

    if (!Array.isArray(settings.data.entries)) {
        throw "Data entries not an array";
    }

    if (!settings.data.entries.length) {
        throw "Empty data entries";
    }

    if (!settings.data.toDo) {
        throw "No toDo status defined"
    }

    if (!settings.data.progress) {
        throw "No progress status defined"
    }

    if (!settings.data.done) {
        throw "No done status defined"
    }

}

function validateMargins(settings) {
    if (!settings.margin) {
        settings.margin = {
            top: 75,
            right: 210,
            bottom: 30,
            left: 40
        }
    } else {
        if (!('top' in settings.margin)) {
            settings.margin.top = 75;
        }
        if (!('right' in settings.margin)) {
            settings.margin.right = 210;
        }
        if (!('bottom' in settings.margin)) {
            settings.margin.bottom = 30;
        }
        if (!('left' in settings.margin)) {
            settings.margin.left = 40;
        }
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
            color: '#222',
            backgroundColor: '#fff'
        };
        settings.style.axis = {
            color: settings.style.color,
        };
        settings.style.toDo = {
            color: '#bec0c2',
            stroke: settings.style.backgroundColor,
        };
        settings.style.progress = {
            color: '#808285',
            stroke: settings.style.backgroundColor,
        };
        settings.style.done = {
            color: '#222',
            stroke: settings.style.backgroundColor,
        };
        settings.style.predict = {
            backgroundColor: settings.style.backgroundColor,
            color: settings.style.done.color
        };
        settings.style.marker = {
            backgroundColor: settings.style.backgroundColor,
            color: settings.style.color
        };
    } else {
        if (!settings.style.fontSize) {
            settings.style.fontSize = 12;
        }
        if (!settings.style.fontFamily) {
            settings.style.fontFamily = 'sans-serif';
        }
        if (!settings.style.color) {
            settings.style.color = '#222';
        }
        if (!settings.style.backgroundColor) {
            settings.style.backgroundColor = '#fff';
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
                color: '#bec0c2',
                stroke: settings.style.backgroundColor
            }
        } else {
            if (!settings.style.toDo.color) {
                settings.style.toDo.color = '#bec0c2';
            }
            if (!settings.style.toDo.stroke) {
                settings.style.toDo.stroke = settings.style.backgroundColor;
            }
        }
        if (!settings.style.progress) {
            settings.style.progress = {
                color: '#808285',
                stroke: settings.style.backgroundColor
            }
        } else {
            if (!settings.style.progress.color) {
                settings.style.progress.color = '#808285';
            }
            if (!settings.style.progress.stroke) {
                settings.style.progress.stroke = settings.style.backgroundColor;
            }
        }
        if (!settings.style.done) {
            settings.style.done = {
                color: '#222',
                stroke: settings.style.backgroundColor
            }
        } else {
            if (!settings.style.done.color) {
                settings.style.done.color = '#222';
            }
            if (!settings.style.done.stroke) {
                settings.style.done.stroke = settings.style.backgroundColor;
            }
        }
        if (!settings.style.predict) {
            settings.style.predict = {
                backgroundColor: settings.style.backgroundColor,
                color: settings.style.done.color
            }
        } else {
            if (!settings.style.predict.backgroundColor) {
                settings.style.predict.backgroundColor = settings.style.backgroundColor;
            }
            if (!settings.style.predict.color) {
                settings.style.predict.color = settings.style.done.color;
            }
        }
        if (!settings.style.marker) {
            settings.style.marker = {
                backgroundColor: settings.style.backgroundColor,
                color: settings.style.color
            }
        } else {
            if (!settings.style.marker.backgroundColor) {
                settings.style.marker.backgroundColor = settings.style.backgroundColor;
            }
            if (!settings.style.marker.color) {
                settings.style.marker.color = settings.style.color;
            }
        }
    }
}

function validateDrawOptions(settings) {
    if (!settings.drawOptions) {
        settings.drawOptions = ['axis', 'legend', 'markers', 'predict'];
    }
}

function prepareSVG(settings) {
    settings.d3svg = d3.select(settings.svg);

    settings.d3svg
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('width', settings.width)
        .attr('height', settings.height);

    settings.g = settings.d3svg.append("g");
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
            return settings.x(moment(d.data.date));
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


    let xRange = d3.extent(settings.data.entries, function (d) {
        return moment(d.date);
    });

    if (settings.fromDate) {
        xRange[0] = settings.fromDate;
    }
    if (settings.toDate) {
        xRange[1] = settings.toDate;
    }
    settings.x.domain(xRange);

    settings.keys = [];
    if (settings.data.done) {
        settings.keys = settings.data.done;
    }
    if (settings.data.progress) {
        settings.keys = settings.keys.concat(settings.data.progress);
    }
    if (settings.data.toDo) {
        settings.keys = settings.keys.concat(settings.data.toDo);
    }
    settings.stack.keys(settings.keys);
    settings.y.domain([0, d3.max(settings.data.entries, function (d) {
        let sum = 0;
        for (let i = 0, n = settings.keys.length; i < n; i++) {
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

    let xAxis = settings.g.append('g')
        .attr('transform', 'translate(0,' + settings.innerHeight + ')')
        .call(d3.axisBottom(settings.x).ticks(d3.timeWeek));
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



    let yAxis = settings.g.append('g')
        .attr('transform', 'translate(' + settings.innerWidth + ' ,0)')
        .call(d3.axisRight(settings.y).ticks(5));
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
        .data(settings.stack(settings.data.entries.filter(function (d) {
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
                return settings.style.progress.color;
            } else if (isDoneStatus(d.key, settings)) {
                return settings.style.done.color;
            }
            return settings.style.toDo.color;
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

    if (settings.drawOptions.includes('legend')) {
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
}

function drawPrediction(settings) {
    let summarizeDone = function (date) {
        for (let entry of settings.data.entries) {
            if (moment(entry.date).isSame(date, 'day')) {
                let sum = 0;
                for (let key of settings.keys) {
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

        let startDate = moment(settings.predict);
        let currentDate = moment(settings.data.entries[settings.data.entries.length - 1].date);
        if (startDate && startDate.isBefore(currentDate) && isDateInRange(startDate, settings)) {
            let x1 = settings.x(startDate);
            let x2 = settings.x(currentDate);
            let y1 = settings.y(summarizeDone(startDate));
            let y2 = settings.y(summarizeDone(currentDate));
            let m = (y2 - y1) / (x2 - x1);

            let predictX = function () {
                return -y1 / m + x1;
            }

            let dateFromX = function (x) {
                let m = (x2 - x1) / (currentDate - startDate);
                let c = x1 - m * startDate;
                return moment((x - c) / m);
            }

            let x3 = settings.x(settings.toDate ? settings.toDate : currentDate);
            let y3 = y1 + m * (x3 - x1);
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

            settings.g.append('line')
                .attr('x1', x3)
                .attr('y1', y3)
                .attr('x2', x3)
                .attr('y2', -35)
                .style('stroke-width', '3')
                .style('stroke', settings.style.predict.backgroundColor);
            settings.g.append('line')
                .attr('x1', x3)
                .attr('y1', y3)
                .attr('x2', x3)
                .attr('y2', -35)
                .style('stroke-width', '1')
                .style('stroke', settings.style.predict.color);

            settings.g.append('text')
                .attr('x', x3 - 5)
                .attr('y', -35)
                .attr('dy', '.35em')
                .attr('font-size', settings.style.fontSize)
                .attr('font-family', settings.style.fontFamily)
                .style('text-anchor', 'end')
                .style('fill', settings.style.predict.color)
                .text(dateFromX(predictX()).format(DATE_FORMAT));

        }
    }
}

function isDateInRange(date, settings) {
    let dataFromDate, dataToDate;
    let momentDate = moment(date);

    if (settings.data.length) {
        dataFromDate = moment(settings.data[0].date);
        dataToDate = moment(settings.data[settings.data.length - 1].date);
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

    let mark = function (date, label) {
        let x1 = settings.x(date);
        let y1 = settings.innerHeight;
        let y2 = 0;
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
    if (settings.title) {
        settings.g.append('text')
            .attr('x', 5)
            .attr('y', -55)
            .attr('dy', '.35em')
            .attr('font-size', settings.style.fontSize + 'px')
            .attr('font-family', settings.style.fontFamily)
            .style('text-anchor', 'start')
            .style('fill', settings.style.color)
            .text(settings.title);
    }

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
        .style('fill', settings.style.color)
        .text(settings.data.unit == 'points' ? 'Story Points' : 'Issues');
}


//Object with API

/**
 * A Cumulative Flow Diagram instance
 * @class
 * @constructor
 * @param {*} settings - the configuration 
 */
function CFD(settings) {
    this.settings = settings;
    this.defaultWidth = DEFAULT_WIDTH;
    this.defaultHeight = DEFAULT_HEIGHT;
}

CFD[Symbol.species] = CFD;

/**
 * Will draw a Cumulative Flow Diagram by using the data provided in the constructor.
 * All contents of the svg are removed before drawing.
 */
CFD.prototype.draw = function () {
    validateSettings(this.settings);
    this.remove();
    prepareSVG(this.settings);
    prepareScales(this.settings);
    prepareDataFunctions(this.settings);
    drawLayers(this.settings);

    if (this.settings.drawOptions.includes('predict')) {
        drawPrediction(this.settings);
    }
    if (this.settings.drawOptions.includes('markers')) {
        drawMarkers(this.settings);
    }
    if (this.settings.drawOptions.includes('axis')) {
        drawAxis(this.settings);
    }
    if (this.settings.drawOptions.includes('legend')) {
        drawLegend(this.settings);
    }
}

/**
 * Clear the diagram
 */
CFD.prototype.remove = function () {
    if (this.settings.d3svg) {
        this.settings.d3svg.selectAll("*").remove();
    }
}

/**
 * By using the data from the settings object, the method will draw a 
 * Cumulative Flow Diagram and return the result as a string which can be 
 * assigned to the src attribute of an HTML img tag
 * @returns {string}
 */

CFD.prototype.image = function () {
    this.draw();
    let html = this.settings.svg.outerHTML;
    return 'data:image/svg+xml;base64,' + Base64.encode(html);
}

module.exports = function (settings) {
    return new CFD(settings);
}


