'use babel';

const d3 = require('d3');
const moment = require('moment');
const Base64 = require('js-base64').Base64;
const _ = require('underscore');

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 400;
const DATE_FORMAT = 'YYYY-MM-DD';
const LEGEND_X = 10;
const LEGEND_Y = 2.5;
const LEGEND_PAD = 3;


//Helper functions

function minDate(dates) {
    let min;
    for (let d of dates) {

        if (moment.isMoment(d)) {
            if (!min) {
                min = d;
            }
            if (min.diff(d) > 0) {
                min = d;
            }
        }
    }
    return min;
}

function validateSettings(settings) {
    if (!settings) {
        throw "No settings";
    }

    if (!settings.svg || settings.svg.tagName.toLowerCase() !== 'svg') {
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

    settings.data.keys = [...settings.data.done].concat(settings.data.progress).concat(settings.data.toDo);
    settings.data.reverseKeys = [...settings.data.keys].reverse();

    transformData(settings);
}

function transformData(settings) {

    if (_.isArray(settings.data.entries[0])) {
        //the given data entries itself are arrays        
        let transformedEntries = [];
        for (let entry of settings.data.entries) {
            let transformedEntry = {}

            //the first value of the array must be the date
            transformedEntry.date = getMoment(entry[0]);

            //the following entries must be the values in order of the given keys
            let i = 1;

            for (let key of settings.data.keys) {
                transformedEntry[key] = entry[i];
                i++;
            }
            transformedEntries.push(transformedEntry);
        }
        settings.data.entries = transformedEntries;
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
            color: '#ccc',
            stroke: settings.style.backgroundColor,
        };
        settings.style.progress = {
            color: '#888',
            stroke: settings.style.backgroundColor,
        };
        settings.style.done = {
            color: '#555',
            stroke: settings.style.backgroundColor,
        };
        settings.style.predict = {
            backgroundColor: settings.style.backgroundColor,
            color: settings.style.color,
            goodColor: settings.style.color,
            troubleColor: settings.style.color
        };
        settings.style.shortTermPredict = {
            backgroundColor: settings.style.predict.backgroundColor,
            color: settings.style.predict.color,
            goodColor: settings.style.predict.goodColor,
            troubleColor: settings.style.predict.troubleColor
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
                color: '#ccc',
                stroke: settings.style.backgroundColor
            }
        } else {
            if (!settings.style.toDo.color) {
                settings.style.toDo.color = '#ccc';
            }
            if (!settings.style.toDo.stroke) {
                settings.style.toDo.stroke = settings.style.backgroundColor;
            }
        }
        if (!settings.style.progress) {
            settings.style.progress = {
                color: '#888',
                stroke: settings.style.backgroundColor
            }
        } else {
            if (!settings.style.progress.color) {
                settings.style.progress.color = '#888';
            }
            if (!settings.style.progress.stroke) {
                settings.style.progress.stroke = settings.style.backgroundColor;
            }
        }
        if (!settings.style.done) {
            settings.style.done = {
                color: '#555',
                stroke: settings.style.backgroundColor
            }
        } else {
            if (!settings.style.done.color) {
                settings.style.done.color = '#555';
            }
            if (!settings.style.done.stroke) {
                settings.style.done.stroke = settings.style.backgroundColor;
            }
        }
        if (!settings.style.predict) {
            settings.style.predict = {
                backgroundColor: settings.style.backgroundColor,
                color: settings.style.color,
                goodColor: settings.style.color,
                troubleColor: settings.style.color
            }
        } else {
            if (!settings.style.predict.backgroundColor) {
                settings.style.predict.backgroundColor = settings.style.backgroundColor;
            }
            if (!settings.style.predict.color) {
                settings.style.predict.color = settings.style.color;
            }
            if (!settings.style.predict.goodColor) {
                settings.style.predict.goodColor = settings.style.color;
            }
            if (!settings.style.predict.troubleColor) {
                settings.style.predict.troubleColor = settings.style.color;
            }
        }
        if (!settings.style.shortTermPredict) {
            settings.style.shortTermPredict = {
                backgroundColor: settings.style.predict.backgroundColor,
                color: settings.style.predict.color,
                goodColor: settings.style.predict.color,
                troubleColor: settings.style.predict.color
            }
        } else {
            if (!settings.style.shortTermPredict.backgroundColor) {
                settings.style.shortTermPredict.backgroundColor = settings.style.predict.backgroundColor;
            }
            if (!settings.style.shortTermPredict.color) {
                settings.style.shortTermPredict.color = settings.style.predict.color;
            }
            if (!settings.style.shortTermPredict.goodColor) {
                settings.style.shortTermPredict.goodColor = settings.style.shortTermPredict.color;
            }
            if (!settings.style.shortTermPredict.troubleColor) {
                settings.style.shortTermPredict.troubleColor = settings.style.shortTermPredict.color;
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
        settings.drawOptions = ['title', 'axis', 'legend', 'markers', 'predict', 'focus'];
    }
}

function prepareSVG(settings) {
    settings.d3svg = d3.select(settings.svg);

    settings.d3svg
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('width', settings.width)
        .attr('height', settings.height);

    settings.defs = settings.d3svg.append('defs');
    let pattern = settings.defs.append('pattern')
        .attr('id', 'pattern-checkers')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 4)
        .attr('height', 4)
        .attr('patternUnits', 'userSpaceOnUse');

    pattern.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 2)
        .attr('height', 2)
        .style('fill', settings.style.done.color);

    pattern.append('rect')
        .attr('x', 2)
        .attr('y', 0)
        .attr('width', 2)
        .attr('height', 2)
        .style('fill', settings.style.toDo.color);

    pattern.append('rect')
        .attr('x', 0)
        .attr('y', 2)
        .attr('width', 2)
        .attr('height', 2)
        .style('fill', settings.style.toDo.color);

    pattern.append('rect')
        .attr('x', 2)
        .attr('y', 2)
        .attr('width', 2)
        .attr('height', 2)
        .style('fill', settings.style.done.color);



    settings.g = settings.d3svg.append('g');
    if (settings.margin.left || settings.margin.top) {
        settings.g.attr('transform', 'translate(' + settings.margin.left + ',' + settings.margin.top + ')');
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
        .x(function (d) {
            return settings.x(getStartOfDay(d.data.date));
        })
        .y0(function (d) {
            return settings.y(d[0]);
        })
        .y1(function (d) {
            return settings.y(d[1]);
        });

    settings.fromDate = settings.fromDate ? getStartOfDay(settings.fromDate) : settings.fromDate;
    settings.toDate = settings.toDate ? getStartOfDay(settings.toDate) : settings.toDate;
    settings.predictTarget = settings.predictTarget ? getStartOfDay(settings.predictTarget) : settings.predictTarget;

    let xRange = d3.extent(settings.data.entries, function (d) {
        return getStartOfDay(d.date);
    });

    if (settings.fromDate) {
        xRange[0] = settings.fromDate;
    }
    if (settings.toDate) {
        xRange[1] = settings.toDate;
    }
    settings.x.domain(xRange);

    settings.stack.keys(settings.data.keys);
    settings.y.domain([0, d3.max(settings.data.entries, function (d) {
        let sum = 0;
        for (let i = 0, n = settings.data.keys.length; i < n; i++) {
            sum += d[settings.data.keys[i]];
        }
        return sum;
    })]);
}

