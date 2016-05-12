var assert = require('assert');
var messageParser = require('../lib/messageParser.js');

var messageParserTest = function () {

    describe('Message Parser', function () {
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
}

module.exports = messageParserTest;