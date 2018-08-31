'use strict'

var CFD = require('./cfd');

//test the functions
test('species', () => {
    var cfd = new CFD();
    expect(cfd instanceof CFD)
        .toBeTruthy();
});

test('validate settings', () => {

    //no settings at all
    var cfd = new CFD();
    expect(() => cfd.draw()).toThrow(/No settings/);

    //empty settings
    var settings = {};
    cfd = new CFD(settings);
    
    //no exception expected for empty settings
    cfd.draw();
    
    expect(settings.width).toBe(600);
    expect(settings.height).toBe(400);
    expect(settings.innerWidth).toBe(600);
    expect(settings.innerHeight).toBe(400);
    expect(settings.margin.top).toBe(0);
    expect(settings.margin.right).toBe(0);
    expect(settings.margin.bottom).toBe(0);
    expect(settings.margin.left).toBe(0);  
});