function isToDoStatus(status, settings) {
    return settings.data.toDo.indexOf(status) >= 0;
}

function isProgressStatus(status, settings) {
    return settings.data.progress.indexOf(status) >= 0;
}

function isDoneStatus(status, settings) {
    return settings.data.done.indexOf(status) >= 0;
}

function getStartOfDay(date) {
    return getMoment(date).startOf('day');
}

function getMoment(date) {
    return moment(date);
}

function getDataSet(date, settings) {
    for (let entry of settings.data.entries) {

        if (getMoment(entry.date).isSame(date, 'day')) {
            //sort the result
            let result = {
                date: getStartOfDay(entry.date),
                __sum: 0,
                __count: 1
            }
            for (let key of settings.data.reverseKeys) {
                if (_.isNumber(entry[key]) && entry[key] > 0) {
                    //count only positive numbers
                    result[key] = entry[key];
                    result.__sum += entry[key];
                    result.__count += 1;
                }
            }
            return result;
        }
    }
    return null;
}

function getFirstEntryDate(settings) {
    return getStartOfDay(settings.data.entries[0].date);
}

function getLastEntryDate(settings) {
    let entry = getStartOfDay(settings.data.entries[settings.data.entries.length - 1].date);
    if (settings.toDate && settings.toDate.isBefore(entry)) {
        return getMoment(settings.toDate);
    } else {
        return entry;
    }
}

