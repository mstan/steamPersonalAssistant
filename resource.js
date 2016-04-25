var config = require('./config.js');

//admin panel messages
var adminPanel = {
    "invalidStatus": 'That isn\'t a valid status',
}

//user panel messages
var userPanel = {
    "defaultMessage": 'Welcome to ' + config.ownerName + '\'s chat bot! What would you like me to do?'
}

//help commands
var userCommandsHelp = {
    "play game": "Make this bot play a game using appid or non-steam game (Non-steam) \n" + 
                 "[USAGE] play game: <APPID>/<NAME> \n" +
                 "[EXAMPLE] play game: 440 (Play Team Fortress 2) \n" +
                 "[EXAMPLE] play game: Minecraft",
    "test": "help"
}

var registeredUsers = {
    "Gamemaster": '76561198015034340',
    "Aeronaut": 'blank'
}

module.exports = {
    adminPanel: adminPanel,
    userPanel: userPanel,
    userCommandsHelp: userCommandsHelp,
    registeredUsers: registeredUsers
}