/* **********************************
    Run this document if owner
    of bot. 

    ** If the message does not 
       have any functions here
       pass it through to regular
       user functions **

    TODO:Implement other admins       
************************************ */

//Dependencies
var importIndex = require('../index.js'),
    config = require('../config.js'),
    resource = require('../resource.js'),
    userPanel = require('./userPanel.js'),
    logger = require('./winston.js'),
    defaultResponse = require('./defaultResponse.js'),    
    parseInput = require('./messageParser.js');
//This is our client from the main index
var client = importIndex.client;

/* *******************
    CORE FUNCTIONS 
******************* */

/* Send message to user */
var sendMessage = function(steamID,message) {
    //message comes in format of "user; content" (user is in ID format 76561198015034340)
    var input = message.split('; ');
    //split user into array obj 1 and msg to send into arr obj 2
    var user = input[0];
    var msgToSend = input[1] || 'no message specified';   

    //if the message was not formatted correctly or left empty
    if (message == 'no command' ) {
        defaultResponse(steamID);
        return;        
    // IDs are numerical. If we get passed a non-numerical string we'll error.
    } else if (isNaN(user) === true ) {
        client.chatMessage(steamID, 'Invalid userID or message format');
        return;
    } else if (msgToSend === 'no message specified') {
    //We weren't given a message
        client.chatMessage(steamID, 'Error: No message to send!');
    } else {
    //All else is good. Send it to the specified user
        client.chatMessage(user, msgToSend);
    }
}

/* Send user a friend request */
var addUser = function(steamID,user) {

    //if the message was not formatted correctly or left empty
    if (user == 'no command' ) {
        defaultResponse(steamID);
        return;  
    // IDs are in the format of STEAM_0:0:27384306. If we're passed something not in this format, error.     
    } else if (user.indexOf('STEAM_') == -1) {
        client.chatMessage(steamID, 'Not a valid STEAM ID');
        return;
    } else {
        client.addFriend(user);
    }
}

/* Set the bot's status */
var setStatus = function(SteamUser,steamID,status) {
        var status = status.toLowerCase();

        //if the message was not formatted correctly or left empty
        if(status === 'no command') {
            defaultResponse(steamID);
            return;
        }

        switch (status) {
            case 'online':
                client.setPersona(SteamUser.Steam.EPersonaState.Online)
                break;
            case 'busy':
                client.setPersona(SteamUser.Steam.EPersonaState.Busy)
                break;
            case 'away':
                client.setPersona(SteamUser.Steam.EPersonaState.Away)
                break;
            case 'looking to play':
                client.setPersona(SteamUser.Steam.EPersonaState.LookingToPlay);
                break;
            case 'looking to trade':
                client.setPersona(SteamUser.Steam.EPersonaState.LookingToTrade);
                break;
            case 'snooze':
                client.setPersona(SteamUser.Steam.EPersonaState.Snooze);
                break;   
            //Write confirmation prompt for this. This TURNS BOT OFF                             
            case 'offline':
                client.setPersona(SteamUser.Steam.EPersonaState.Offline)
                console.log('Bot is signed out');
                break;
            //All other cases fall through. Tell them that's not a status  
            default:
                client.chatMessage(steamID, resource.adminPanel.invalidStatus);
                break;
        }
}

/* Set the bot's name. Status is mandatory. Default to Online */
var setName = function(SteamUser,steamID,name) {

        //if the message was not formatted correctly or left empty
        if(name === 'no command') {
            defaultResponse(steamID); 
            return;
        } else {
            client.setPersona(SteamUser.Steam.EPersonaState.Online, name);
        }
}

var playGame = function(steamID,game) {

    //if the message was not formatted correctly or left empty
    if(game === 'no command') {
       defaultResponse(steamID);  
       return;
     }

    //bug: if the game name is all numbers, this will fail out
    //check to see if this is NaN. If it is indeed a number (false that it is NaN), we need to parseInt
    if (isNaN(game) === false ) {
        game = parseInt(game);
    }
        //This can either be an appID integer for a steam game
        //OR it can be a non-steam game (string)
        client.gamesPlayed(game);
}

/* Run this on a new message */
var run = function(SteamUser,steamID,message) {
    var input = parseInput(message);

    var command = input[0],
        stringToPass = input[1];

    switch (command) {
        case 'set status':
            setStatus(SteamUser,steamID, stringToPass);
            break;
        case 'set name':
            setName(SteamUser,steamID,stringToPass);
            break;
        case 'play game':
            playGame(steamID,stringToPass);
            break;
        case 'send message':
            sendMessage(steamID,stringToPass)
            break;
        case 'add user':
            addUser(steamID,stringToPass);
            break;
        default: 
            //If this does not work, we should make a fall through case to user cases
            userPanel.run(SteamUser,steamID,message);
            //client.chatMessage(steamID, 'Hello ' + config.ownerName + '. What would you like me to do?')
            break;    
    }
}

module.exports = {
    run: run
}