function dy(settings) {
    return settings.style.fontSize / 3 + 'px';
}

function round(number) {
    return Math.round(number * 100) / 100;
}


function drawTextWithBackground({
    text,
    textAnchor,
    x,
    y,
    color,
    background,
    settings
}) {
    let bkg = settings.g.append('rect')
        .style('fill', background);
    let txt = settings.g.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('dy', dy(settings))
        .attr('font-size', settings.style.fontSize + 'px')
        .attr('font-family', settings.style.fontFamily)
        .style('fill', color)
        .style('text-anchor', textAnchor ? textAnchor : 'start')
        .text(text);

    try {
        let bbx = txt.node().getBBox();
        if (textAnchor == 'middle') {
            bkg.attr('x', x - bbx.width / 2);
        } else if (textAnchor == 'end') {
            bkg.attr('x', x - bbx.width);
        } else {
            bkg.attr('x', x);
        }
        bkg.attr('y', y - settings.style.fontSize / 2)
            .attr('width', bbx.width)
            .attr('height', settings.style.fontSize);
    } catch (e) {
        //JSDOM is not able to operate with bbox
        //therefore this code is not going to run in the tests
    }
}


function drawAxis(settings) {

    if (settings.drawOptions.includes('axis')) {
        let xAxis = settings.g.append('g')
            .attr('transform', 'translate(0,' + settings.innerHeight + ')')
            .call(d3.axisBottom(settings.x).ticks(Math.floor(settings.innerWidth / 120)).tickFormat(d3.timeFormat("%b %d")));
        xAxis
            .selectAll('path')
            .style('stroke', settings.style.axis.color);
        xAxis
            .selectAll('line')
            .style('stroke', settings.style.axis.color);
        xAxis
            .selectAll('text')
            .style('fill', settings.style.axis.color)
            .style('text-anchor', 'start')
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
            .attr('text-anchor', 'start')
            .attr('font-size', settings.style.fontSize + 'px')
            .attr('font-family', settings.style.fontFamily);
    }
}

function drawLayers(settings) {
    let layer = settings.g.selectAll('.layer')
        .data(settings.stack(
            settings.data.entries.filter(function (d) {
                return isDateInRange(d.date, settings);
            })))
        .enter()
        .append('g')
        .attr('class', 'layer');

    layer
        .append('path')
        .attr('class', 'area')
        .style('fill', function (d) {
            if (isToDoStatus(d.key, settings)) {
                return settings.style.toDo.color;
            } else if (isProgressStatus(d.key, settings)) {
                if (settings.style.progress.pattern) {
                    return 'url(#pattern-checkers)';
                } else {
                    return settings.style.progress.color;
                }
            } else if (isDoneStatus(d.key, settings)) {
                return settings.style.done.color;
            }
            return settings.style.toDo.color;
        })
        .style('stroke', function (d) {
            if (isToDoStatus(d.key, settings)) {
                return settings.style.toDo.stroke;
            } else if (isProgressStatus(d.key, settings)) {
                return settings.style.progress.stroke;
            } else if (isDoneStatus(d.key, settings)) {
                return settings.style.done.stroke;
            }
            return settings.style.toDo.stroke;
        })
        .style('stroke-width', function (d) {
            return '0.5';
        })
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
                return settings.style.color;
            })
            .text(function (d) {
                return round(d[d.length - 1][1] - d[d.length - 1][0]) + ' ' + d.key;
            });
    }
}

