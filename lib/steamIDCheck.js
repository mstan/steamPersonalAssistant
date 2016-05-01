var steamIDChk = function(requestedID) {

    var requestedID = requestedID.trim(); //Trim whitespace so if STEAM_ exists, it'll be at point 0
    var splitIDArr = requestedID.split(':');


    const invalidID = 'invalid ID';
    const minSteamIDlength = 10;
    const steamIDBitMax = 1;

    //This is a 64 bit ID
    if( splitIDArr.length == 1 ) { 
        //64 bit IDs are all numbers. If this is NaN, it fails, otherwise, it's true. We're done!
        if ( parseInt(splitIDArr[0]) ) {
            return requestedID;
        } else {
            return invalidID;
        }
    }
    //Else, this is a 32-bit ID
    //If it is 3 long, it was split with the format of STEAM_X:Y:Z -- presumably
    else if ( splitIDArr[1] !== undefined || splitIDArr[2] !== undefined) { 
        //This is three parts. We need to check all three.
        //#1 - Is value 3 (splitIDArr[2]) (User ID) NaN?
        if( !parseInt(splitIDArr[2]) ) {
            return invalidID;
        }
        //#2 - Is value 2 (splitIDArr[1]) a number
        else if( splitIDArr[1].length !== 1 ) {
            return invalidID;
        }
        //Is value 2 NaN?
        else if( !!parseInt(splitIDArr[1]) ) {
            return invalidID;           
        }
        //We crash if this universe number is greater than 1
        else if ( splitIDArr[1] > steamIDBitMax) {
            return 'invalid ID';
        }
        //We made it this far. Let's check splitIDArr[0]. Presumably STEAM_X
        //We need it to be one digit only. So, check if it is 7 char long (STEAM_ = 6) + 1 digit.
        else if ( splitIDArr[0].length !== 7) {
            return 'invalid ID';
        }
        else { // okay, it passed those checks. one more check
            var isSTEAMchk = splitIDArr[0].slice(0,splitIDArr[0].length - 1); //start from the beginning and take length - 1
            var universeDigit = splitIDArr[0][6]

            if(isSTEAMchk == 'STEAM_') {
                return requestedID;
            } 
            else if ( !parseInt(universeDigit) ) {
                return requestedID;
            }
            else {
                return requestedID;
            }
        } 
    } else {
        return requestedID;
    } // end else-if of splitIDarr[1] and splitIDArr[2] are undefined

}


module.exports = steamIDChk;