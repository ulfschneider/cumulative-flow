'use babel'

const fs = require('fs');
const cfd = require('cumulative-flow');
const moment = require('moment');
const NOW = '2018-09-11T12:00:00';
const NUMBER_OF_TEST_IMAGES = 13;
let actuals = [];
let expected = [];
let settings;

// helper functions
function makeTestSettings() {
    settings = {};
    settings.data = makeTestData();
    settings.svg = document.createElement('svg');
    settings.predict = settings.data.entries[0].date;
    let now = moment(NOW);
    settings.title = 'Testing the cfd'
    settings.fromDate = moment(now).subtract(8, 'days');
    settings.toDate = moment(now).add(3, 'days');

    settings.markers = [{
        date: settings.data.entries[1].date
    }, {
        date: settings.data.entries[3].date
    }, {
        date: settings.data.entries[5].date
    }, {
        date: settings.toDate
    }]
    return settings;
}

function makeTestData() {
    let testData = {};
    let now = moment(NOW);
    testData.toDo = ['new'];
    testData.progress = ['test', 'dev'];
    testData.done = ['done'];
    testData.unit = 'points';
    testData.entries = [];
    testData.entries.push({
        date: moment(now).subtract(8, 'days'),
        new: 0,
        dev: 0,
        test: 0,
        done: 0,
    }, {
            date: moment(now).subtract(7, 'days'),
            new: 1,
            dev: 0,
            test: 0,
            done: 0,
        }, {
            date: moment(now).subtract(6, 'days'),
            new: 1,
            dev: 1,
            test: 0,
            done: 0
        }, {
            date: moment(now).subtract(5, 'days'),
            new: 1,
            dev: 0,
            test: 1,
            done: 1
        }, {
            date: moment(now).subtract(4, 'days'),
            new: 2,
            dev: 1,
            test: 0,
            done: 2
        }, {
            date: moment(now).subtract(3, 'days'),
            new: 1,
            dev: 1,
            test: 2,
            done: 2
        }, {
            date: moment(now).subtract(2, 'days'),
            new: 0,
            dev: 0,
            test: 1,
            done: 5
        }, {
            date: moment(now).subtract(1, 'days'),
            new: 1,
            dev: 1,
            test: 0,
            done: 5
        }

    );
    return testData;
}

function makeArrayOfArraysTestData() {
    let testData = {};
    let now = moment(NOW);
    testData.toDo = ['new'];
    testData.progress = ['test', 'dev'];
    testData.done = ['done'];
    testData.unit = 'points';
    testData.entries = [];
    testData.entries.push([
        moment(now).subtract(8, 'days'), 0, 0, 0, 0,],
        [moment(now).subtract(7, 'days'), 0, 0, 0, 1],
        [moment(now).subtract(6, 'days'), 0, 0, 1, 1],
        [moment(now).subtract(5, 'days'), 1, 1, 0, 1],
        [moment(now).subtract(4, 'days'), 2, 0, 1, 2],
        [moment(now).subtract(3, 'days'), 2, 2, 1, 1],
        [moment(now).subtract(2, 'days'), 5, 1, 0, 0],
        [moment(now).subtract(1, 'days'), 5, 0, 1, 1
        ]

    );
    return testData;
}


function writeTestFile(path, content) {
    fs.writeFile(path, content);
}

function readTestFile(path) {
    return fs.readFileSync(path).toString();
}

function readExpectedFiles(folder, count) {
    let expected = [];
    for (let i = 0; i < count; i++) {
        expected.push(readTestFile(folder + '/expect' + i + '.svg'));
    }
    return expected;
}

//test the functions

beforeAll(() => {
    expected = readExpectedFiles('./test', NUMBER_OF_TEST_IMAGES);
});

test('no settings at all', () => {

    //no settings at all
    let diagram = cfd();
    expect(() => diagram.draw())
        .toThrow(/No settings/);
});

test('empty settings', () => {
    let settings = {};
    diagram = cfd(settings);

    expect(() => {
        diagram.draw()
    }).toThrow(/No svg/);
});