function calculatePredictData(settings, predictStart) {
    const summarizeDone = function (date) {
        for (let entry of settings.data.entries) {
            if (getMoment(entry.date).isSame(date, 'day')) {
                let sum = 0;
                for (let key of settings.data.keys) {
                    if (isDoneStatus(key, settings)) {
                        sum += entry[key];
                    }
                }
                return sum;
            }
        }
        return 0;
    }

    const summarizeAll = function (date) {
        for (let entry of settings.data.entries) {
            if (getMoment(entry.date).isSame(date, 'day')) {
                let sum = 0;
                for (let key of settings.data.keys) {
                    if (isToDoStatus(key, settings) || isProgressStatus(key, settings) || isDoneStatus(key, settings)) {
                        sum += entry[key];
                    }
                }
                return sum;
            }
        }
        return 0;
    }

    predictStart = getStartOfDay(predictStart);
    let result = {};
    let currentDate = getLastEntryDate(settings)
    let doneAtPredictStart = summarizeDone(predictStart);
    let doneAtCurrentDate = summarizeDone(currentDate);
    let allAtCurrentDate = summarizeAll(currentDate);
    if (predictStart.isBefore(currentDate) && doneAtPredictStart < doneAtCurrentDate) {
        //x1, x2, y1, y2 to calculate the line parameters
        result.x1 = settings.x(predictStart);
        result.x2 = settings.x(currentDate);
        result.y1 = settings.y(doneAtPredictStart);
        result.y2 = settings.y(doneAtCurrentDate);
        result.y = settings.y(allAtCurrentDate);
        result.m = (result.y2 - result.y1) / (result.x2 - result.x1);

        let predictX = function () {
            return (result.y - result.y1) / result.m + result.x1;
        }

        let dateFromX = function (x) {
            let m = (result.x2 - result.x1) / (currentDate - predictStart);
            let c = result.x1 - m * predictStart;
            return getStartOfDay((x - c) / m);
        }


        result.x = predictX();
        result.date = dateFromX(result.x);
    }

    return result;
}

function drawPrediction(settings) {

    const setAutoPredict = function () {
        //calculate autoPredict date only once
        for (let entry of settings.data.entries) {
            for (let key of settings.data.keys) {
                if (isDoneStatus(key, settings) && entry[key] > 0) {
                    settings.predict = entry.date;
                    return settings.predict;
                }
            }
        }
    }

    const drawPredictLine = function ({ predictStart, shortTerm }) {
        let date;
        let currentDate = getLastEntryDate(settings);


        //x1, x2, y1, y2 to calculate the line parameters
        let predictData = calculatePredictData(settings, predictStart);

        if (predictData.date) {
            const X_TRIM = 2; //do not draw the prediction line direct on y axis

            let yFromX = function (x) {
                return predictData.y1 + predictData.m * (x - predictData.x1);
            }

            //x0 and y0 to be used for the real start point of the line
            let x0 = predictData.x1 + 0.5; //like for markers
            let y0 = predictData.y1;
            if (!isDateInRange(predictStart, settings) && predictStart.isBefore(currentDate)) {
                x0 = settings.x(getStartOfDay(settings.fromDate ? settings.fromDate : getFirstEntryDate(settings)));
                y0 = yFromX(x0);
            }

            //x3 and y3 to be used for the real end point of the line
            let x3 = predictData.x - X_TRIM;
            if (!isDateInRange(predictData.date, settings)) {
                x3 = settings.x(settings.toDate ? settings.toDate : currentDate) - X_TRIM;
            }

            let y3 = yFromX(x3);
            if (y3 < 0) {
                x3 = -predictData.y1 / predictData.m + predictData.x1 - X_TRIM;
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
                y: shortTerm ? -55 : -35
            }];

            let lineFunction = d3.line()
                .x(function (d) {
                    return d.x;
                })
                .y(function (d) {
                    return d.y;
                });

            date = predictData.date;
            let futureHint = predictData.x - X_TRIM > x3 ? ' →' : '';

            let backgroundColor = settings.style.predict.backgroundColor;

            if ((settings.predictTarget || settings.toDate) && date.isAfter(minDate([settings.predictTarget, settings.toDate]))) {
                color = shortTerm ? settings.style.shortTermPredict.troubleColor : settings.style.predict.troubleColor;
            } else if ((settings.predictTarget || settings.toDate) && date.isSameOrBefore(minDate([settings.predictTarget, settings.toDate]))) {
                color = shortTerm ? settings.style.shortTermPredict.goodColor : settings.style.predict.goodColor;
            } else {
                color = settings.style.predict.color;
            }


            settings.g.append('path')
                .attr('d', lineFunction(pathData))
                .attr('fill', 'none')
                .style('stroke-width', '3')
                .style('stroke', backgroundColor);

            let path = settings.g.append('path')
                .attr('d', lineFunction(pathData))
                .attr('fill', 'none')
                .style('stroke-width', '1')
                .style('stroke', color);
            if (shortTerm) {
                path.style('stroke-dasharray', ('9, 3'));
            }


            let label = shortTerm ? settings.shortTermPredict + ' day: ' : '';
            label += date.format(DATE_FORMAT) + futureHint;

            drawTextWithBackground({
                text: label,
                textAnchor: 'end',
                x: x3 - 5,
                y: shortTerm ? -55 : -35,
                color: color,
                background: backgroundColor,
                settings: settings
            });
        }
        return predictData;
    }

    if (settings.drawOptions.includes('predict')) {
        if (!settings.predict) {
            setAutoPredict();
        }

        if (settings.shortTermPredict) {
            let fromDate = getFirstEntryDate(settings);
            let currentDate = getLastEntryDate(settings);

            if (settings.fromDate
                && currentDate.isSameOrAfter(settings.fromDate)) {
                fromDate = settings.fromDate;
            }

            let shortTermPredictStart = currentDate.subtract(Math.abs(settings.shortTermPredict), 'days');

            if (shortTermPredictStart.isAfter(fromDate)) {
                drawPredictLine({
                    predictStart: shortTermPredictStart,
                    shortTerm: true
                });
            }

        }

        if (settings.predict) {
            drawPredictLine({ predictStart: settings.predict });
        }

    }
}

