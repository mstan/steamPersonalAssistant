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

//========= addUser ======== //
var addUser = function(steamID,user) {
/* Accepts 64-bit IDs to add a user */
    //1) Check to see if this user is a valid 32 or 64 bit ID
    user = steamIDChk(user); //Q: is this being promoted to global scope? do I need var here?

    //2a) In the case of steamIDChk returning invalid ID
    if (user == 'invalid ID') {
        client.chatMessage(steamID, adminPanelRes['invalidSteamID']);
        return 'invalid ID';
    //3a) In the case of the ID being valid, but 32-bit. Convert to 64-bit
    } else if ( !isNaN(user) ) {
        user = steamIDConverter.convertToText(user);
        client.addFriend(user);
        client.chatMessage(steamID,adminPanelRes['sentfriendRequest']);
        return 'user added';
    } else {
    //4a) In the case of the ID already being 64-bit
        client.addFriend(user);
        client.chatMessage(steamID,adminPanelRes['sentfriendRequest']);
        return 'user added';
    }
}

//========= Play Game ======== //
var playGame = function(steamID,game) {
/* Takes either string or integer. 
   Strings are for non-steam games
   Integers are from steam games from the library
*/
    //Have a copy of this string as an integer.
    var gameAsInt = parseInt(game);

    //if the message was not formatted correctly or left empty
    if(game === 'no command') {
       client.chatMessage(steamID,adminPanelRes['noGameOrID']);
       return 'invalid game';
     }

    //bug: if the game name is all numbers, the user cannot "play" that game. It will be attempd to be parsed as an integer
    //check to see if this is NaN. If it is indeed a number (false that it is NaN), we need to parseInt
    if (!isNaN(gameAsInt)) {
        game = gameAsInt;
    }
        //This can either be an appID integer for a steam game
        //OR it can be a non-steam game (string)
    client.gamesPlayed(game);
    return game;
}

//========= send a message ======== //

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
        return 'no message';        
    }
    //Check 2 - that message WAS valid. Now our ID can be one of two things. 
    //64-bit 
    else if ( !isNaN(userSanitized) ) {
        client.chatMessage(user,msgToSend);
        client.chatMessage(steamID, adminPanelRes['sentMessage']);
        return 'message sent';
    } 
    //32 bit
    else if (userSanitized.indexOf('STEAM_') == 0 ) {
        client.chatMessage(user,msgToSend);
        client.chatMessage(steamID, adminPanelRes['sentMessage']);
        return 'message sent';
    }
    //Fail case
    else {
        client.chatMessage(steamID,adminPanelRes['invalidSteamID']);
        return 'invalid ID';
    }
}

//========= Change User Name ======== //
/* Set the bot's name. Status is mandatory on setting a name. We just set it to online. */
var setName = function(SteamUser,steamID,name) {
        //if the message was not formatted correctly or left empty
        if(name === 'no command') {
            client.chatMessage(steamID, adminPanelRes['noNameGiven']);
            return 'invalid name';
        } else {
        //Run the function with the name
            client.setPersona(SteamUser.Steam.EPersonaState.Online, name);
            return 'success';
        }
}

//========= set status ======== //

/* Set the bot's status */
var setStatus = function(SteamUser,steamID,status) {
        var status = status.toLowerCase();

        //Switch case for available bot statuses
        switch (status) {
            case 'online':
                client.setPersona(SteamUser.Steam.EPersonaState.Online);
                return 'status: online';
            case 'busy':
                client.setPersona(SteamUser.Steam.EPersonaState.Busy);
                return 'status: busy';
            case 'away':
                client.setPersona(SteamUser.Steam.EPersonaState.Away);
                return 'status: away';
            case 'looking to play':
                client.setPersona(SteamUser.Steam.EPersonaState.LookingToPlay);
                return 'status: looking to play';
            case 'looking to trade':
                client.setPersona(SteamUser.Steam.EPersonaState.LookingToTrade);
                return 'status: looking to trade';
            case 'snooze':
                client.setPersona(SteamUser.Steam.EPersonaState.Snooze);
                return 'status: snooze';
            //Write confirmation prompt for this. This TURNS BOT OFF AND HAS TO BE RESTARTED VIA CLI                         
            case 'offline':
                client.setPersona(SteamUser.Steam.EPersonaState.Offline);
                console.log('Bot is signed out');
                return 'status: offline';
            //All other cases fall through. Tell them that's not a status  
            default:
                client.chatMessage(steamID, resource.adminPanel['invalidStatus']);
                return 'invalid status';
        }
}

/* Run this on a new message */
var run = function(SteamUser,steamID,message) {
    /*
        Whatever our message is, parse it.
        We ALWAYS expect an array that's two strings.
        If it's a recognized command, arr[0] is command, arr[1] is the parameter.
        If arr[1] is null, we instead pass 'no command'

        If it's UNrecognized, arr[0] is the message. arr[1] is 'no command'
    */
    var input = parseInput(message);

    var command =      input[0],
        stringToPass = input[1];

    switch (command) {
        case 'set status':
            setStatus(SteamUser,steamID,stringToPass);
            return 'status set';
        case 'set name':
            setName(SteamUser,steamID,stringToPass);
            return 'name set';
        case 'play game':
            playGame(steamID,stringToPass);
            return 'game set'
        case 'send message':
            sendMessage(steamID,stringToPass)
            return 'message sent'
        case 'add user':
            addUser(steamID,stringToPass);
            return 'user added';
        case 'help':
            helpFunction(steamID,stringToPass,'admin');
            return 'help requested';
        default: 
            //If this does not work, we should make a fall through case to user cases
            userPanel.run(SteamUser,steamID,message);
            //client.chatMessage(steamID, 'Hello ' + config.ownerName + '. What would you like me to do?')
            return 'unrecognized command';    
    }
}

module.exports = {
    run: run,

    //test module
    setStatus: setStatus,
    setName: setName,
    sendMessage: sendMessage,
    playGame: playGame,
    addUser: addUser
}