test('no svg tag', () => {
    let settings = {};
    settings.svg = document.createElement('div');

    expect(() => {
        diagram.draw()
    }).toThrow(/No svg/);
});


test('default width and default height', () => {
    let settings = makeTestSettings();
    delete settings.width;
    delete settings.height;
    let diagram = cfd(settings);
    diagram.draw();
    expect(settings.width)
        .toBe(800);
    expect(settings.height)
        .toBe(400);
});

test('default margins', () => {
    let settings = makeTestSettings();
    settings.margin = {};
    settings.width = 800;
    settings.height = 400;
    let diagram = cfd(settings);
    diagram.draw();
    expect(settings.margin.top)
        .toBe(75);
    expect(settings.margin.right)
        .toBe(210);
    expect(settings.margin.bottom)
        .toBe(30);
    expect(settings.margin.left)
        .toBe(40);
});

test('inner width and inner height', () => {
    let settings = makeTestSettings();
    settings.margin = {};
    let diagram = cfd(settings);
    diagram.draw();
    expect(settings.innerWidth)
        .toBe(800 - settings.margin.left - settings.margin.right);
    expect(settings.innerHeight)
        .toBe(400 - settings.margin.top - settings.margin.bottom);
});

test('set top margin', () => {
    let settings = makeTestSettings();
    let diagram = cfd(settings);
    settings.margin = { top: 50 };
    diagram.draw();
    expect(settings.margin.top)
        .toBe(50);
    expect(settings.margin.right)
        .toBe(210);
    expect(settings.margin.bottom)
        .toBe(30);
    expect(settings.margin.left)
        .toBe(40);
    expect(settings.innerWidth)
        .toBe(800 - settings.margin.left - settings.margin.right);
    expect(settings.innerHeight)
        .toBe(400 - settings.margin.top - settings.margin.bottom);
});

test('set right margin', () => {
    let settings = makeTestSettings();
    let diagram = cfd(settings);
    settings.margin = { right: 50 };
    diagram.draw();
    expect(settings.margin.top)
        .toBe(75);
    expect(settings.margin.right)
        .toBe(50);
    expect(settings.margin.bottom)
        .toBe(30);
    expect(settings.margin.left)
        .toBe(40);
    expect(settings.innerWidth)
        .toBe(800 - settings.margin.left - settings.margin.right);
    expect(settings.innerHeight)
        .toBe(400 - settings.margin.top - settings.margin.bottom);
});

test('set bottom margin', () => {
    let settings = makeTestSettings();
    let diagram = cfd(settings);
    settings.margin = { bottom: 50 };
    diagram.draw();
    expect(settings.margin.top)
        .toBe(75);
    expect(settings.margin.right)
        .toBe(210);
    expect(settings.margin.bottom)
        .toBe(50);
    expect(settings.margin.left)
        .toBe(40);
    expect(settings.innerWidth)
        .toBe(800 - settings.margin.left - settings.margin.right);
    expect(settings.innerHeight)
        .toBe(400 - settings.margin.top - settings.margin.bottom);
});

test('set left margin', () => {
    let settings = makeTestSettings();
    let diagram = cfd(settings);
    settings.margin = { left: 50 };
    diagram.draw();
    expect(settings.margin.top)
        .toBe(75);
    expect(settings.margin.right)
        .toBe(210);
    expect(settings.margin.bottom)
        .toBe(30);
    expect(settings.margin.left)
        .toBe(50);
    expect(settings.innerWidth)
        .toBe(800 - settings.margin.left - settings.margin.right);
    expect(settings.innerHeight)
        .toBe(400 - settings.margin.top - settings.margin.bottom);
});

test('set left and top margin to 0', () => {
    let settings = makeTestSettings();
    let diagram = cfd(settings);
    settings.margin = { left: 0, top: 0 };
    diagram.draw();
    expect(settings.margin.top)
        .toBe(0);
    expect(settings.margin.right)
        .toBe(210);
    expect(settings.margin.bottom)
        .toBe(30);
    expect(settings.margin.left)
        .toBe(0);
    expect(settings.innerWidth)
        .toBe(800 - settings.margin.left - settings.margin.right);
    expect(settings.innerHeight)
        .toBe(400 - settings.margin.top - settings.margin.bottom);
});


