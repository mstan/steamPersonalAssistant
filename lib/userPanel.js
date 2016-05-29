/* **********************************
    Run this for all users  
************************************ */
//modules
var steamIDConverter = require('steamidconvert')();

//Dependencies
var importIndex = require('../index.js'),
    config = require('../config/config.js'),
    users = require('../config/users.js'),
    resource = require('../resource.js'),    
    parseInput = require('./messageParser.js'),
    steamIDChk = require('./steamIDCheck.js'),
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

//========= getUserID ======== //

var getUserIDValid = function(steamID,requestedID) {
    var requestedIDArr = [];    
    requestedIDArr.push(requestedID);

    client.getPersonas(requestedIDArr, function(callback) {

        var userJSON = callback; // our callback object
        var userJSONKey = Object.keys(userJSON); // Our list of keys, of which is just one. User 64 bit ID
        var reqUserID64 = userJSONKey[0]; //map it as a string to this ID key
        var reqUserID32 = steamIDConverter.convertToText(userJSONKey[0]);
        var username = userJSON[userJSONKey].player_name;

        var response = 'This user goes by ' + username + '\n' +
                       '32-bit ID: '        + reqUserID32 + '\n' +
                       '64-bit ID: '        + reqUserID64 + '\n' +
                       'Permanent link: '   + 'http://steamcommunity.com/profiles/' + reqUserID64;

        client.chatMessage(steamID,response);
        return requestedID;
    });
}

var getUserIDInvalid = function(steamID) {
    client.chatMessage(steamID, 'Invalid ID or ID format');
    return 'invalid ID';
}

var getUserID = function(steamID,requestedID) {
    //Easy function to request your own info. Pass the message user as the user to request as well
    if (requestedID == 'me') {
        getUserIDValid(steamID,steamID);
        return 'info returned for self';
    } else {
    //Standard function implementation
        var userID = steamIDChk(requestedID);

        if(userID == 'invalid ID') {
            getUserIDInvalid(steamID);
            return 'invalid ID';
        } else {
            getUserIDValid(steamID,requestedID);
            return 'info returned';
        }
    }
}

//========= infoRequest ======== //

var infoRequestString = function(steamID,matchedKey) {
    client.chatMessage(steamID, infoPanelRes[matchedKey]);
    return;

}

var infoRequestArray = function(steamID,matchedKey) {
    var arrayOfResponses = infoPanelRes[matchedKey];
    var ItemToSend = Math.floor((Math.random() * arrayOfResponses.length)); //random item to send
    
    client.chatMessage(steamID,arrayOfResponses[ItemToSend]);
    return;
}

var infoRequest = function(steamID,message) {
    var message = message.toLowerCase().slice(1); //drop ! symbol
    var infoPanelKeysArr = Object.keys(infoPanelRes); //get a list of available keys

    var isValidKey = false; //by default, the user we have isn't valid
    var matchedKey = ''; //This is an empty string. if one is valid, put it here

    //special cases
    if(message == 'me') {
        getUserID(steamID,message);
        return 'return ID for self';
    }
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
            return 'return info';
        } else {
        //it's a string                
            infoRequestString(steamID,matchedKey);
            return 'return info';
        }
    } else {
        //it wasn't valid
        client.chatMessage(steamID, userPanelRes['keyNotFound']);
        return 'invalid key';
    }
}

//========= messagingUser ======== //

