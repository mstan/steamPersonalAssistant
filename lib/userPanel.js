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
var infoPanelRes = resource.infoRequests; //array of info to send back
//Config file
var registeredUsers = users.registeredUsers;
/* *******************
    CORE FUNCTIONS 
******************* */


var getUserInfo = function(steamID,requestedID) {
    var requestedID = requestedID.trim();

    console.log(requestedID.indexOf('STEAM_'));

    if( requestedID.indexOf('STEAM_') !== 0) {
        client.chatMessage(steamID, 'Invalid ID or ID format');
        return;
    }

    var requestedIDArr = [];
    
    requestedIDArr.push(requestedID);

    client.getPersonas(requestedIDArr, function(callback) {
        var userJSON = callback; // our callback object
        var userJSONKey = Object.keys(userJSON); // Our list of keys, of which is just one. User 64 bit ID
        var reqUserID64 = userJSONKey[0]; //map it as a string to this ID key
        var username = userJSON[userJSONKey].player_name;

        var response = 'Username: ' + username + '\n' +
                       '64-bit ID: ' + reqUserID64

        client.chatMessage(steamID,response);
        return;
    });
}


var infoRequest = function(steamID,message) {
        var message = message.toLowerCase().slice(1); //drop ! symbol
        var infoPanelKeysArr = Object.keys(infoPanelRes); //get a list of available keys

        var isValidKey = false; //by default, the user we have isn't valid
        var matchedKey = ''; //This is an empty string. if one is valid, put it here

        //Run through the list. Does the key exist?
        for(var i=0; i < infoPanelKeysArr.length; i++) {
            if(infoPanelKeysArr[i] === message) {
                isValidKey = true; //it does
                matchedKey = message; //This is the key
            }
        }

        //It was valid
        if (isValidKey) {
            //it's an array
            if ( Array.isArray(infoPanelRes[matchedKey]) ) {
                infoRequestArray(steamID,matchedKey);
                return;
            } else {
            //it's a string                
                infoRequestString(steamID,matchedKey);
                return;
            }
        } else {
        //it wasn't valid
            client.chatMessage(steamID, userPanelRes['keyNotFound']);
            return;
        }
}

var infoRequestString = function(steamID,matchedKey) {
    client.chatMessage(steamID, infoPanelRes[matchedKey]);
    return;

}

var infoRequestArray = function(steamID,matchedKey) {
    var arrayOfResponses = infoPanelRes[matchedKey];
    var ItemToSend = Math.floor((Math.random() * arrayOfResponses.length)); //random item to send
    
    client.chatMessage(steamID,arrayOfResponses[ItemToSend]);
    console.log(arrayOfResponses[ItemToSend]);
    return;
}

var messageRegisteredUser = function(steamID,message) {
    // '@Gamemaster: Hello!'
        var message = message.slice(1); //drop @ symbol
        //Split this into an array. Shift by one to remove the user parameter. Then rejoin it with the same
        //Item that it was split with to reconstruct the message how it was        
        var builtMsg = message.split(': ').slice(1).join(': '); //Extract our message
        //Split the message into an array with the user being at param
        var user = message.split(': '); //input[0] is user.
        var userToMsg = user[0]; //This string is always our user
        var msgToSend = builtMsg || ''; //assign msg or assign to blank
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
            client.chatMessage(steamID,userPanelRes['noMsgErr']);
            return;
        }
        //The message exists. The user is valid
        else if (validUser) {
            var userIDByKey = registeredUsers[userToMsg];

            client.chatMessage(userIDByKey,msgToSend);
            client.chatMessage(steamID,userPanelRes['msgSent']);
            return;
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
        infoRequest(steamID,message);
    }
    //If the message begins with @, it's a message to a registered user. Pass it off
    else if(message[0][0] == '@') {
        messageRegisteredUser(steamID,message);
    } else {
        var input = parseInput(message);

        var command =      input[0],
            stringToPass = input[1]; 


        //input[0] is our command.
        //input[1] is our parameter.
        switch (command) {
            case 'help':
                helpFunction(steamID,stringToPass,'user');
                break;
            case 'get id':
                getUserInfo(steamID,stringToPass);
                break;
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
