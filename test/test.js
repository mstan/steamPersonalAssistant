var assert = require('assert');
var config = require('../config/config.js');

// ============================
var messageParser = require('../lib/messageParser.js');

describe('Message Parser', function () {
    describe('Message Parser Tests', function () {

        // standard cases
        describe('Normal Cases', function () {
            //1 - set status
            it('set status: online', function () {
                assert.deepEqual(['set status', 'online'], messageParser('set status: online'));
            });
            //2 - set name
            it('set name: username', function () {
                assert.deepEqual(['set name', 'username'], messageParser('set name: username'));
            });
            //3 - play game
            it('play game: The Game', function () {
                assert.deepEqual(['play game', 'The Game'], messageParser('play game: The Game'));
            });
        });

        // special cases
        describe('Special cases', function () {

            //invalid input check
            it('Invalid input check', function () {
                assert.deepEqual(['invalid input', 'no command'], messageParser('invalid input'));
            });
            //lowercase command check
            it('Lowercase command check (SET STATUS: online)', function () {
                assert.deepEqual(['set status', 'online'], messageParser('SET STATUS: online'));
            });
            //recognized command with no colon or data
            it('Handle no colon in command (set status)', function () {
                assert.deepEqual(['set status', 'no command'], messageParser('set status'));
            });
        });
    });
});
// ============================
var helpFunction = require('../lib/help.js');

describe('Help Function', function () {
    // standard cases
    describe('Normal Cases', function () {
        //1 - get info list (no command) - user
        it('Pass back info list user (help)', function () {
            assert.equal('info list user', helpFunction(config.ownerSteamID64 ,'no command','user'));
        });
        //2 - get info list (no command) - admin
        it('Pass back info list admin (help)', function () {
            assert.equal('info list admin', helpFunction(config.ownerSteamID64,'no command','admin'));
        });
        it('Success if we query a known command (user)', function () {
            assert.equal('recognized command', helpFunction(config.ownerSteamID64,'@<user>','admin'));
        });
        //3 - query a known command -- failing because we don't pass add help info commands
        it('Success if we query a known command (admin)', function () {
            assert.equal('recognized command', helpFunction(config.ownerSteamID64,'add user','admin'));
        });
        //4 - Query unknown command
        it('Fail if query an unkonwn command', function () {
            assert.equal('unrecognized command', helpFunction(config.ownerSteamID64,'unrecognized command','admin'));
        });            
    });

    // special cases
    describe('Special cases', function () {
        //1 - get info list (no command) - user
        it('Lowercase a help parameter', function () {
            assert.equal('recognized command', helpFunction(config.ownerSteamID64,'@<USER>','admin'));
        });          
    });

});
// ============================
var steamIDCheck = require('../lib/steamIDCheck.js');


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

    describe('Invalid IDS', function () {
        it('Fail when isn\'t an ID at all', function () {
            assert.equal('invalid ID', steamIDCheck('not an ID'));
        });
        it('Fail if ID check of universe value is above 1', function () {
            assert.equal('invalid ID', steamIDCheck('STEAM_0:2:27384306'));
        });
        it('Fail if STEAM_ is passed with no value', function () {
            assert.equal('invalid ID', steamIDCheck('STEAM_'));
        });
        it('Fail if first value is NaN', function () {
            assert.equal('invalid ID', steamIDCheck('STEAM_X:1:27384306'));
        });
        it('Fail if second value is NaN', function () {
            assert.equal('invalid ID', steamIDCheck('STEAM_0:X:27384306'));
        });
        it('Fail if third value is NaN', function () {
            assert.equal('invalid ID', steamIDCheck('STEAM_0:0:XXXXXXXX'));
        });
        it('Fail if not first value', function () {
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