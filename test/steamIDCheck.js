var assert = require('assert');
var config = require('../config/config.js');
var steamIDCheck = require('../lib/steamIDCheck.js');

var steamIDCheckTest = function () {

    describe('Steam ID Validity Check', function () {
        describe('Valid IDs', function () {    
            //32-bit 
            it('Pass back valid 32-bit ID', function () {
                assert.equal(config.ownerSteamID32, steamIDCheck(config.ownerSteamID32));;
            });
            //64-bit 
            it('Pass back valid 64-bit ID', function () {
                assert.equal(config.ownerSteamID64, steamIDCheck(config.ownerSteamID64));;
            });
        });

        describe('Invalid IDs', function () {
            it('Not an ID', function () {
                assert.equal('invalid ID', steamIDCheck('not an ID'));
            });
            it('Universe above 1 (STEAM_X:Y:XXXXXXX)', function () {
                assert.equal('invalid ID', steamIDCheck('STEAM_0:2:27384306'));
            });
            it('Fail if STEAM_ is passed with no value (STEAM_)', function () {
                assert.equal('invalid ID', steamIDCheck('STEAM_'));
            });
            it('Fail if first value is NaN (STEAM_Y:X:XXXXXXXX)', function () {
                assert.equal('invalid ID', steamIDCheck('STEAM_X:1:27384306'));
            });
            it('Fail if second value is NaN', function () {
                assert.equal('invalid ID', steamIDCheck('STEAM_0:X:27384306'));
            });
            it('Fail if third value is NaN', function () {
                assert.equal('invalid ID', steamIDCheck('STEAM_0:0:XXXXXXXX'));
            });
            it('Fail if no first value', function () {
                assert.equal('invalid ID', steamIDCheck('STEAM_:0:27384306'));
            });
            it('Fail if no second value', function () {
                assert.equal('invalid ID', steamIDCheck('STEAM_0:27384306'));
            });
            it('Fail if no third value', function () {
                assert.equal('invalid ID', steamIDCheck('STEAM_0:0:'));
            }); 
        });
    });
}

module.exports = steamIDCheckTest;