var messageRegisteredUser = function(steamID,message) {
    //EX: '@Gamemaster: Hello!'
    var message = message.slice(1); //drop @ symbol
    //Split this into an array. Shift by one to remove the user parameter. Then rejoin it with the same
    //Item that it was split with to reconstruct the message how it was        
    var builtMsg = message.split(': ').slice(1).join(': '); //Extract our message
    //Split the message into an array with the user being at param
    var user = message.split(': '); //input[0] is user.
    var userToMsg = user[0].toLowerCase() //; //This string is always our user
    var msgToSend = builtMsg || ''; //assign msg or assign to blank
    //We want a list of all registered users by ther names
    var registeredUsersByKey = Object.keys(registeredUsers); //build an array of registered users by name
    var validUser = false; //by default, the user we have isn't valid

    //Run through the list. Does the user exist?
    for(var i=0; i < registeredUsersByKey.length; i++) {

        if(registeredUsersByKey[i].toLowerCase() === userToMsg.toLowerCase()) {
            validUser = true;
            break;
        }
    }

    //Message was blank.
    if (msgToSend == '') {
        client.chatMessage(steamID,userPanelRes['noMsgErr']);
        return 'no message';
    }
    //The message exists. The user is valid
    else if (validUser) {
        var userIDByKey = registeredUsers[userToMsg];

        client.chatMessage(userIDByKey,msgToSend);
        client.chatMessage(steamID,userPanelRes['msgSent']);
        return 'message sent';
    } else {
    //The message existed. User wasn't valid.
        client.chatMessage(steamID,userPanelRes['userNotFound']);
        return 'user not found';
    }
}

/* Run this on a new message */
var run = function(SteamUser,steamID,message) {
    /*
        This system is used in two cases.
        #1) The requester is a user. We come straight to this run command.
        #2) The requester is an admin. They sent a command to adminPanel.run BUT the command was not recognized

        In the case of #2), our message is already a parsed array. So we will need to do checks to see if we
        need to reparse it or if it's already done
    */

    //We use special handlers for ! and @. ! designates an info request. @ designates messaging a registered user
    // Is our message already an array?
    if( Array.isArray(message) ) {
        //Check arr[0], first character for !. If yes, it's an info request
        if (message[0][0] == '!') {
            infoRequest(steamID,message);
            return;
        }
        //Check arr[0], first character for @. If yes, it's a registered user message attempt.
        else if(message[0][0] == '@') {
            messageRegisteredUser(steamID,message);
            return;
        } else {
            //break;
        }
    }

    /*
        We presume two cases of falling through to this.
        #1) We had a string to begin with
        #2) We had an array that had neither ! nor @ as the first symbol.

        In both cases, the below still functions. 
        If it case #1, it will run as intended. If we pass no commands or parameters, these handle them properly 
        (e.g. we pass simply "!" or "@" to our bot)

        If it is case #2, an array could never make it this far. If ! or @ are passed, they are handled up top. 
        If they are unrecognized and fall through to here, then the message cannot containt ! or @ as arr[0][0],
        therefore, whatever is being passed below is not the first character, but the first string. That STRING
        can never equal ! or @, as it would have been caught up above (as a string of just ! or @ would also 
        be arr[0][0], thus impossible to fall through to this case)

        Thus, we run zero risk of these erroring out by passing an array as our message to a system that does not
        handle them
    */
    if (message[0] == '!') {
        infoRequest(steamID,message);
    }
    else if(message[0] == '@') {
        messageRegisteredUser(steamID,message);
    //Fall through to normal handling cases, as is with adminPanel.run
    } else {
    /*
        Whatever our message is, parse it.
        We ALWAYS expect an array that's two strings.
        If it's a recognized command, arr[0] is command, arr[1] is the parameter.
        If arr[1] is null, we instead pass 'no command'

        If it's UNrecognized, arr[0] is the message. arr[1] is 'no command'
    */
    /*
        In the case, since we know we might get an array to begin with, input will pass back the array if
        given the array. Therefore, parse it regardless.
    */
        var input = parseInput(message);

        var command =      input[0],
            stringToPass = input[1]; 

        //input[0] is our command.
        //input[1] is our parameter.
        switch (command) {
            case 'help':
                helpFunction(steamID,stringToPass,'user');
                return 'help requested';
            case 'get id':
                getUserID(steamID,stringToPass);
                return 'info requested';
            default: 
                //If this does not work, we should make a fall through case to user cases
                client.chatMessage(steamID,userPanelRes['defaultMessage']);
                return 'unknown command';
        }
    }
}

module.exports = {
    run: run,
    //test module
    messageRegisteredUser: messageRegisteredUser,
    infoRequest: infoRequest,
    getUserID: getUserID,

}
