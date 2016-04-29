var parseInput = function(message) {
    //expected input is "command: parameter"

    var input = [];
    var messageChk = message.toLowerCase();


    //boolean operation to see if any of these are command: value
    var commands = ['set status:', 'set name:', 'play game:', 'help:', 'send message:', 'add user:', 'get id:'];
    var recognizedCmd = false;


    commands.forEach(function(command) {
        if(messageChk.indexOf(command) !== -1 ) {
            recognizedCmd = true;
        }
    }); //end forEach


    if (recognizedCmd) { //do a check to see if this is indexed at a point (-1 is not found)
        //it was found, split this into an array. 
        //index[0] is our command.
        //index[1] is our parameter

        //Split this into an array. Shift by one to remove the user parameter. Then rejoin it with the same
        //Item that it was split with to reconstruct the message how it was        
        var parameter = message.split(': ').slice(1).join(': '); //Extract our message

        var command = message.split(': '); //Our command is at arr[0]
        input[0] = command[0].toLowerCase();
        input[1] = parameter; //This is our parameter

        return input;
    } 
    else {
        //fall through to final case. pass message as is on input[0]
        //input = [];
        input[0] = message;
        input[1] = 'no command';
        return input;
    }

}

module.exports = parseInput;