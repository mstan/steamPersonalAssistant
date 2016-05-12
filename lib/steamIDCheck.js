var steamIDChk = function(requestedID) {

    var requestedID = requestedID.trim(); //Trim whitespace so if STEAM_ exists, it'll be at point 0
    var splitIDArr = requestedID.split(':'); //If this is a 32 bit ID, it'll a 3 part array.

    const invalidID = 'invalid ID';
    const minSteamIDlength = 10; //32-bit ID length minimum
    const steamIDBitMax = 1; //The highets value for the universe bit.

    //This is a 64 bit ID because our length of the array was 1. Presumably.
    if( splitIDArr.length == 1 ) { 
        //64 bit IDs are all numbers. If this is NaN, it fails, otherwise, it's true. We're done!
        if ( parseInt(splitIDArr[0]) ) {
            return requestedID;
        } else {
            return invalidID;
        }
    }
    //Else, this is a 32-bit ID
    //We check this by seeing that splitIDArr sub 1 and 2 are not undefined.
    else if ( splitIDArr[1] !== undefined || splitIDArr[2] !== undefined) { 
        //This is three parts. We need to check all three.
        //#1 - Is value 3 (splitIDArr[2]) (User ID) NaN?
        if( !parseInt(splitIDArr[2]) ) {
            return invalidID;
        }
        //#2 - Is value 2 (splitIDArr[1]) a number? 
        //It exists (length not equal to 0)
        //The value of our item is not greater than 1
        else if( (splitIDArr[1].length !== 1) || (isNaN(splitIDArr[1])) || (splitIDArr[1] > steamIDBitMax))  {
            return invalidID;
        }
        //We made it this far. Let's check splitIDArr[0]. Presumably STEAM_X
        //We need it to be one digit only. So, check if it is 7 char long (STEAM_ = 6) + 1 digit.
        else if ( splitIDArr[0].length !== 7) {
            return invalidID;
        }
        else { // okay, it passed those checks. one more check
            var isSTEAMchk = splitIDArr[0].slice(0,splitIDArr[0].length - 1); //start from the beginning and take length - 1
            var universeDigit = splitIDArr[0][6];

            if(!(isSTEAMchk == 'STEAM_')) { //Are the first six char in this equal to STEAM_?
                return invalidID;
            } else if ( isNaN(universeDigit) ) { //Is that universeDigit valid?
                return invalidID;
            } else {
                return requestedID;
            }
        } 
    } else {
        return requestedID;
    } // end else-if of splitIDarr[1] and splitIDArr[2] are undefined

}


module.exports = steamIDChk;