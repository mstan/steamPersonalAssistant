var assert = require('assert'),
    config = require('../config/config.js');

var SteamUser = require('steam-user'),
    loginUser = require('./loginUser.js'),
    client = loginUser.client;

var userPanel = require('../lib/userPanel.js');

var userPanelTest = function() {

    describe('User Panel', function () {
        /*
        describe('Help', function () {
            //Failing beacause of another internal dependency called
            it('Get help list (no input)', function () {
                assert.equal('help requested', userPanel.run(SteamUser, config.ownerSteamID64, 'help: '));
            });
            it('Valid input', function () {
                assert.equal('help requested', userPanel.run(SteamUser, config.ownerSteamID64, 'help: send message'));
            });
            it('Invalid', function () {
                assert.equal('help requested', userPanel.run(SteamUser, config.ownerSteamID64, 'help: bad command'));
            });
        });
        */

        describe('Get ID', function () {
            it('32-bit', function () {
                assert.equal('info requested', userPanel.run(SteamUser, config.ownerSteamID64, 'get id: ' + config.ownerSteamID32));
            });
            it('64-bit', function () {
                assert.equal('info requested', userPanel.run(SteamUser, config.ownerSteamID64, 'get id: ' + config.ownerSteamID64));
            });

            it('Invalid ID', function () {
                assert.equal('info requested', userPanel.run(SteamUser, config.ownerSteamID64, 'get id: invalid'));
            });
        });
    });

    describe('Message Registered User', function () {
        it('Message Sent', function () {
            assert.equal('message sent', userPanel.messageRegisteredUser(config.ownerSteamID64, '@Gamemaster: Hello!'));
        });
        it('user not found', function () {
            assert.equal('user not found', userPanel.messageRegisteredUser(config.ownerSteamID64, '@UnregisteredUser: Hello!'));
        });
        it('no message', function () {
            assert.equal('no message', userPanel.messageRegisteredUser(config.ownerSteamID64, '@Gamemaster: '));
        })
    });

    describe('Info Request (!)', function () {
        it('Valid key', function () {
            assert.equal('return info', userPanel.infoRequest(config.ownerSteamID64, '!owner'));
        });
        it('Invalid ID', function () {
            assert.equal('invalid key', userPanel.infoRequest(config.ownerSteamID64, '!invalid'));
        });
        it('me (Special case)', function () {
            assert.equal('return ID for self', userPanel.infoRequest(config.ownerSteamID64, '!me'));
        });
    });

    describe('Get User ID', function () {
        it('Valid ID', function () {
            assert.equal('info returned', userPanel.getUserID(config.ownerSteamID64,config.ownerSteamID64));
        });
        it('Invalid ID', function () {
            assert.equal('invalid ID', userPanel.getUserID(config.ownerSteamID64,'bad id'));
        });
        it('me (Special Case)', function () {
            assert.equal('info returned for self', userPanel.getUserID(config.ownerSteamID64,'me'));
        });

    });

}

module.exports = userPanelTest;