function isDateInRange(date, settings) {
    let dataFromDate, dataToDate;
    let momentDate = getStartOfDay(date);

    dataFromDate = getFirstEntryDate(settings);
    dataToDate = getLastEntryDate(settings);

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

    let mark = function (date, label, color) {
        let x1 = settings.x(getStartOfDay(date)) + 0.5; //perfect align marker
        let y1 = settings.innerHeight;
        let y2 = 0;
        if (!getStartOfDay(date).isSame(settings.toDate) || !settings.drawOptions.includes('axis')) {
            //as we have an axis at the right side, do only draw
            //the marker if its not directly on top of the axis

            if (x1 > 0.5) {
                settings.g.append('line')
                    .attr('x1', x1)
                    .attr('y1', y1)
                    .attr('x2', x1)
                    .attr('y2', y2)
                    .style('stroke-width', '3')
                    .style('stroke', settings.style.markers.backgroundColor);
            }
            settings.g.append('line')
                .attr('x1', x1)
                .attr('y1', y1)
                .attr('x2', x1)
                .attr('y2', y2)
                .style('stroke-width', '1')
                .style('stroke', color ? color : settings.style.markers.color);
        }

        drawTextWithBackground({
            text: (label ? label : getMoment(date).format(DATE_FORMAT)),
            x: x1,
            y: -15,
            color: color ? color : settings.style.markers.color,
            textAnchor: 'start',
            background: settings.style.backgroundColor,
            settings: settings
        });

    }

    if (settings.drawOptions.includes('markers') && settings.markers) {
        settings.markers.forEach(m => {
            if (isDateInRange(m.date, settings)) {
                mark(m.date, m.label, m.color);
            }
        });
    }
}

function drawLegend(settings) {

    const lineHeight = settings.style.fontSize;

    const drawLegendItem = function ({
        text,
        x,
        y,
        fill
    }) {
        return settings.g.append('text')
            .attr('x', x)
            .attr('y', y)
            .attr('dy', dy(settings))
            .attr('font-size', settings.style.fontSize + 'px')
            .attr('font-family', settings.style.fontFamily)
            .style('text-anchor', 'start')
            .style('fill', fill)
            .text(text);
    }

    const drawRectangle = function ({
        x,
        y,
        width,
        height,
        fill,
        stroke
    }) {
        return settings.g.append('rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', width)
            .attr('height', height)
            .style('fill', fill ? fill : settings.style.backgroundColor)
            .style('stroke', stroke ? stroke : settings.style.backgroundColor);
    }

    if (settings.drawOptions.includes('title')) {
        //title
        if (settings.title) {
            drawLegendItem({
                text: settings.title,
                x: LEGEND_X - LEGEND_PAD,
                y: -55,
                fill: settings.style.color
            });
        }
    }

    if (settings.drawOptions.includes('legend')) {

        let background = drawRectangle({
            x: LEGEND_X - LEGEND_PAD,
            y: LEGEND_Y + lineHeight / 2 - LEGEND_PAD,
            width: settings.style.fontSize * 8,
            height: 3.5 * lineHeight,
            stroke: settings.style.color
        });

        //toDo legend
        drawRectangle({
            x: LEGEND_X,
            y: LEGEND_Y + 0.5 * lineHeight,
            width: lineHeight,
            height: lineHeight,
            fill: settings.style.toDo.color
        });
        drawLegendItem({
            text: 'To Do',
            x: LEGEND_X + lineHeight * 1.62,
            y: LEGEND_Y + lineHeight,
            fill: settings.style.color
        });

        //progress legend
        drawRectangle({
            x: LEGEND_X,
            y: LEGEND_Y + 1.5 * lineHeight,
            width: lineHeight,
            height: lineHeight,
            fill: settings.style.progress.pattern ? 'url(#pattern-checkers)' : settings.style.progress.color
        });
        let progress = drawLegendItem({
            text: 'In Progress',
            x: LEGEND_X + lineHeight * 1.62,
            y: LEGEND_Y + 2 * lineHeight,
            fill: settings.style.color,
        });

        //done legend
        drawRectangle({
            x: LEGEND_X,
            y: LEGEND_Y + 2.5 * lineHeight,
            width: lineHeight,
            height: lineHeight,
            fill: settings.style.done.color
        });
        drawLegendItem({
            text: 'Done',
            x: LEGEND_X + lineHeight * 1.62,
            y: LEGEND_Y + LEGEND_PAD * lineHeight,
            fill: settings.style.color
        });


        //adjust background width
        //and use progress because it has the most length of 
        //To Do, In Progress and Done
        try {
            let bbox = progress.node().getBBox();
            background.attr('width', bbox.width + 2.6 * lineHeight);
        } catch (e) {
            //JSDOM is not able to operate with bbox
            //therefore this code is not going to run in the tests
        }

        //unit
        drawLegendItem({
            text: settings.data.unit == 'points' ? 'Story Points' : 'Item Count',
            x: settings.innerWidth + 50,
            y: -35,
            fill: settings.style.color

        });
    }
}

