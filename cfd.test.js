'use strict'

var fs = require('fs');

var CFD = require('./cfd');
var moment = require('moment');
var data = makeTestData();

// helper functions
function makeTestData() {
    var testData = [];
    var now = moment();
    testData.toDo = ['new'];
    testData.progress = ['test', 'dev'];
    testData.done = ['done'];
    testData.push({
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
test('species', () => {
    var cfd = new CFD();
    expect(cfd instanceof CFD)
        .toBeTruthy();
});

test('validate settings', () => {

    //no settings at all
    var cfd = new CFD();
    expect(() => cfd.draw())
        .toThrow(/No settings/);

    //empty settings
    var settings = {};
    cfd = new CFD(settings);
    expect(() => {
        cfd.draw()
    }).toThrow(/No data/);

    settings.data = [];
    expect(() => {
        cfd.draw()
    }).toThrow(/Empty data/);

    settings.data = {}
    expect(() => {
        cfd.draw()
    }).toThrow(/Data is not an array/);


    settings.data = data;
    settings.markers = [{
        date: settings.data[1].date
    }, {
        date: settings.data[3].date
    }, {
        date: settings.data[5].date
    }]
    var now = moment();
    settings.title = 'Testing the CFD'
    settings.fromDate = moment(now).subtract(3, 'days');
    settings.toDate = moment(now).add(1, 'days');
    var domTree = cfd.draw();
    var testFileContent = '<!DOCTYPE html>\n<meta charset="utf-8">\n' + domTree.outerHTML;
    writeTestFile('./cfd.html', testFileContent);

    //now the defaults must be set
    expect(settings.width)
        .toBe(cfd.defaultWidth);
    expect(settings.height)
        .toBe(cfd.defaultHeight);
    expect(settings.innerWidth)
        .toBe(cfd.defaultWidth - settings.margin.left - settings.margin.right);
    expect(settings.innerHeight)
        .toBe(cfd.defaultHeight - settings.margin.top - settings.margin.bottom);
    expect(settings.margin.top)
        .toBe(75);
    expect(settings.margin.right)
        .toBe(210);
    expect(settings.margin.bottom)
        .toBe(30);
    expect(settings.margin.left)
        .toBe(80);
});