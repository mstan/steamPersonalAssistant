var importIndex =     require('../index.js'),
    defaultResponse = require('./defaultResponse.js'),
    resource =        require('../resource.js');
//This is our client from the main index
var client = importIndex.client;



//Grab the objects that are just k/v of listed user help commands
var userCommandsHelp = resource.userCommandsHelp;


//We will later build an adminHelp function here
    //In the message controller, we will make it so that people will call a controller. If they are admin, cycle through it
    //else, go to help

//help function for users
var helpFunction = function(steamID,message) {
    //If we dont' get a message, translate it into info
    var message = message.toLowerCase();

    //We have an array of available commands that we set up. 
    var arrayOfUserCommands = Object.keys(resource.userCommandsHelp);

    //if no command was passed, lets give them a list of available commands
    if (message == 'no command') {
        //build an emptry string to push to
        var listOfUserCommands = '';

        arrayOfUserCommands.forEach(function(userCommandAtIndex) {
            //add all keys here
            listOfUserCommands += userCommandAtIndex + '\n';
        });

        //push this to the end user
        client.chatMessage(steamID, listOfUserCommands);
    // they passed a command. Does it exist?
    } else {
        var commandExists = false;

        for (i=0; i < arrayOfUserCommands.length; i++ ) {
            if ( message == arrayOfUserCommands[i]) {
                commandExists = true;
            } //end if
        } //end for
        //this user gave us a command. Give them the info back
        if (commandExists == true) {
            client.chatMessage(steamID, userCommandsHelp[message]);   
        //that command didn't exist         
        } else {
            client.chatMessage(steamID, 'ERROR: Command not found');
        } // end else
    } // end if-else
}

module.exports = helpFunction;