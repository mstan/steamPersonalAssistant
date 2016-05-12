var importIndex = require('../index.js'),
    resource =    require('../resource.js');
//This is our client from the main index
var client = importIndex.client;

//Resource text file
var userCommandsHelpRes = resource.userCommandsHelp,
    adminCommandsHelpRes = resource.adminCommandsHelp,
    userPanelRes = resource.userPanel;

//help function for users
var helpFunction = function(steamID,message,permission) {
    var message = message.toLowerCase();

    //We have an array of available commands that we set up. 
    var arrayOfUserCommands = Object.keys(userCommandsHelpRes);
    var arrayOfAdminCommands = Object.keys(adminCommandsHelpRes);

    //if no command was passed, lets give them a list of available commands
    if (message == 'no command') {
        //build an empty string to push to
        var listOfUserCommands = '';

        //Take our listOfUserCommands object. Cycle through the keys, and pass them back to our user.
        arrayOfUserCommands.forEach(function(userCommandAtIndex) {
            listOfUserCommands += userCommandAtIndex + '\n'; 
        });
        //If this request came from an admin; further append the string with admin commands
        if(permission == 'admin') {
                arrayOfAdminCommands.forEach(function(userCommandAtIndex) {
                    listOfUserCommands += userCommandAtIndex + '\n'; 
                });
        }
        //push this to the end user
        client.chatMessage(steamID, listOfUserCommands);
        return 'info list ' + permission;
    // they passed a command. Does it exist?
    } else {
        var commandExists = false;
        //We specify a command type and assign it accordingly depending on which array it came from.
        //This way, we know which array to pull from for our command when we pass back to our user
        var commandType = ''; 


        //Run through each key. Does it match the matched key?
        for (var i=0; i < arrayOfUserCommands.length; i++ ) {
            if ( message == arrayOfUserCommands[i]) {
                commandExists = true;
                commandType = 'user';
                break;
            } //end if
        } //end for

        //if the key was not found in the above statement, maybe it's an admin command.
        //If our user is an admin and the command was not found? Check for it.
        if ( (commandExists === false) && (permission === 'admin')) {
            for (var j = 0; j < arrayOfAdminCommands.length; j++) {
                if(message == arrayOfAdminCommands[j]) {
                    commandExists = true;
                    commandType = 'admin';
                    break;
                }
            }
        }
        //We found it. It was a user command.
        if ((commandExists == true ) && (commandType == 'user')) {
            client.chatMessage(steamID, userCommandsHelpRes[message]);   
            return 'recognized command';        
        }
        //We found it. It was an admin command
        else if ((commandExists == true) && (commandType == 'admin')) {
            client.chatMessage(steamID, adminCommandsHelpRes[message]);
            return 'recognized command';
        //We didn't find it.
        } else {
            client.chatMessage(steamID, userPanelRes['commandNotFound']);
            return 'unrecognized command';
        } // end else
    } // end if-else
}

module.exports = helpFunction;