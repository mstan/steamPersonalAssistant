/* **********************************
    Run this for all users  
************************************ */

//Dependencies
var importIndex = require('../index.js'),
    config = require('../config.js'),
    users = require('../users.js'),
    resource = require('../resource.js'),    
    parseInput = require('./messageParser.js'),
    helpFunction = require('./help.js');
//This is our client from the main index
var client = importIndex.client;
//Resource text file
var userPanelRes = resource.userPanel;
//Config file
var registeredUsers = users.registeredUsers;
/* *******************
    CORE FUNCTIONS 
******************* */
var infoRequest = function(SteamUser,steamID,message) {
        var message = message.toLowerCase().slice(1); //drop ! symbol
        var infoPanelRes = resource.infoRequests; //array of info to send back
        var infoPanelKeysArr = Object.keys(infoPanelRes);

        var validKey = false; //by default, the user we have isn't valid

        //Run through the list. Does the user exist?
        for(var i=0; i < infoPanelKeysArr.length; i++) {

            if(infoPanelKeysArr[i] === message) {
                validKey = true;
            }
        }

        if(validKey) {
        //It exists, send it back
            client.chatMessage(steamID, infoPanelRes[message]);
        } else {
        //It didn't exist.    
            client.chatMessage(steamID, 'ERROR: Key doesn\'t exist!');
        }
}

var messageRegisteredUser = function(SteamUser,steamID,message) {
    // '@Gamemaster: Hello!'
        var message = message.slice(1); //drop @ symbol
        var input = message.split(': '); //input[0] is user. Input[1] is message
        var userToMsg = input[0];
        var msgToSend = input[1] || ''; //assign msg or assign to blank
        //We want a list of all registered users by ther names
        var registeredUsersByKey = Object.keys(registeredUsers); //build an array of registered users by name
        var validUser = false; //by default, the user we have isn't valid

        //Run through the list. Does the user exist?
        for(var i=0; i < registeredUsersByKey.length; i++) {

            if(registeredUsersByKey[i].toLowerCase() === userToMsg.toLowerCase()) {
                validUser = true;
            }
        }

        //Message was blank.
        if (msgToSend == '') {
            client.chatMessage(steamID,'ERROR: No message given for specified user');
            return;
        }
        //The message exists. The user is valid
        else if (validUser) {
            var userIDByKey = registeredUsers[userToMsg];

            client.chatMessage(userIDByKey,msgToSend);
        } else {
        //The message existed. User wasn't valid.
            client.chatMessage(steamID,userPanelRes['userNotFound']);
            return;
        }
}

/* Run this on a new message */
var run = function(SteamUser,steamID,message) {

    //If the message begins with !, it's an info request. Pass it off
    if (message[0][0] == '!') {
        infoRequest(SteamUser,steamID,message);
    }
    //If the message begins with @, it's a message to a registered user. Pass it off
    else if(message[0][0] == '@') {
        messageRegisteredUser(SteamUser,steamID,message);
    } else {
        var input = parseInput(message);

        var command =      input[0],
            stringToPass = input[1]; 


        //input[0] is our command.
        //input[1] is our parameter.
        switch (command) {
            case 'help':
                helpFunction(steamID,stringToPass);
                break;
            case 'send message to user':

            default: 
                //If this does not work, we should make a fall through case to user cases
                client.chatMessage(steamID,userPanelRes['defaultMessage']);
                break;
        }
    }
}

module.exports = {
    run: run
}
