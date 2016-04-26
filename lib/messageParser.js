var parseInput = function(message) {
    var input = [];
    var messageChk = message.toLowerCase();


    //boolean operation to see if any of these are command: value
    var needsSplit = messageChk.indexOf('set status:')   !== -1 || 
                     messageChk.indexOf('set name:')     !== -1 || 
                     messageChk.indexOf('play game:')    !== -1 ||
                     messageChk.indexOf('help:')         !== -1 ||
                     messageChk.indexOf('send message:') !== -1 ||
                     messageChk.indexOf('add user:')     !== -1;

    // is our message already an object? Just return it. Don't play with it.
    if (typeof message == 'object' ) {
        input = message;
        return input;
    } 
    else if ( needsSplit ) {     //do a check to see if this is indexed at a point (-1 is not found)
        //it was found, split this into an array. 
        //index[0] is our command.
        //index[1] is our parameter
        input = message.split(': ');
        input[0] = input[0].toLowerCase();
        return input;
    } else {
        //fall through to final case. pass message as is on input[0]
        input = [];
        input[0] = message;
        input[1] = 'no command';
        return input;
    }

}

module.exports = parseInput;