function drawFocus(settings) {

    if (settings.drawOptions.includes('focus')) {
        const lineHeight = settings.style.fontSize;

        let drawFocusItems = function (dataSet) {
            hideFocus();

            let x = settings.x(dataSet.date) + 0.5; //perfect align marker
            let y = LEGEND_Y + lineHeight / 2;
            let row = 0.5;
            let width = 0;

            let y1 = settings.innerHeight;
            let y2 = 0;
            if (!dataSet.date.isSame(settings.toDate) || !settings.drawOptions.includes('axis')) {
                //as we have an axis at the right side, we only draw
                //the marker if its not directly on top of the axis

                if (x > 0.5) {
                    markerBackground
                        .attr('x1', x)
                        .attr('y1', y1)
                        .attr('x2', x)
                        .attr('y2', y2)
                        .style('display', null);
                }
                marker
                    .attr('x1', x)
                    .attr('y1', y1)
                    .attr('x2', x)
                    .attr('y2', y2)
                    .style('display', null);
            }

            focus
                .attr('x', (x + 2))
                .attr('y', (y - LEGEND_PAD))
                .attr('height', (.5 + row + dataSet.__count) * lineHeight)
                .style('display', null);

            let count = 0;
            for (let key of _.keys(dataSet)) {
                if (!key.startsWith('__')) {
                    focusItems[count]
                        .attr('x', x + LEGEND_PAD + 2)
                        .attr('y', key == 'date' ? y + row * lineHeight : y + (0.5 + row) * lineHeight)
                        .style('display', null)
                        .text(key == 'date' ? getMoment(dataSet[key]).format(DATE_FORMAT) : round(dataSet[key]) + ' ' + key)
                    try {
                        let bbx = focusItems[count].node().getBBox();
                        width = Math.max(width, bbx.width + 2 * LEGEND_PAD);
                    } catch (e) { }
                    row++;
                    count++;
                }
            }
            focus.attr('width', width);

            if (x + 2 + width >= settings.innerWidth) {
                let offset = - (2 + width);
                focus.attr('x', x + offset);
                for (let focusItem of focusItems) {
                    focusItem.attr('x', x + LEGEND_PAD + offset);
                }
            }

        }

        let mousemove = function () {
            let date = getStartOfDay(settings.x.invert(d3.mouse(this)[0]));
            let lastDate = getLastEntryDate(settings);

            if (date.isAfter(lastDate)) {
                date = lastDate;
            }

            let dataSet = getDataSet(date, settings);
            if (dataSet && dataSet.__count > 1) {
                drawFocusItems(dataSet);
            } else {
                hideFocus();
            }
        }

        let hideFocus = function () {
            focus.style('display', 'none');
            for (let focusItem of focusItems) {
                focusItem.style('display', 'none');
            }
            markerBackground.style('display', 'none');
            marker.style('display', 'none');
        }

        let focus = settings.g.append("rect")
            .attr('fill', settings.style.backgroundColor)
            .attr('stroke', settings.style.color)
            .attr('class', 'focus-item')
            .attr('width', lineHeight)
            .attr('height', lineHeight)
            .style('display', 'none');

        let focusItems = [];
        for (let i = 0; i < 40; i++) {
            let focusItem = settings.g.append('text')
                .attr('dy', dy(settings))
                .attr('font-size', settings.style.fontSize + 'px')
                .attr('font-family', settings.style.fontFamily)
                .style('text-anchor', 'start')
                .style('fill', settings.style.color)
                .style('display', 'none')
                .text('');

            focusItems.push(focusItem);
        }

        let markerBackground = settings.g.append('line')
            .style('display', 'none')
            .style('stroke-width', '3')
            .style('stroke', settings.style.markers.backgroundColor);

        let marker = settings.g.append('line')
            .style('display', 'none')
            .style('stroke-width', '1')
            .style('stroke', settings.style.markers.color);

        settings.g.append("rect")
            .attr('width', settings.innerWidth + settings.margin.right)
            .attr('height', settings.innerHeight)
            .attr('fill', 'transparent')
            .on('mousemove', mousemove)
            .on('mouseout', hideFocus);

    }
}

