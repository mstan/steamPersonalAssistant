/* **********************************
    Run this document if owner
    of bot. 

    ** If the message does not 
       have any functions here
       pass it through to regular
       user functions **

    TODO:Implement other admins       
************************************ */

//modules
var steamIDConverter = require('steamidconvert')();

//Dependencies
var importIndex = require('../index.js'),
    config = require('../config/config.js'),
    resource = require('../resource.js'),
    userPanel = require('./userPanel.js'),
    helpFunction = require('./help.js'),
    steamIDChk = require('./steamIDCheck.js'),       
    logger = require('./winston.js'),   
    parseInput = require('./messageParser.js');
//This is our client from the main index
var client = importIndex.client;
//Resource text file
var adminPanelRes = resource.adminPanel;

/* *******************
    CORE FUNCTIONS 
******************* */

/* Send user a friend request */
var addUser = function(steamID,user) {
    user = steamIDChk(user);

    if (!!parseInt(user)) {
        user = steamIDConverter.convertToText(user);
    }

    //if the message was not formatted correctly or left empty
    if (user == 'no command' ) {
        client.chatMessage(steamID, adminPanelRes['noIDSpecified']);
        return;  
    //TODO: Rehandle this with converter and validity functions   
    // IDs are in the format of STEAM_0:0:27384306. If we're passed something not in this format, error.     
    } else if (user == 'invalid ID') {
        client.chatMessage(steamID, adminPanelRes['invalidSteamID']);
        return;
    } else {
        client.addFriend(user);
        client.chatMessage(steamID,adminPanelRes['sentfriendRequest']);
        return;
    }
}

var playGame = function(steamID,game) {

    //if the message was not formatted correctly or left empty
    if(game === 'no command') {
       client.chatMessage(steamID,adminPanelRes['noGameOrID']);
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

/* Send message to user */
var sendMessage = function(steamID,message) {
    //message comes in format of "user; content" (user is in ID format 76561198015034340)
    var input = message.split('; ');
    //split user into array obj 1 and msg to send into arr obj 2
    var user = input[0];
    var userSanitized = steamIDChk(input[0]);
    var msgToSend = input[1] || 'no command';   

    //Check 1 - was that message valid? If not, disregard everything else
    if (msgToSend == 'no command' ) {
        client.chatMessage(steamID, adminPanelRes['invalidFormatSendMsg']);
        return;        
    }
    //Check 2 - that message WAS valid. Now our ID can be one of two things. 
    //64-bit 
    else if ( !!parseInt(user) ) {
        client.chatMessage(user,msgToSend);
        client.chatMessage(steamID, adminPanelRes['sentMessage']);
        return;
    } 
    //32 bit
    else if (userSanitized.indexOf('STEAM_') == 0 ) {
        client.chatMessage(user,msgToSend);
        client.chatMessage(steamID, adminPanelRes['sentMessage']);
        return;
    }
    //Fail case
    else {
        client.chatMessage(steamID,adminPanelRes['invalidSteamID']);
    }
}

/* Set the bot's name. Status is mandatory. Default to Online */
var setName = function(SteamUser,steamID,name) {
        //if the message was not formatted correctly or left empty
        if(name === 'no command') {
            client.chatMessage(steamID, adminPanelRes['noNameGiven']);
            return;
        } else {
            client.setPersona(SteamUser.Steam.EPersonaState.Online, name);
            return;
        }
}

/* Set the bot's status */
var setStatus = function(SteamUser,steamID,status) {
        var status = status.toLowerCase();

        //if the message was not formatted correctly or left empty
        if(status === 'no command') {
            client.chatMessage(steamID,adminPanelRes['noStatusGiven']);
            return;
        }

        switch (status) {
            case 'online':
                client.setPersona(SteamUser.Steam.EPersonaState.Online);
                break;
            case 'busy':
                client.setPersona(SteamUser.Steam.EPersonaState.Busy);
                break;
            case 'away':
                client.setPersona(SteamUser.Steam.EPersonaState.Away);
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
                client.setPersona(SteamUser.Steam.EPersonaState.Offline);
                console.log('Bot is signed out');
                break;
            //All other cases fall through. Tell them that's not a status  
            default:
                client.chatMessage(steamID, resource.adminPanel['invalidStatus']);
                break;
        }
}


/* Run this on a new message */
var run = function(SteamUser,steamID,message) {
    var input = parseInput(message);

    var command =      input[0],
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
        case 'help':
            helpFunction(steamID,stringToPass,'admin');
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