test('no draw options', () => {
    let settings = makeTestSettings();
    delete settings.drawOptions;
    let diagram = cfd(settings);
    diagram.draw();
    expect(settings.drawOptions).toEqual(['title', 'axis', 'legend', 'markers', 'predict', 'focus']);
});


test('empty draw options', () => {
    let settings = makeTestSettings();
    settings.drawOptions = [];
    let diagram = cfd(settings);
    diagram.draw();
    expect(settings.drawOptions).toEqual([]);
});

test('title draw options', () => {
    let settings = makeTestSettings();
    settings.drawOptions = ['title'];
    let diagram = cfd(settings);
    diagram.draw();
    expect(settings.drawOptions).toEqual(['title']);
});

test('axis draw options', () => {
    let settings = makeTestSettings();
    settings.drawOptions = ['axis'];
    let diagram = cfd(settings);
    diagram.draw();
    expect(settings.drawOptions).toEqual(['axis']);
});

test('legend draw options', () => {
    let settings = makeTestSettings();
    settings.drawOptions = ['legend'];
    let diagram = cfd(settings);
    diagram.draw();
    expect(settings.drawOptions).toEqual(['legend']);
});

test('markers draw options', () => {
    let settings = makeTestSettings();
    settings.drawOptions = ['markers'];
    let diagram = cfd(settings);
    diagram.draw();
    expect(settings.drawOptions).toEqual(['markers']);
});

test('predict draw options', () => {
    let settings = makeTestSettings();
    settings.drawOptions = ['predict'];
    let diagram = cfd(settings);
    diagram.draw();
    expect(settings.drawOptions).toEqual(['predict']);
});

test('default style', () => {
    let settings = makeTestSettings();
    let diagram = cfd(settings);

    let color = '#222';
    let background = '#fff';
    let toDo = '#ccc';
    let progress = '#888';
    let done = '#555';
    diagram.draw();
    expect(settings.style.fontSize).toBe(12);
    expect(settings.style.fontFamily).toBe('sans-serif');
    expect(settings.style.color).toBe(color);
    expect(settings.style.backgroundColor).toBe(background);
    expect(settings.style.axis.color).toBe(color);
    expect(settings.style.toDo.color).toBe(toDo);
    expect(settings.style.toDo.stroke).toBe(background);
    expect(settings.style.progress.color).toBe(progress);
    expect(settings.style.progress.stroke).toBe(background);
    expect(settings.style.done.color).toBe(done);
    expect(settings.style.done.stroke).toBe(background);
    expect(settings.style.predict.backgroundColor).toBe(background);
    expect(settings.style.predict.color).toBe(color);
    expect(settings.style.shortTermPredict.color).toBe(settings.style.predict.color);
    expect(settings.style.shortTermPredict.backgroundColor).toBe(settings.style.predict.backgroundColor);
    expect(settings.style.markers.backgroundColor).toBe(background);
    expect(settings.style.markers.color).toBe(color);
});

