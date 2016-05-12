var assert = require('assert');
var config = require('../config/config.js');
var helpFunction = require('../lib/help.js');

var helpFunctionTest = function () {


    describe('Help Function', function () {
         //1 - get info list (no command) - user
        it('Info list (help)', function () {
            assert.equal('info list user', helpFunction(config.ownerSteamID64 ,'no command','user'));
        });
        //2 - get info list (no command) - admin
        it('Info list admin (help)', function () {
            assert.equal('info list admin', helpFunction(config.ownerSteamID64,'no command','admin'));
        });
        it('Query a known command (user)', function () {
            assert.equal('recognized command', helpFunction(config.ownerSteamID64,'@<user>','admin'));
        });
        //3 - query a known command -- failing because we don't pass add help info commands
        it('Query a known command (admin)', function () {
            assert.equal('recognized command', helpFunction(config.ownerSteamID64,'add user','admin'));
        });
        //4 - Query unknown command
        it('Query an unkonwn command', function () {
            assert.equal('unrecognized command', helpFunction(config.ownerSteamID64,'unrecognized command','admin'));
        });            
    });
    
}

module.exports = helpFunctionTest;