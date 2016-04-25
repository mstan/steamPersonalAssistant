var importIndex = require('../index.js'),
    resource = require('../resource.js');
//This is our client from the main index
var client = importIndex.client;



//Grab the objects that are just k/v of listed user help commands
var userCommandsHelp = resource.userCommandsHelp;


//We will later build an adminHelp function here
    //In the message controller, we will make it so that people will call a controller. If they are admin, cycle through it
    //else, go to help

//help function for users
var help = function(steamID,message) {
    var message = message.toLowerCase();

    if (message == 'info') {
        var arrayOfUserCommands = Object.keys(resource.userCommandsHelp);
        var listOfUserCommands = '';

        arrayOfUserCommands.forEach(function(userCommandAtIndex) {
            listOfUserCommands += userCommandAtIndex + '\n';
        });

        client.chatMessage(steamID, listOfUserCommands);

    } else {
        client.chatMessage(steamID, userCommandsHelp[message]);
    }

}

module.exports = help;