test('fontSize, fontFamily, default color and default background', () => {
    let settings = makeTestSettings();
    let diagram = cfd(settings);

    let color = 'red';
    let background = 'lightgray';
    let toDo = '#ccc';
    let progress = '#888';
    let done = '#555';

    diagram.settings.style = {
        fontFamily: 'serif',
        color: color,
        backgroundColor: background,
    };

    diagram.draw();
    expect(settings.style.fontSize).toBe(12);
    expect(settings.style.fontFamily).toBe('serif');
    expect(settings.style.color).toBe(color);
    expect(settings.style.backgroundColor).toBe(background);
    expect(settings.style.axis.color).toBe(color);
    expect(settings.style.toDo.color).toBe(toDo);
    expect(settings.style.toDo.stroke).toBe(background);
    expect(settings.style.progress.color).toBe(progress);
    expect(settings.style.progress.stroke).toBe(background);
    expect(settings.style.done.color).toBe(done);
    expect(settings.style.done.stroke).toBe(background);
    expect(settings.style.predict.backgroundColor).toBe(background);
    expect(settings.style.predict.color).toBe(color);
    expect(settings.style.predict.goodColor).toBe(color);
    expect(settings.style.predict.troubleColor).toBe(color);
    expect(settings.style.shortTermPredict.backgroundColor).toBe(background);
    expect(settings.style.shortTermPredict.color).toBe(color);
    expect(settings.style.shortTermPredict.goodColor).toBe(color);
    expect(settings.style.shortTermPredict.troubleColor).toBe(color);
    expect(settings.style.markers.backgroundColor).toBe(background);
    expect(settings.style.markers.color).toBe(color);
});

test('colors toDo, progress, done, axis, default color and background', () => {
    let color = '#333';
    let background = '#eee';
    let toDo = '#aaa';
    let progress = '#bbb';
    let done = '#ccc';
    let axis = 'green';
    let settings = makeTestSettings();
    let diagram = cfd(settings);

    settings.style = {
        color: color,
        backgroundColor: background
    };
    settings.style.toDo = {
        color: toDo
    };
    settings.style.progress = {
        color: progress
    };
    settings.style.done = {
        color: done
    };
    settings.style.predict = {
        color: progress
    };
    settings.style.markers = {
        color: toDo
    }
    settings.style.axis = {
        color: axis
    };
    diagram.draw();
    expect(settings.style.fontSize).toBe(12);
    expect(settings.style.fontFamily).toBe('sans-serif');
    expect(settings.style.color).toBe(color);
    expect(settings.style.backgroundColor).toBe(background);
    expect(settings.style.axis.color).toBe(axis);
    expect(settings.style.toDo.color).toBe(toDo);
    expect(settings.style.toDo.stroke).toBe(background);
    expect(settings.style.progress.color).toBe(progress);
    expect(settings.style.progress.stroke).toBe(background);
    expect(settings.style.done.color).toBe(done);
    expect(settings.style.done.stroke).toBe(background);
    expect(settings.style.predict.backgroundColor).toBe(background);
    expect(settings.style.predict.color).toBe(progress);
    expect(settings.style.markers.backgroundColor).toBe(background);
    expect(settings.style.markers.color).toBe(toDo);
});

test('stroke colors, empty axis color', () => {
    let settings = makeTestSettings();
    let diagram = cfd(settings);
    let color = '#222';
    let background = '#fff';
    let toDo = '#ccc';
    let progress = '#888';
    let done = '#555';

    settings.style = {};
    settings.style.toDo = {
        stroke: toDo
    };
    settings.style.progress = {
        stroke: progress
    };
    settings.style.done = {
        stroke: done
    };
    settings.style.predict = {
        backgroundColor: color
    };
    settings.style.markers = {
        backgroundColor: color
    };
    settings.style.axis = {};

    diagram.draw();
    expect(settings.style.fontSize).toBe(12);
    expect(settings.style.fontFamily).toBe('sans-serif');
    expect(settings.style.color).toBe(color);
    expect(settings.style.backgroundColor).toBe(background);
    expect(settings.style.axis.color).toBe(color);
    expect(settings.style.toDo.color).toBe(toDo);
    expect(settings.style.toDo.stroke).toBe(toDo);
    expect(settings.style.progress.color).toBe(progress);
    expect(settings.style.progress.stroke).toBe(progress);
    expect(settings.style.done.color).toBe(done);
    expect(settings.style.done.stroke).toBe(done);
    expect(settings.style.predict.backgroundColor).toBe(color);
    expect(settings.style.predict.color).toBe(color);
    expect(settings.style.predict.goodColor).toBe(color);
    expect(settings.style.predict.troubleColor).toBe(color);
    expect(settings.style.shortTermPredict.backgroundColor).toBe(color);
    expect(settings.style.shortTermPredict.color).toBe(color);
    expect(settings.style.shortTermPredict.goodColor).toBe(color);
    expect(settings.style.shortTermPredict.troubleColor).toBe(color);
    expect(settings.style.markers.backgroundColor).toBe(color);
    expect(settings.style.markers.color).toBe(color);
});

