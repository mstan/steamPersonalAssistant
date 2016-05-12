var SteamUser = require('steam-user'); // Steam Bot app
var SteamTotp = require('steam-totp'); // Steam mobile authenticator handler
var client = new SteamUser(); //make a new "user instance"
var config = require('../config/config.js');

client.logOn({
    "accountName": config.botAccountName,
    "password": config.botAccountPwd,
    "twoFactorCode": SteamTotp.generateAuthCode(config.botSharedSecret)
});

exports.client = client;