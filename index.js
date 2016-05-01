//Dependencies
var SteamUser = require('steam-user'); // Steam Bot app
var SteamTotp = require('steam-totp'); // Steam mobile authenticator handler
//var winston = require('winston');

//Declarations
var client = new SteamUser(); //make a new "user instance"
exports.client = client; //Export this so other js files can use it

//Personal Modules
var config = require('./config.js');
var adminPanel =  require('./lib/adminPanel.js');
var userPanel = require('./lib/userPanel.js');
var logger = require('./lib/winston'); 

logger.log('info', 'Starting Steam Bot Handler...');
logger.log('info', 'This bot\'s owner is ' + config.ownerName);

//Log in
client.logOn({
    "accountName": config.botAccountName,
    "password": config.botAccountPwd,
    "twoFactorCode": SteamTotp.generateAuthCode(config.botSharedSecret)
});

//Once logged in
client.on('loggedOn', function(details) {
    console.log("Logged into steam as " + client.steamID.getSteam3RenderedID());
    client.setPersona(SteamUser.Steam.EPersonaState.Online);
});

//If there's an error
client.on('error', function(e) {
    console.log(e);
});

//If a message is received
client.on('friendMessage', function(steamID,message) {

    logger.log('info', 'Received message from ' + steamID + ' : ' + message);    

    if (steamID.toString() == config.ownerSteamID64.toString()) {
        adminPanel.run(SteamUser,steamID,message);
    } else {
        userPanel.run(SteamUser,steamID,message);
      //client.chatMessage(steamID, 'Welcome to ' + config.ownerName + '\'s chat bot! What would you like me to do?');
    }
});

