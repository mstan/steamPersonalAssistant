var importIndex = require('../index.js'),
    resource = require('../resource.js');
//This is our client from the main index
var client = importIndex.client;

var defaultResponse = function(steamID) {
    client.chatMessage(steamID, resource.userPanel.defaultMessage)
}

module.exports = defaultResponse;