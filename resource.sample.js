var config = require('./config/config.js'),
    info = require('./config/info.js');

//admin panel messages
var adminPanel = {
    "invalidStatus":        'ERROR: Invalid status',
    "noStatusGiven":        'ERROR: No Status Given',
    "invalidFormatSendMsg": 'ERROR: Invalid userID or message format',
    "noMsgToSend":          'ERROR: No message to send',
    "noIDSpecified":        'ERROR: No ID given',
    "invalidSteamID":       'ERROR: Invalid Steam ID',
    "noNameGiven":          'ERROR: No name given',
    "noGameOrID":           'ERROR: No game or game ID given',
    "sentfriendRequest":    'SUCCESS: Friend request sent',
    "sentMessage":          'SUCCESS: Message sent'
}

//user panel messages
var userPanel = {
    "commandNotFound": 'ERROR: Command not found',      
    //For the default fall through case
    "defaultMessage": 'Welcome to ' + config.ownerName + '\'s chat bot! \n \n' +
                      'Sorry! I didn\'t quite know what to do with your message, ' +
                      'but if you type "help", I\'ll give you a list of commands that I know! \n \n' +
                      'You can also type help: <COMMAND> to get more information about that command!',

    "userNotFound":   'ERROR: User not found!', 
    "keyNotFound":    'ERROR: Key doesn\'t exist!',
    "noMsgErr":       'ERROR: No message given for specified user',
    "msgSent":        'SUCCESS: Message sent'
}

//help commands
var adminCommandsHelp = {
    "add user":     'Add a user by their steam ID \n \n' +
                    '[USAGE] add user: <STEAM ID> \n \n' +
                    '[EXAMPLE] add user: STEAM_0:0:27384306',

    "play game":    'Make this bot play a game using appid or non-steam game \n \n' + 
                    '[USAGE] play game: <APPID>/<NAME> \n \n' +
                    '[EXAMPLE] play game: 440 (Play Team Fortress 2) \n' +
                    '[EXAMPLE] play game: Minecraft',


    "send message":  'Send a message to the specified steam user \n \n' +
                     '[USAGE] send message: <STEAM URL ID>; <MESSAGE> \n \n' +
                     '[EXAMPLE] send message: 76561198015034340; Hello!',

    "set name":      'Change this bot\'s name \n \n' +
                     '[USAGE] set name: <NAME> \n \n' +
                     '[EXAMPLE] set name: Gamemaster\'s Bot',

    "set status":    'Change this bot\'s status' +
                     'Available statuses: Online, Busy, Looking To Play, Looking To Trade, Snooze, Offline*' +
                     'NOTE: Offline is full sign out. This is not equivalent to appearing offline \n \n' +
                     '[USAGE] set status: <STATUS> \n \n' +
                     '[EXAMPLE] set status: busy'
}

var userCommandsHelp = {
    "@<user>":       'Message a pre-registered user by their registered name. \n \n' +
                     '[USAGE] @<USER>: <MESSAGE> +\n \n' +
                     '[EXAMPLE] @Gamemaster: Hello!',

    "!<info>":       'Provides information and responses to passed parameters. \n' +
                     '[PARAMETERS] owner,mumble (and maybe a few special hidden ones \n' +
                     '[USAGE] !<info> \n' +
                     '[EXAMPLE] !mumble'
}


var infoRequests = {
    //info
    //refactor owner to call the command with owner ID?
    "owner":         'Information for ' + config.ownerName + '\n' + 
                     'STEAM ID is ' + config.ownerSteamID32 + '\n' +
                     '64-bit ID is ' + config.ownerSteamID64 + '\n' +
                     'Profile URL: ' + 'http://steamcommunity.com/profiles/' + config.ownerSteamID64,

    "mumble":        'Mumble information is \n' +
                     'IP: ' + info.mumble.ip + '\n' +
                     'Port: ' + info.mumble.port + '\n' +
                     'Password: ' + info.mumble.password,
}

module.exports = {
    adminPanel: adminPanel,
    userPanel: userPanel,

    adminCommandsHelp: adminCommandsHelp,
    userCommandsHelp: userCommandsHelp,

    infoRequests: infoRequests
}