test('no data', () => {
    let settings = makeTestSettings();
    let diagram = cfd(settings);
    delete settings.data;
    expect(() => {
        diagram.draw()
    }).toThrow(/No data/);
});

test('no data entries', () => {
    let settings = makeTestSettings();
    delete settings.data.entries;
    let diagram = cfd(settings);
    expect(() => {
        diagram.draw()
    }).toThrow(/No data entries/);
});

test('empty data entries', () => {
    let settings = makeTestSettings();
    let diagram = cfd(settings);
    settings.data = {
        entries: []
    }
    expect(() => {
        diagram.draw()
    }).toThrow(/Empty data entries/);
});

test('data entries not an array', () => {
    let settings = makeTestSettings();
    let diagram = cfd(settings);
    settings.data.entries = {}
    expect(() => {
        diagram.draw()
    }).toThrow(/Data entries not an array/);
});

test('no toDo status defined', () => {
    let settings = makeTestSettings();
    let diagram = cfd(settings);
    delete settings.data.toDo;
    expect(() => {
        diagram.draw();
    }).toThrow(/No toDo status defined/);
});

test('no progress status defined', () => {
    let settings = makeTestSettings();
    let diagram = cfd(settings);
    delete settings.data.progress;
    expect(() => {
        diagram.draw();
    }).toThrow(/No progress status defined/);
});

test('no done status defined', () => {
    let settings = makeTestSettings();
    let diagram = cfd(settings);
    delete settings.data.done;
    expect(() => {
        diagram.draw();
    }).toThrow(/No done status defined/);
});

test('image 0 with default test data', () => {
    let settings = makeTestSettings();
    settings.title = 'Testing CFD';
    let diagram = cfd(settings);
    let actual = diagram.svgSource();
    actuals.push(actual);

    expect(actuals[0]).toBe(expected[0]);
});

test('ISO 6801 date strings', () => {
    let settings = makeTestSettings();
    settings.title = 'Testing CFD';
    settings.fromDate = moment(settings.fromDate).format('YYYY-MM-DD');
    settings.toDate = moment(settings.toDate).format('YYYY-MM-DD');
    settings.predict = moment(settings.predict).format('YYYY-MM-DD');
    settings.markers.forEach(marker => {
        marker.date = moment(marker.date).format('YYYY-MM-DD');
    });
    settings.data.entries.forEach(d => {
        d.date = moment(d.date).format('YYYY-MM-DD');
    });
    let diagram = cfd(settings);
    let actual = diagram.svgSource();
    expect(actual).toBe(expected[0]);
});

test('image 1 without fromDate and toDate', () => {
    let settings = makeTestSettings();
    delete settings.fromDate
    delete settings.toDate;
    settings.style = {
        toDo: {
            color: 'cornflowerblue'
        },
        progress: {
            color: 'firebrick'
        },
        done: {
            color: 'purple'
        }
    }

    settings.title = 'Testing CFD without fromDate and without toDate';
    let diagram = cfd(settings);
    let actual = diagram.svgSource();
    actuals.push(actual);

    expect(actuals[1]).toBe(expected[1]);
});

test('image 2 with narrow fromDate and toDate', () => {
    let settings = makeTestSettings();
    settings.fromDate = moment(NOW).subtract(5, 'days');
    settings.toDate = moment(NOW).subtract(1, 'days');
    settings.title = 'Testing CFD with narrow fromDate and toDate';
    let diagram = cfd(settings);
    let actual = diagram.svgSource();
    actuals.push(actual);
    expect(actuals[2]).toBe(expected[2]);
});