//Object with API

/**
 * <a href='https://travis-ci.com/ulfschneider/cumulative-flow'><img src='https://travis-ci.com/ulfschneider/cumulative-flow.svg?branch=master'/></a>
 * <a href='https://coveralls.io/github/ulfschneider/cumulative-flow?branch=master'><img src='https://coveralls.io/repos/github/ulfschneider/cumulative-flow/badge.svg?branch=master' /></a>
 * <a href='https://badge.fury.io/js/cumulative-flow'><img src='https://badge.fury.io/js/cumulative-flow.svg' /></a>
 *
 * Draw SVG Cumulative Flow Diagrams and predict the anticipated completion of work.
 * 
 * <img src="https://raw.githubusercontent.com/ulfschneider/cumulative-flow/master/cfd.png"/>
 *
 * Install in your Node project with 
 * <pre>
 * npm i cumulative-flow
 * </pre>
 * 
 * and use it inside your code via 
 * 
 * <pre>
 * const cfd = require('cumulative-flow');
 * </pre>
 * 
 * or, alternatively 
 * 
 * <pre>
 * import cfd from 'cumulative-flow';
 * </pre>
 * 
 * Create the new cfd objects via
 * 
 * <pre>
 * let diagram = cfd(settings);
 * </pre>
 * 
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
 * <pre>settings.svg = document.getElementById('cfdDiagram');</pre>
 * <code>'cfdDiagram'</code> is the id of a svg tag.
 * @param {Number} [settings.width] - The width of the diagram in pixels, the margin settings have to be included in that width.
 * @param {Number} [settings.height] - The height of the diagram in pixels, the margin settings have to be included in that height.
 * @param {{top: Number, right: Number, bottom: Number, right: Number}} [settings.margin] - The margin for the diagram.
 * Default values are:
 * <pre>settings.margin = {
 * top: 75,
 * right: 210,
 * bottom: 30,
 * left: 40 }
 * </pre>
 * @param {String|Date} [settings.fromDate] - The start date for the diagram. Example:
 * <pre>settings.fromDate = '2018-09-01';</pre>
 * @param {String|Date} [settings.toDate] - The end date for the diagram. Example:
 * <pre>settings.toDate = '2018-09-05';</pre>
 * @param {String|Date} [settings.predict] - To draw an indication line for the completion of work.
 * The predict argument determines at what date to start drawing the line. Example:
 * <pre>settings.predict = '2018-09-01';</pre>
 * If no date is provided but the drawOptions allow to draw a prediction line, an automatic
 * start date for that line will be calculated based on the first date something went to done.
 * @param {String|Date} [settings.predictTarget] - Provide a predict target that differs from 
 * the end date of the diagram (is before the end date)
 * @param {Number} [settings.shortTermPredict] - Indicate the number of days to go back from current date to 
 * determine a short term predict start date. This will be used to draw a second prediction line. If 0, no
 * short term prediction line is drawn. Default is 0. Example:
 * <pre>settings.shortTermPredict = 30;</pre> 
 * @param {{date:(String|Date), label:String}[]} [settings.markers] - Highlight specific dates 
 * inside of the diagram with markers. 
 * Each marker is an object with a date for the marker and an optional label. It can as well have an optional color. 
 * Example:
 * <pre>settings.markers = [
 * { date: '2018-09-03', label: 'M1', color: 'green' },
 * { date: '2018-09-10', label: 'M2' }];</pre>
 * @param {String[]} [settings.drawOptions] - An array to determine the parts to be drawn. Possible options:
 * <pre>'title' - draw the title
 * 'axis' - draw the x and y axis
 * 'legend' - draw the legend information
 * 'markers' - draw the markers
 * 'predict' - draw the predict line
 * 'focus' - draw detailed data when hovering the diagram
 * </pre> By default all of these draw options are on.
 * @param {Object} [settings.style] - Influence the appearance of the diagram with typeface and colors. 
 * The defaults are:
 * <pre>settings.style = {
 * fontSize: 12,
 * fontFamily: 'sans-serif',
 * color: '#222',
 * backgroundColor: '#fff',
 * axis: {color: '#222'},
 * toDo: {color: '#ccc', stroke: '#fff'},
 * progress: {color: '#888', stroke: '#fff', pattern: false},
 * done: {color: '#222', stroke: '#fff'},
 * markers: {color: '#222', backgroundColor: '#fff'},
 * predict: {color: '#222', backgroundColor: '#fff', goodColor: '#222', troubleColor: '#222'},
 * shortTermPredict: {color: '#222', backgroundColor: '#fff', goodColor: '#222', troubleColor: '#222'}
 * }</pre> 
 * A setting of <code>settings.style.progress.pattern = true</code> will ignore the color setting for 
 * progress and instead will create a pattern made of the toDo color and the done color. 
 * For the prediction, a <code>goodColor</code> is used whenever the workload can be completed within
 * the scheduled amount of time and the <code>troubleColor</code> is used in case there is 
 * not sufficient time to complete all work.
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
 * Each entry object must contain a date and the status counts for the
 * <code>toDo</code>, <code>progress</code> and <code>done</code> status categories.
 * The unit is the unit of measurement for the status counts.
 * A value of <code>'points'</code> indicates story points.
 * An omitted unit will lead to interpreting the status counts as item counts.
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
    drawFocus(this.settings);
}

/**
 * Calculate the predict date and the short term predict date
 * @returns {Object} with  <code>predict</code> and <code>shortTermPredict</code> dates as strings
 */
