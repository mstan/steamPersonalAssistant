var importIndex =     require('../index.js'),
    resource =        require('../resource.js');
//This is our client from the main index
var client = importIndex.client;


//Resource text file
var userCommandsHelpRes = resource.userCommandsHelp,
    adminCommandsHelpRes = resource.adminCommandsHelp,
    userPanelRes = resource.userPanel;


//We will later build an adminHelp function here
    //In the message controller, we will make it so that people will call a controller. If they are admin, cycle through it
    //else, go to help

//help function for users
var helpFunction = function(steamID,message,permission) {
    //If we dont' get a message, translate it into info
    var message = message.toLowerCase();

    //We have an array of available commands that we set up. 
    var arrayOfUserCommands = Object.keys(userCommandsHelpRes);
    var arrayOfAdminCommands = Object.keys(adminCommandsHelpRes);

    //if no command was passed, lets give them a list of available commands
    if (message == 'no command') {
        //build an emptry string to push to
        var listOfUserCommands = '';

        arrayOfUserCommands.forEach(function(userCommandAtIndex) {
            //add all keys here
            listOfUserCommands += userCommandAtIndex + '\n'; //new line after each command statement
        });

        //If this request came from an admin; further append the string with admin commands
        if(permission == 'admin') {
                arrayOfAdminCommands.forEach(function(userCommandAtIndex) {
                    //add all keys here
                    listOfUserCommands += userCommandAtIndex + '\n'; //new line after each command statement
                });
        }

        //push this to the end user
        client.chatMessage(steamID, listOfUserCommands);
        return 'info list ' + permission;
    // they passed a command. Does it exist?
    } else {
        var commandExists = false;
        var commandType = 'user'; //default case

        for (var i=0; i < arrayOfUserCommands.length; i++ ) {
            if ( message == arrayOfUserCommands[i]) {
                commandExists = true;
                commandType = 'user';
                break;
            } //end if
        } //end for

        if (commandExists === false ) {
            for (var j = 0; j < arrayOfAdminCommands.length; j++) {
                if(message == arrayOfAdminCommands[j]) {
                    commandExists = true;
                    commandType = 'admin';
                    break;
                }
            }
        }

        //this user gave us a command. Give them the info back
        if ((commandExists == true ) && (commandType == 'user')) {
            client.chatMessage(steamID, userCommandsHelpRes[message]);   
            return 'recognized command';
        //that command didn't exist         
        }
        else if ((commandExists == true) && (commandType == 'admin')) {
            client.chatMessage(steamID, adminCommandsHelpRes[message]) 
            return 'recognized command';
        }
         else {
            client.chatMessage(steamID, userPanelRes['commandNotFound']);
            return 'unrecognized command';
        } // end else
    } // end if-else
}

module.exports = helpFunction;