test('image 3 with early predictStart', () => {
    let settings = makeTestSettings();
    delete settings.fromDate;
    delete settings.toDate;
    settings.predict = moment(NOW).subtract(10, 'days');
    settings.title = 'Testing CFD with predict start/end date out of range';
    let diagram = cfd(settings);
    let actual = diagram.svgSource();
    actuals.push(actual);
    expect(actuals[3]).toBe(expected[3]);
});

test('image 4 without markers', () => {
    let settings = makeTestSettings();
    delete settings.markers;
    delete settings.fromDate;
    delete settings.toDate;

    settings.shortTermPredict = 3;
    settings.style = {
        predict: {
            troubleColor: 'red',
            goodColor: 'green'
        },
        shortTermPredict: {
            troubleColor: 'orange',
            goodColor: 'cornflowerblue'
        }
    }
    settings.predict = moment(NOW).subtract(10, 'days');
    settings.title = 'Testing CFD without markers';
    let diagram = cfd(settings);
    let actual = diagram.svgSource();
    actuals.push(actual);
    expect(actuals[4]).toBe(expected[4]);
});

test('image 5 without title and with auto predict', () => {
    let settings = makeTestSettings();
    delete settings.title;
    delete settings.predict;
    delete settings.markers;
    delete settings.fromDate;
    delete settings.toDate;
    let diagram = cfd(settings);
    let actual = diagram.svgSource();
    actuals.push(actual);
    expect(actuals[5]).toBe(expected[5]);
});

test('image 6 without axis, markers and predict', () => {
    let settings = makeTestSettings();
    delete settings.title;
    delete settings.predict;
    delete settings.markers;
    delete settings.fromDate;
    delete settings.toDate;

    settings.title = 'Testing CFD without axis, markers and predict';
    settings.drawOptions = ['legend'];
    let diagram = cfd(settings);
    let actual = diagram.svgSource();
    actuals.push(actual);
    expect(actuals[6]).toBe(expected[6]);
});

test('image 7 with markers out of range', () => {
    let settings = makeTestSettings();
    settings.title = "Testing CFD with markers out of range";

    delete settings.predict;
    delete settings.markers;
    delete settings.fromDate;
    delete settings.toDate;
    delete settings.drawOptions;
    settings.predict = moment(NOW).add(20, 'days');
    delete settings.data.unit;
    settings.markers = [
        { date: moment(NOW).subtract(20, 'days'), label: 'm1' },
        { date: moment(NOW).subtract(2, 'days'), label: 'm2' },
        { date: moment(NOW).add(20, 'days'), label: 'm3' },
    ]
    let diagram = cfd(settings);
    let actual = diagram.svgSource();
    actuals.push(actual);
    expect(actuals[7]).toBe(expected[7]);
});

test('image 8 with markers out of range', () => {
    let settings = makeTestSettings();
    settings.toDate = moment(NOW);
    delete settings.predict;
    delete settings.markers;
    delete settings.fromDate;
    delete settings.drawOptions;
    delete settings.data.unit;
    settings.predict = moment(NOW).add(20, 'days');
    settings.title = "Testing CFD with markers out of range";

    settings.markers = [
        { date: moment(NOW).subtract(20, 'days'), label: 'm1' },
        { date: moment(NOW).subtract(2, 'days'), label: 'm2' },
        { date: moment(NOW).add(20, 'days'), label: 'm3' },
    ]
    let diagram = cfd(settings);
    let actual = diagram.svgSource();
    actuals.push(actual);
    expect(actuals[8]).toBe(expected[8]);
});

test('image 9 without predict line because of 0 velocity', () => {
    let settings = makeTestSettings();
    settings.toDate = moment(NOW);
    settings.title = "Testing CFD without predict line because of 0 velocity";
    for (entry of settings.data.entries) {
        entry.done = 3;
    }
    let diagram = cfd(settings);
    let actual = diagram.svgSource();
    actuals.push(actual);
    expect(actuals[9]).toBe(expected[9]);
});

