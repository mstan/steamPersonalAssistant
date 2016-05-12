//Remove these after tests
var assert = require('assert');
var config = require('../config/config.js');
var SteamUser = require('steam-user'); // Steam Bot app

//Dependencies
var messageParserTest = require('./messageParser.js'),
    helpFunctionTest = require('./helpFunction.js'),
    steamIDCheck = require('./steamIDCheck.js'),
    loginUser = require('./loginUser.js'),
    adminPanelTest = require('./adminPanel.js'),
    userPanelTest = require('./userPanel.js');

//Test these functions
messageParserTest();
helpFunctionTest();
steamIDCheck();
adminPanelTest();
userPanelTest();