CFD.prototype.prediction = function () {
    validateData(this.settings);
    validateMargins(this.settings);
    prepareScales(this.settings);
    prepareDataFunctions(this.settings);

    let predict, shortTermPredict;
    if (this.settings.predict) {
        predict = calculatePredictData(this.settings, this.settings.predict);
    }

    if (this.settings.shortTermPredict) {
        let fromDate = getFirstEntryDate(this.settings);
        if (this.settings.fromDate) {
            if (fromDate.isBefore(this.settings.fromDate)) {
                fromDate = this.settings.fromDate;
            }
        }
        let currentDate = getLastEntryDate(this.settings);
        let shortTermPredictStart = currentDate.subtract(this.settings.shortTermPredict, 'days');

        if (shortTermPredictStart.isSameOrAfter(fromDate)) {
            shortTermPredict = calculatePredictData(this.settings, shortTermPredictStart);
        }
    }

    return {
        predict: predict && predict.date ? predict.date.format(DATE_FORMAT) : null,
        shortTermPredict: shortTermPredict && shortTermPredict.date ? shortTermPredict.date.format(DATE_FORMAT) : null
    };
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
 * and return the result as a string which can be assigned to the SRC attribute of an HTML IMG tag.
 * @deprecated use imageSource instead
 * @returns {String}
 */
CFD.prototype.image = function () {
    return this.imageSource();
}

/**
 * Draw the Cumulative Flow Diagram inside of the provided <code>settings.svg</code> DOM tree element 
 * and return the result as a string which can be assigned to the SRC attribute of an HTML IMG tag.
 * @returns {String}
 */
CFD.prototype.imageSource = function () {
    this.draw();
    let html = this.settings.svg.outerHTML;
    return 'data:image/svg+xml;base64,' + Base64.encode(html);
}

/**
 * Draw the Cumulative Flow Diagram inside of the provided <code>settings.svg</code> DOM tree element 
 * and return the result as a SVG tag string.
 * @returns {String}
 */
CFD.prototype.svgSource = function () {
    this.draw();
    return this.settings.svg.outerHTML;
}

module.exports = function (settings) {
    return new CFD(settings);
}