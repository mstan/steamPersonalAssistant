/* **********************************
    Run this for all users  
************************************ */

//Dependencies
var importIndex = require('../index.js'),
    config = require('../config.js'),
    resource = require('../resource.js'),    
    parseInput = require('./messageParser.js'),
    defaultResponse = require('./defaultResponse.js'),
    helpFunction = require('./help.js');
//This is our client from the main index
var client = importIndex.client;
/* *******************
    CORE FUNCTIONS 
******************* */
 
/* Run this on a new message */
var run = function(SteamUser,steamID,message) {
    var input = parseInput(message);

    //input[0] is our command.
    //input[1] is our parameter.
    switch (input[0]) { //always a command. Lowercase it.
        case 'help':
            helpFunction(steamID,input[1]);
            break;
        default: 
            //If this does not work, we should make a fall through case to user cases
            defaultResponse(steamID);
            break;    
    }
}


module.exports = {
    run: run
}