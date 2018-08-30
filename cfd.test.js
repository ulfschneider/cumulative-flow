var CFD = require('./cfd');

//test the functions
test('species', () => {
    var cfd = new CFD();
    expect(cfd instanceof CFD)
        .toBeTruthy();
});