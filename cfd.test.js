var CFD = require('./cfd');

//test the functions
test('species', () => {
    var cfd = new CFD();
    expect(cfd instanceof CFD)
        .toBeTruthy();
});

test('validate settings', () => {
    var cfd = new CFD();

    function noSettings() {
        cfd.validateSettings();
    }
    expect(noSettings).toThrow(/Empty settings/);

    function emptySettings() {
        cfd.validateSettings({});
    }
    expect(emptySettings).toThrow(/No id defined/);
});