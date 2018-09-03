'use strict'

var CFD = require('./cfd');
var moment = require('moment');


// helper functions
function makeTestData() {
    var testData = [];
    var now = moment();
    testData.columns = ['new', 'dev', 'test', 'done'];
    testData.todo = ['new'];
    testData.progress = ['dev', 'test'];
    testData.done = ['done'];
    testData.push({
            date: moment(now).subtract(7, 'days'),
            new: 1,
            dev: 0,
            test: 0,
            done: 0
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


    settings.data = [];

    cfd.draw();

    //now the defaults must be set
    expect(settings.width)
        .toBe(600);
    expect(settings.height)
        .toBe(400);
    expect(settings.innerWidth)
        .toBe(600);
    expect(settings.innerHeight)
        .toBe(400);
    expect(settings.margin.top)
        .toBe(0);
    expect(settings.margin.right)
        .toBe(0);
    expect(settings.margin.bottom)
        .toBe(0);
    expect(settings.margin.left)
        .toBe(0);
});