test('image 10 with array of arrays default test data', () => {
    let settings = makeTestSettings();
    settings.data = makeArrayOfArraysTestData();
    settings.title = 'Testing CFD with array of arrays';
    let diagram = cfd(settings);
    let actual = diagram.svgSource();
    actuals.push(actual);

    expect(actuals[10]).toBe(expected[10]);
});

test('image 11 with pattern for progress', () => {
    let settings = makeTestSettings();
    settings.data = makeArrayOfArraysTestData();
    settings.shortTermPredict = 2;
    settings.title = 'Testing CFD pattern for progress';
    settings.style = {
        progress: {
            pattern: true
        },
        shortTermPredict: {
            goodColor: 'green',
            troubleColor: 'red'
        },
        predict: {
            goodColor: 'lime',
            troubleColor: 'firebrick'
        }
    }

    let diagram = cfd(settings);
    let predict = diagram.prediction();
    let now = moment(NOW);
    expect(predict.shortTermPredict).toBe(now.format('YYYY-MM-DD'));
    expect(predict.predict).toBe(now.add(1, 'days').format('YYYY-MM-DD'));

    let actual = diagram.svgSource();
    actuals.push(actual);
    expect(actuals[11]).toBe(expected[11]);

    now = moment(NOW);
    settings.shortTermPredict = 7;
    predict = diagram.prediction();
    expect(predict.predict).toBe(now.add(1, 'days').format('YYYY-MM-DD'));
    expect(predict.shortTermPredict).toBe(now.format('YYYY-MM-DD'));

    now = moment(NOW);
    settings.shortTermPredict = 8;
    predict = diagram.prediction();
    expect(predict.predict).toBe(now.add(1, 'days').format('YYYY-MM-DD'));
    expect(predict.shortTermPredict).toBe(null);

});

test('image 12 with reduced done count', () => {
    let settings = makeTestSettings();
    settings.data = makeTestData();
    settings.data.entries[settings.data.entries.length -1].new = 0;
    settings.data.entries[settings.data.entries.length -1].dev = 0;
    settings.data.entries[settings.data.entries.length -1].done = 2;

    settings.shortTermPredict = 2;
    settings.title = 'Testing CFD with reduced done count';

    let diagram = cfd(settings);
    let actual = diagram.svgSource();
    actuals.push(actual);
    expect(actuals[11]).toBe(expected[11]);
});




test('remove image', () => {
    let settings = makeTestSettings();
    settings.title = 'Testing CFD';
    let diagram = cfd(settings);
    expect(diagram.svgSource()).toBe(expected[0]);
    diagram.remove();
    expect(settings.svg.outerHTML).toBe('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400"></svg>');
});




test('write test results into file', () => {
    let testFileContent = '<!DOCTYPE html>\n<meta charset="utf-8">\n'
        + '<body><style>* {font-family:sans-serif;}\n'
        + '.image-set {border-bottom: 1px solid black; padding:2em 0;}\n'
        + '.label {text-transform:uppercase; color:white; background:gray; margin:0 1em;}\n'
        + '.label.mismatch {color:white; background:red;}\n'
        + '.label.expected {color:white; background:green;}\n'
        + '.box {display:inline-block;}</style>'
        + '<h1>Expected Test Results with Actual Values</h1>';

    for (let i = 0; i < actuals.length; i++) {
        writeTestFile('./test/actual' + i + '.svg', actuals[i]);
        let match = expected[i] == actuals[i];
        if (match) {
            testFileContent += '<div class="image-set"><div class="box"><div class="label">Expected ' + i + '</div>' + expected[i] + '</div>'
                + '<div class="box"><div class="label expected">Actual ' + i + ' is as expected</div>' + actuals[i] + '</div></div>';
        } else {
            testFileContent += '<div class="image-set"><div class="box"><div class="label">Expected ' + i + '</div>' + expected[i] + '</div>'
                + '<div class="box"><div class="label mismatch">Actual ' + i + ' has a mismatch</div>' + actuals[i] + '</div></div>';

        }
    }
    testFileContent += '</body';
    writeTestFile('./test/cfd.html', testFileContent);

    //have a look at ./text/cfd.html to view the result
});




