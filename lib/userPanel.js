/* **********************************
    Run this for all users  
************************************ */

//Dependencies
var importIndex = require('../index.js'),
    config = require('../config.js'),
    resource = require('../resource.js'),    
    parseInput = require('./messageParser.js'),
    helpFunction = require('./help.js');
//This is our client from the main index
var client = importIndex.client;
//Resource text file
var userPanelRes = resource.userPanel;
/* *******************
    CORE FUNCTIONS 
******************* */
 
/* Run this on a new message */
var run = function(SteamUser,steamID,message) {
    var input = parseInput(message);

    var command =      input[0],
        stringToPass = input[1];

    //input[0] is our command.
    //input[1] is our parameter.
    switch (command) {
        case 'help':
            helpFunction(steamID,stringToPass);
            break;
        default: 
            //If this does not work, we should make a fall through case to user cases
            client.chatMessage(steamID,userPanelRes['defaultMessage']);
            break;
    }
}

module.exports = {
    run: run
}
