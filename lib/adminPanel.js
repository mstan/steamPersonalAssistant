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
    parseInput = require('./messageParser.js');
//This is our client from the main index
var client = importIndex.client;

/* *******************
    CORE FUNCTIONS 
******************* */

/* Send message to user */
var sendMessage = function(message) {
    var input = message.split('; ');

    var user = input[0].toString();
    var msgToSend = input[1];    

    //library of registered users
    var registeredUsers = resource.registeredUsers;


/*
    //Check to see if this is a user or ID
    if (isNaN(parseInt(user)) === false ) {
        user = registeredUsers[user];
    }
*/

    client.chatMessage(user, msgToSend);

}

/*

var addUser = function(user) {
    //library of registered users
    var registeredUsers = resource.registeredUsers;


    //Check to see if this is a user or ID
    //Bug: this will fail if the user's name is all numbers 
    if (isNaN(parseInt(user)) === false ) {
        user = registeredUsers[user];
    }

    client.addFriend(user);

}

*/

/* Set the bot's status */
var setStatus = function(SteamUser,steamID,status) {
        var status = status.toLowerCase() || '';

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
        client.setPersona(SteamUser.Steam.EPersonaState.Online, name);
}

var playGame = function(game) {
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

    logger.log('info', 'Received message from ' + steamID + ' : ' + message);

    //input[0] is our command.
    //input[1] is our parameter.
    switch (input[0]) { //always a command. Lowercase it.
        case 'set status':
            setStatus(SteamUser,steamID, input[1]);
            break;
        case 'set name':
            setName(SteamUser,steamID,input[1]);
            break;
        case 'play game':
            playGame(input[1]);
            break;
        case 'send message':
            sendMessage(input[1])
            break;
        case 'add user':
            addUser(input[1]);
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
