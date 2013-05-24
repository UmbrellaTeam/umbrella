var Suggestion = require('../models/suggestion/Object');

/**
 * Constructor
 *
 * @param socketIo
 */
function SocketIo(socketIo, storage) {
    SocketIo.socketIo = socketIo;
    SocketIo.storage = storage;
    socketIo.sockets.on('connection', SocketIo.onConnect);
}

SocketIo.onConnect = function(socket) {
    socket.on('getSuggestion', SocketIo.getSuggestion);
};

SocketIo.getSuggestion = function(data, callback) {
    Suggestion.find(SocketIo.storage, data, callback);
};


module.exports = SocketIo;
