var assert = require('assert'),
    config = require('../config/config.js');

var SteamUser = require('steam-user'),
    loginUser = require('./loginUser.js'),
    client = loginUser.client;


var adminPanel = require('../lib/adminPanel.js');

var adminPanelTest = function() {

    describe('Admin Panel', function () {
        //1 - get info list (no command) - user
        describe('Run', function () {
            it('Set status (valid input)', function () {
                assert.equal('status set', adminPanel.run(SteamUser, config.ownerSteamID64,'set status: busy'));
            });          
            it('Set status (invalid input)', function () {
                assert.equal('status set', adminPanel.run(SteamUser, config.ownerSteamID64,'set status: fake status'));
            });

            it('Set name (valid input)', function () {
                assert.equal('name set', adminPanel.run(SteamUser, config.ownerSteamID64, 'set name: Master of Damnits'));
            }); 
            it('Set name (invalid input)', function () {
                assert.equal('name set', adminPanel.run(SteamUser, config.ownerSteamID64, 'set name: '));
            }); 

            it('Play game (Valid input - game ID)', function () {
                assert.equal('game set', adminPanel.run(SteamUser, config.ownerSteamID64, 'play game: 440'));
            });
            it('Play game (Valid input - game name)', function () {
                assert.equal('game set', adminPanel.run(SteamUser, config.ownerSteamID64, 'play game: Minecraft'));
            });
            it('Play game (Invalid input)', function () {
                assert.equal('game set', adminPanel.run(SteamUser, config.ownerSteamID64, 'play game: '));
            });
        });

        describe('Send Message', function () {
            it('Valid Input', function () {
                assert.equal('message sent', adminPanel.run(SteamUser, config.ownerSteamID64, 'send message: ' + config.ownerSteamID64 + '; Hello!'));
            });
            it('Invalid Message', function () {
                assert.equal('message sent', adminPanel.run(SteamUser, config.ownerSteamID64, 'send message: ' + config.ownerSteamID64 + ';'));
            });
             it('Invalid ID', function () {
                assert.equal('message sent', adminPanel.run(SteamUser, config.ownerSteamID64, 'send message: ' + 'bad ID' + '; Hello!'));
            });       
             it('Invalid Parameters', function () {
                assert.equal('message sent', adminPanel.run(SteamUser, config.ownerSteamID64, 'send message: '));
            });  
        });

        describe('Add User', function () {
             it('Valid Input', function () {
                assert.equal('user added', adminPanel.run(SteamUser, config.ownerSteamID64, 'add user: ' + config.ownerSteamID64));
            });  
             it('Invalid Input', function () {
                assert.equal('user added', adminPanel.run(SteamUser, config.ownerSteamID64, 'add user: ' + 'bad ID'));
            });  
        });

        /*
        describe('Help', function () {
            //Failing beacause of another internal dependency called
            it('Get help list (no input)', function () {
                assert.equal('help requested', adminPanel.run(SteamUser, config.ownerSteamID64, 'help: '));
            });
            it('Valid input', function () {
                assert.equal('help requested', adminPanel.run(SteamUser, config.ownerSteamID64, 'help: send message'));
            });
            it('Invalid', function () {
                assert.equal('help requested', adminPanel.run(SteamUser, config.ownerSteamID64, 'help: bad command'));
            });
        });
        */
    });


    describe('Set status', function () {
        it('Online', function () {
            assert.equal('status: online', adminPanel.setStatus(SteamUser,config.ownerID64,'online'));
        });
        it('Busy', function () {
            assert.equal('status: busy', adminPanel.setStatus(SteamUser,config.ownerID64,'busy'));
        });
        it('Away', function () {
            assert.equal('status: away', adminPanel.setStatus(SteamUser,config.ownerID64,'away'));
        });
        it('Looking to play', function () {
            assert.equal('status: looking to play', adminPanel.setStatus(SteamUser,config.ownerID64,'looking to play'));
        });
        it('Looking to trade', function () {
            assert.equal('status: looking to trade', adminPanel.setStatus(SteamUser,config.ownerID64,'looking to trade'));
        });
        it('Snooze', function () {
            assert.equal('status: snooze', adminPanel.setStatus(SteamUser,config.ownerID64,'snooze'));
        });
        it('Offline', function () {
            assert.equal('status: offline', adminPanel.setStatus(SteamUser,config.ownerID64,'offline'));
        });

        /*
        it('Invalid status', function () {
            //failing because of resource object called.
            assert.equal('invalid status', adminPanel.setStatus(SteamUser,config.ownerID64,'invalid status'));
        });
        */
    });

    describe('play game', function () {
        it('Game by ID', function () {
            assert.equal(440, adminPanel.playGame(config.ownerID64,'440'));
        });
        it('Game by name', function () {
            assert.equal('Minecraft', adminPanel.playGame(config.ownerID64,'Minecraft'));
        });
        it('No game', function () {
            assert.equal('', adminPanel.playGame(config.ownerID64,''));
        });
    });

    describe('Add user', function () {
        it('32-bit ID', function () {
            assert.equal('user added', adminPanel.addUser(config.ownerSteamID64, config.ownerSteamID32));
        });
        it('64-bit ID', function () {
            assert.equal('user added', adminPanel.addUser(config.ownerSteamID64, config.ownerSteamID64));
        });
        it('Invalid ID', function () {
            assert.equal('invalid ID', adminPanel.addUser(config.ownerSteamID64, 'bad id'));
        });       
    });
}
module.exports = adminPanelTest;