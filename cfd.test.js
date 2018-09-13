'use strict'

var fs = require('fs');
var jsdom = require('jsdom');
var {
    JSDOM
} = jsdom;
var cfd = require('cumulative-flow');
var moment = require('moment');
var settings = makeTestSettings();


// helper functions
function makeTestSettings() {
    settings = {};
    settings.data = makeTestData();
    settings.svg = JSDOM.fragment('<svg></svg>').firstChild;
    settings.predict = settings.data.entries[0].date;
    settings.markers = [{
        date: settings.data.entries[1].date
    }, {
        date: settings.data.entries[3].date
    }, {
        date: settings.data.entries[5].date
    }]
    var now = moment();
    settings.title = 'Testing the cfd'
    settings.fromDate = moment(now).subtract(8, 'days');
    settings.toDate = moment(now).add(3, 'days');
    return settings;
}

function makeTestData() {
    var testData = {};
    var now = moment();
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


function writeTestFile(path, content) {
    fs.writeFile(path, content);
}

//test the functions

beforeEach(() => {
    settings = makeTestSettings();
});

test('validate settings', () => {

    //no settings at all
    var diagram = cfd();
    expect(() => diagram.draw())
        .toThrow(/No settings/);

    //empty settings
    var settings = {};
    diagram = cfd(settings);

    expect(() => {
        diagram.draw()
    }).toThrow(/No svg/);

    settings.svg = JSDOM.fragment('<div></div>').firstChild;

    expect(() => {
        diagram.draw()
    }).toThrow(/No svg/);
});

test('margins', () => {
    var diagram = cfd(settings);
    diagram.draw();
    expect(settings.width)
        .toBe(800);
    expect(settings.height)
        .toBe(400);
    expect(settings.innerWidth)
        .toBe(800 - settings.margin.left - settings.margin.right);
    expect(settings.innerHeight)
        .toBe(400 - settings.margin.top - settings.margin.bottom);
    expect(settings.margin.top)
        .toBe(75);
    expect(settings.margin.right)
        .toBe(210);
    expect(settings.margin.bottom)
        .toBe(30);
    expect(settings.margin.left)
        .toBe(40);
});

test('validate style', () => {
    var diagram = cfd(settings);
    diagram.draw();
    var color = '#222';
    var background = '#fff';
    var toDo = '#bec0c2';
    var progress = '#808285';
    var done = '#222';
    expect(settings.style.fontSize).toBe(12);
    expect(settings.style.fontFamily).toBe('sans-serif');
    expect(settings.style.color).toBe(color);
    expect(settings.style.backgroundColor).toBe(background);
    expect(settings.style.axis.color).toBe(color);
    expect(settings.style.toDo.fill).toBe(toDo);
    expect(settings.style.toDo.color).toBe(toDo);
    expect(settings.style.toDo.stroke).toBe(background);
    expect(settings.style.progress.fill).toBe(progress);
    expect(settings.style.progress.color).toBe(progress);
    expect(settings.style.progress.stroke).toBe(background);
    expect(settings.style.done.fill).toBe(done);
    expect(settings.style.done.color).toBe(done);
    expect(settings.style.done.stroke).toBe(background);
    expect(settings.style.legend.color).toBe(color);
    expect(settings.style.predict.backgroundColor).toBe(background);
    expect(settings.style.predict.color).toBe(color);
    expect(settings.style.marker.backgroundColor).toBe(background);
    expect(settings.style.marker.color).toBe(color);

    color = 'red';
    background = 'lightgray';
    diagram.settings.style = {
        fontSize: 16,
        fontFamily: 'serif',
        color: color,
        backgroundColor: background,        
    };
    
    diagram.draw();
    expect(settings.style.fontSize).toBe(16);
    expect(settings.style.fontFamily).toBe('serif');
    expect(settings.style.color).toBe(color);
    expect(settings.style.backgroundColor).toBe(background);
    expect(settings.style.axis.color).toBe(color);
    expect(settings.style.toDo.fill).toBe(toDo);
    expect(settings.style.toDo.color).toBe(toDo);
    expect(settings.style.toDo.stroke).toBe(background);
    expect(settings.style.progress.fill).toBe(progress);
    expect(settings.style.progress.color).toBe(progress);
    expect(settings.style.progress.stroke).toBe(background);
    expect(settings.style.done.fill).toBe(done);
    expect(settings.style.done.color).toBe(done);
    expect(settings.style.done.stroke).toBe(background);
    expect(settings.style.legend.color).toBe(color);
    expect(settings.style.predict.backgroundColor).toBe(background);
    expect(settings.style.predict.color).toBe(color);
    expect(settings.style.marker.backgroundColor).toBe(background);
    expect(settings.style.marker.color).toBe(color);

    //TODO test more styles

});


test('validate data', () => {
    delete settings.data;

    var diagram = cfd(settings);    

    expect(() => {
        diagram.draw()
    }).toThrow(/No data/);

    settings.data = {
        entries: []
    }
    expect(() => {
        diagram.draw()
    }).toThrow(/Empty data entries/);

    settings.data.entries = {}
    expect(() => {
        diagram.draw()
    }).toThrow(/Data entries not an array/);
});

test('image', () => {
    var diagram = cfd(settings);
    var svg = diagram.image();
    var testFileContent = '<!DOCTYPE html>\n<meta charset="utf-8">\n<img src="' + svg + '"/>';
    writeTestFile('./cfd.html', testFileContent);

    expect(typeof svg).toBe('string');
    expect(svg.length).toBeGreaterThan(1000);

    //TODO use static testdata and compare the result string with the expected string.
    
});