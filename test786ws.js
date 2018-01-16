var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(8000, function() {
    console.log((new Date()) + ' Server is listening on port 8000');
});

wsServer = new WebSocketServer({
    httpServer: server,
    maxReceivedFrameSize: 0x100000,
    maxReceivedFrameSize: 0x1000000,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

(function(global) {
	var connections = {};
	global.getConnections = function() {return connections;};
})(global);

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('board', request.origin);
    var sid = request.remoteAddress + (new Date()).getTime() + Math.random() * 100;
    var connections = getConnections();
    connections[sid] = connection;
    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            var sync = JSON.parse(message.utf8Data).sync;
            for(var i in connections) {
            	if(connections.hasOwnProperty(i)) {
            		if(sync=="all" || (sync=="other" && i!=sid) || (sync=="self" && i==sid)) {
            			connections[i].sendUTF(message.utf8Data);
            		}
            	} 
            }
            //connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            console.dir(message.binaryData);
            for (var i in connections) {
            	if(connections.hasOwnProperty(i)) {
            		connections[i].sendBytes(message.binaryData);
            	}
            }
            connection.sendBytes(message.binaryData);
        }
    });

    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        connections[sid] = null;
        delete connections[sid];
    });

});