//Dependencies
var SteamUser = require('steam-user'); // Steam Bot app
var SteamTotp = require('steam-totp'); // Steam mobile authenticator handler

//Declarations
var client = new SteamUser(); //make a new "user instance"
exports.client = client; //Export this so other js files can use it

//Personal Modules
var config = require('./config/config.js');
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
    logger.log('info', 'Logged into steam as ' + client.steamID.getSteam3RenderedID());
    client.setPersona(SteamUser.Steam.EPersonaState.Online);
});

//Send a friend request
client.on('friendRelationship', function(steamID,relationship) {
    if(relationship == SteamUser.Steam.EFriendRelationship.RequestRecipient) {
        client.addFriend(steamID);
    }
    logger.log('info', 'Friend Request from ' + steamID);
});


/*
client.on('groupEvent', function (sid,headline,date,gid,gameID) {
    //Handle group events here?
});
*/

//If there's an error
client.on('error', function(err) {
    logger.log('info', err);
});
//If a message is received
client.on('friendMessage', function(steamID,message) {
    logger.log('info', 'Received message from ' + steamID + ' : ' + message);    
    //Is the ID of our user an administrator/owner? Run the admin case
    if (steamID.toString() == config.ownerSteamID64.toString()) {
        adminPanel.run(SteamUser,steamID,message);
    } else {
    //They weren't! user case!
        userPanel.run(SteamUser,steamID,message);
    }
});

