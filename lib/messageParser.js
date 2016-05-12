var parseInput = function(message) {
    //expected input is "command: parameter"

    var input = []; //input is always an array
    var messageChk = message.toLowerCase(); //messageChk is the message in lowercase

    // an array of recognized commands
    var commands = ['set status:', 'set name:',     'play game:', 
                    'help:',       'send message:', 'add user:', 
                    'get id:'];  

    var recognizedCmd = false; //by default the command is not recognized

    commands.forEach(function(command) {
        if(messageChk.indexOf(command) !== -1 ) {
            recognizedCmd = true;
            return;
        }
    }); 

    //do a check to see if this is indexed at a point (-1 is not found)
    if (recognizedCmd) { 
        //index[0] is our command.index[1] is our parameter

        //Split this into an array. Shift by one to remove the user parameter. Then rejoin it with the same
        //Item that it was split with to reconstruct the message how it was   
        //This is done in case the user uses extra colons in the parameter     
        var parameter = message.split(': ').slice(1).join(': '); //Extract our message
        var command = message.split(': '); //Our command is at arr[0]
        input[0] = command[0].toLowerCase().trim();
        input[1] = parameter; //This is our parameter

        return input;
    } 
    else {
        //fall through (unrecognized command). pass message as is on input[0]
        //input = [];
        input[0] = message;
        input[1] = 'no command';
        return input;
    }
}

module.exports = parseInput;