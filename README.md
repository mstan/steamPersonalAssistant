# Steam Personal Assisstant

This bot is created with the intention of being a prototype for the site bot at VictoryPit gaming. 

### Setup
Rename the following files
config.sample.js -> config.js
info.sample.js -> info.js
resource.sample.js -> resource.js

##### config/config.js

  "botAccountName": "<Your account username here>",
  "botAccountPwd": "<Your account password here>",
  "botSharedSecret": "<Your account's 2factor code here.>", //Must be generated secret from 2factor
  "ownerName": "<Your name>", //Used in bot system messages. This can be whatever you want.
  "ownerSteamID32": "<STEAM_X:X:XXXXXXXX", //Your main account's SteamID32 (not this bot's ID), For interacting with your bot as owner
  "ownerSteamID64": "<XXXXXXXXXXXXXXXXX>", //Your main account's SteamID64 (not this bot's ID), For interacting with your bot as owner


##### config/info.js

Add objects here with core info that can be used throughout this system, namely in the !command to export information.

##### resource.js

resource.js consists of numerous strings that are output by the system

userPanel, adminPanel, adminCommandsHelp, userCommandsHelp, are default. It recommended to only modify them if you are coding additioanl functions

infoRequests are key/value pairs that are used by using the !command. This !command looks for the key after the !, and returns the string value. You can reference information and objects provided in info.js