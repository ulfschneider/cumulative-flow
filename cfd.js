'use babel';

const d3 = require('d3');
const moment = require('moment');
const Base64 = require('js-base64').Base64;

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
        settings.style.markers = {
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
        if (!settings.style.markers) {
            settings.style.markers = {
                backgroundColor: settings.style.backgroundColor,
                color: settings.style.color
            }
        } else {
            if (!settings.style.markers.backgroundColor) {
                settings.style.markers.backgroundColor = settings.style.backgroundColor;
            }
            if (!settings.style.markers.color) {
                settings.style.markers.color = settings.style.color;
            }
        }
    }
}

function validateDrawOptions(settings) {
    if (!settings.drawOptions) {
        settings.drawOptions = ['title', 'axis', 'legend', 'markers', 'predict'];
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

function dy(settings) {
    return settings.style.fontSize / 3 + 'px';
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

    settings.keys = settings.data.done;
    settings.keys = settings.keys.concat(settings.data.progress);
    settings.keys = settings.keys.concat(settings.data.toDo);

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

    if (settings.drawOptions.includes('axis')) {
        let xAxis = settings.g.append('g')
            .attr('transform', 'translate(0,' + settings.innerHeight + ')')
            .call(d3.axisBottom(settings.x).ticks(Math.floor(settings.innerWidth / 100)));
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
            .call(d3.axisRight(settings.y).ticks(Math.floor(settings.innerHeight / 50)));
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
            .attr('dy', dy(settings))
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

    if (settings.drawOptions.includes('predict') && settings.predict) {

        let predictStart = moment(settings.predict);
        let currentDate = moment(settings.data.entries[settings.data.entries.length - 1].date);
        if (predictStart.isBefore(currentDate)) {
            //x1, x2, y1, y2 to calculate the line parameters
            let x1 = settings.x(predictStart);
            let x2 = settings.x(currentDate);
            let y1 = settings.y(summarizeDone(predictStart));
            let y2 = settings.y(summarizeDone(currentDate));
            let m = (y2 - y1) / (x2 - x1);
            const X_TRIM = 2; //do not draw the prediction line direct on to of y axis

            let predictX = function () {
                return -y1 / m + x1;
            }

            let yFromX = function (x) {
                return y1 + m * (x - x1);
            }

            let dateFromX = function (x) {
                let m = (x2 - x1) / (currentDate - predictStart);
                let c = x1 - m * predictStart;
                return moment((x - c) / m);
            }

            //x0 and y0 to be used for the real start point of the line
            let x0 = x1;
            let y0 = y1;
            if (!isDateInRange(predictStart, settings) && predictStart.isBefore(currentDate)) {
                x0 = settings.x(settings.fromDate ? settings.fromDate : settings.data.entries[0].date);
                y0 = yFromX(x0);
            }

            //x3 and y3 to be used for the real end point of the line
            let x3 = settings.x(settings.toDate ? settings.toDate : currentDate) - X_TRIM;
            let y3 = yFromX(x3);
            if (y3 < 0) {
                x3 = -y1 / m + x1 - X_TRIM;
                y3 = yFromX(x3);
            }

            let pathData = [{
                x: x0,
                y: y0
            }, {
                x: x3,
                y: y3
            }, {
                x: x3,
                y: -35
            }];
            let lineFunction = d3.line()
                .x(function (d) {
                    return d.x;
                })
                .y(function (d) {
                    return d.y;
                });

            settings.g.append('path')
                .attr('d', lineFunction(pathData))
                .attr('fill', 'none')
                .style('stroke-width', '3')
                .style('stroke', settings.style.predict.backgroundColor);

            settings.g.append('path')
                .attr('d', lineFunction(pathData))
                .attr('fill', 'none')
                .style('stroke-width', '1')
                .style('stroke', settings.style.predict.color);

            let predictDate = dateFromX(predictX());
            let futureHint = predictX() - X_TRIM > x3 ? ' →' : '';
            settings.g.append('text')
                .attr('x', x3 - 5)
                .attr('y', -35)
                .attr('dy', dy(settings))
                .attr('font-size', settings.style.fontSize)
                .attr('font-family', settings.style.fontFamily)
                .style('text-anchor', 'end')
                .style('fill', settings.style.predict.color)
                .text(predictDate.format(DATE_FORMAT) + futureHint);

        }
    }
}

function isDateInRange(date, settings) {
    let dataFromDate, dataToDate;
    let momentDate = moment(date);

    dataFromDate = moment(settings.data.entries[0].date);
    dataToDate = moment(settings.data.entries[settings.data.entries.length - 1].date);

    if (settings.fromDate && momentDate.isBefore(settings.fromDate)) {
        return false;
    } else if (!settings.fromDate && momentDate.isBefore(dataFromDate)) {
        return false;
    }

    if (settings.toDate && momentDate.isAfter(settings.toDate)) {
        return false;
    } else if (!settings.toDate && momentDate.isAfter(dataToDate)) {
        return false;
    }
    return true;
}


function drawMarkers(settings) {

    let mark = function (date, label) {
        let x1 = settings.x(moment(date));
        let y1 = settings.innerHeight;
        let y2 = 0;
        settings.g.append('line')
            .attr('x1', x1)
            .attr('y1', y1)
            .attr('x2', x1)
            .attr('y2', y2)
            .style('stroke-width', '3')
            .style('stroke', settings.style.markers.backgroundColor);
        settings.g.append('line')
            .attr('x1', x1)
            .attr('y1', y1)
            .attr('x2', x1)
            .attr('y2', y2)
            .style('stroke-width', '1')
            .style('stroke', settings.style.markers.color);

        settings.g.append('text')
            .attr('x', x1)
            .attr('y', -15)
            .attr('dy', dy(settings))
            .attr('font-size', settings.style.fontSize)
            .attr('font-family', settings.style.fontFamily)
            .style('text-anchor', 'middle')
            .style('fill', settings.style.markers.color)
            .text(label ? label : moment(date).format(DATE_FORMAT));
    }

    if (settings.drawOptions.includes('markers') && settings.markers) {
        settings.markers.forEach(m => {
            if (isDateInRange(m.date, settings)) {
                mark(m.date, m.label);
            }
        });
    }
}

function drawLegend(settings) {

    const X = 5;
    const lineHeight = settings.style.fontSize;

    const drawLegendItem = function ({
        text,
        x,
        y,
        fill
    }) {
        settings.g.append('text')
            .attr('x', x)
            .attr('y', y)
            .attr('dy', dy(settings))
            .attr('font-size', settings.style.fontSize + 'px')
            .attr('font-family', settings.style.fontFamily)
            .style('text-anchor', 'start')
            .style('fill', fill)
            .text(text);
    }

    if (settings.drawOptions.includes('title')) {
        //title
        if (settings.title) {
            drawLegendItem({
                text: settings.title,
                x: X,
                y: -55,
                fill: settings.style.color
            });
        }
    }

    if (settings.drawOptions.includes('legend')) {
        //toDo legend
        drawLegendItem({
            text: 'To Do',
            x: X,
            y: lineHeight,
            fill: settings.style.toDo.color
        });

        //progress legend
        drawLegendItem({
            text: 'In Progress',
            x: X,
            y: lineHeight * 2,
            fill: settings.style.progress.color
        });

        //done legend
        drawLegendItem({
            text: 'Done',
            x: X,
            y: lineHeight * 3,
            fill: settings.style.done.color
        });

        //unit
        drawLegendItem({
            text: settings.data.unit == 'points' ? 'Story Points' : 'Issues',
            x: settings.innerWidth + 50,
            y: -35,
            fill: settings.style.color

        });
    }
}

//Object with API

/**
 * A Cumulative Flow Diagram instance
 * @constructor
 * @param {Object} settings - The configuration object for the diagram. 
 * All data for the diagram is provided with this object. 
 * In this configuration object, whenever a date is to be given, 
 * it can be an [ISO 8601 String](https://en.wikipedia.org/wiki/ISO_8601)
 * or a JavaScript [Date](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Date) object.
 * A [Moment](https://momentjs.com) object is also fine.
 * @param {String} [settings.title] - The title for the diagram.
 * @param {Object} settings.svg - The DOM tree element, wich must be an svg tag.
 * The diagram will be attached to this DOM tree element. Example:
 * <pre>settings.svg = document.getElementById('cfd-diagram');</pre>
 * <code>'cfd-diagram'</code> is the id of a svg tag.
 * @param {{top: Number, right: Number, bottom: Number, right: Number}} [settings.margin] - The margins for the diagram.
 * Default values are:
 * <pre>settings.margins = {
 * top: 75,
 * right: 210,
 * bottom: 30,
 * left: 40 }
 * </pre>
 * @param {String|Date} [settings.fromDate] - The start date for the diagram. Example:
 * <pre>settings.fromDate = '2018-09-01';</pre>
 * @param {String|Date} [settings.toDate] - The end date for the diagram. Example:
 * <pre>settings.fromDate = '2018-09-05';</pre>
 * @param {String|Date} [settings.predict] - To draw an indication line for the completion of work.
 * The predict argument determines at what date to start drawing the line. Example:
 * <pre>settings.fromDate = '2018-09-01';</pre>
 * @param {{date:(String|Date), label:String}[]} [settings.markers] - Highlight specific dates of inside of the diagram
 * with markers. Each marker is an object with a date for the marker and an optional label. Example:
 * <pre>settings.markers = [
 * { date: '2018-09-03', label: 'M1' },
 * { date: '2018-09-10', label: 'M2' }];</pre>
 * @param {String[]} [settings.drawOptions] - An array to determine the parts to be drawn. Possible contents:
 * <pre>'title' - draw the title
 * 'axis' - draw the x and y axis
 * 'legend' - draw the legend information
 * 'markers' - draw the markers
 * 'predict' - draw the predict line
 * </pre> By default all of these draw options are on.
 * @param {Object} [settings.style] - Influence the appearance of the diagram with font and color. The defaults are:
 * <pre>settings.style = {
 * fontSize: 12,
 * fontFamily: 'sans-serif',
 * color: '#222',
 * backgroundColor: '#fff',
 * axis: {color: '#222'},
 * toDo: {color: '#bec0c2', stroke: '#fff'},
 * progress: {color: '#808285', stroke: '#fff'},
 * done: {color: '#222', stroke: '#fff'},
 * markers: {color: '#222', backgroundColor: '#fff'},
 * predict: {color: '#222', backgroundColor: '#fff'}
 * }</pre>
 * @param {{toDo: String[], progress: String[], done: String[], unit: String, entries: Object[]}} settings.data - The data for the diagram. Example:
 * <pre>settings.data = {
 * toDo: ['new'],
 * progress: ['test', 'dev'],
 * done: ['done'],
 * unit: 'points',
 * entries: [
 * { date: '2018-09-03', new: 0, dev: 0, test: 0, done: 0 },
 * { date: '2018-09-04', new: 1, dev: 0, test: 0, done: 0 },
 * { date: '2018-09-05', new: 1, dev: 1, test: 0, done: 0 },
 * { date: '2018-09-06', new: 1, dev: 0, test: 1, done: 1 },
 * { date: '2018-09-07', new: 2, dev: 1, test: 0, done: 2 },
 * { date: '2018-09-08', new: 1, dev: 1, test: 2, done: 2 },
 * { date: '2018-09-09', new: 0, dev: 0, test: 1, done: 5 },
 * { date: '2018-09-10', new: 1, dev: 1, test: 0, done: 5 }
 * ]}</pre>
 * Each entry object must contain a date and the status counts for th
 * <code>toDo</code>, <code>progress</code> and <code>done</code> status categories.
 * The unit is the unit of measurement for the status counts.
 * A value of <code>'points'</code> indicates story points.
 * An omitted unit will lead to interpreting the status counts as issue counts.
 * The status categories <code>toDo</code>, <code>progress</code> and <code>done</code>
 * must contain the status values as strings that belong exactly to those categories.
 * The rendering of the layers in the Cumulate Flow Diagram will follow the order
 * of the status values provided inside of the status categories. All values of the
 * <code>done</code> status category are always rendered at the bottom of the diagram,
 * beginning from left to right. Then all <code>progress</code> status values, again left to right.
 * Finally all <code>new</code> status values, of course left to right.
 * For the above example: The <code>done</code> status layer is at the bottom, followed by
 * the <code>test</code> and <code>dev</code> layer
 * and finally the <code>new</code> layer is getting rendered.
 */
function CFD(settings) {
    this.settings = settings;
    this.defaultWidth = DEFAULT_WIDTH;
    this.defaultHeight = DEFAULT_HEIGHT;
}

CFD[Symbol.species] = CFD;

/**
 * Draw the Cumulative Flow Diagram inside of the provided <code>settings.svg</code> DOM tree element.
 */
CFD.prototype.draw = function () {
    validateSettings(this.settings);
    this.remove();
    prepareSVG(this.settings);
    prepareScales(this.settings);
    prepareDataFunctions(this.settings);
    drawLayers(this.settings);
    drawPrediction(this.settings);
    drawMarkers(this.settings);
    drawAxis(this.settings);
    drawLegend(this.settings);
}

/**
 * Clear the diagram from the provided <code>settings.svg</code> DOM tree element
 */
CFD.prototype.remove = function () {
    if (this.settings.svg) {
        let svg = this.settings.svg;
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }
    }
}

/**
 * Draw the Cumulative Flow Diagram inside of the provided <code>settings.svg</code> DOM tree element 
 * and return the result as a string which can be assigned to the src attribute of an HTML img tag.
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