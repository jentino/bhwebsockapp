// "use strict";
/////////////////////////////////////////////////////////////////////// LOCAL NODEJS SERVER for browser clients
/////////////////////////////////////////////////////////////////////// LOCAL NODEJS SERVER for browser clients
/////////////////////////////////////////////////////////////////////// LOCAL NODEJS SERVER for browser clients
/**
 * Define WebSocket/HTTP Dependencies
 */
var webSocketServer = require('websocket').server;
var http = require('http');
/**
 * Define WebSocket Server Port
 */
var webSocketsServerPort = 1337;
/**
 * Create HTTP Service.
 */
var server = http.createServer(function(request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});

server.listen(webSocketsServerPort, function() {
  console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

var wsServer = new webSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

startServerClock();
/**
* LOCAL NODEJS WebSocket Operations
*/

//////////////////////////////////////////////////// LOCAL LOGIN
//////////////////////////////////////////////////// LOCAL LOGIN
//////////////////////////////////////////////////// LOCAL LOGIN

var connectionLocal;
//var connectedClientsCount = 0;
//var connectedClients = [];
  
(function(global) {
	var connections = {};
	global.getConnections = function() {return connections;};
})(global);


wsServer.on('request', function(request) {

  console.log((new Date()) + ' Connection requested from origin ' + request.origin + '.');

  connectionLocal = request.accept(null, request.origin);

  var sid =  "IP." + request.remoteAddress + "-" + (new Date()).getTime() + Math.random() * 100;
  var connections = getConnections();
  connections[sid] = connectionLocal;
  connectedClientsCount++;
  connectedClients.push(sid);
  console.log((new Date()) + ' Connection accepted. (connected: ' + connectedClientsCount + ' - sid length: ' +  connectedClients.length + '  -  current sid: '  +  sid + ')');  

  //////////////////////////////////////////////////// LOCAL RECEIVER
  //////////////////////////////////////////////////// LOCAL RECEIVER
  //////////////////////////////////////////////////// LOCAL RECEIVER
  //////////////////////////////////////////////////// LOCAL RECEIVER
  //////////////////////////////////////////////////// LOCAL RECEIVER
  //////////////////////////////////////////////////// LOCAL RECEIVER
  //////////////////////////////////////////////////// LOCAL RECEIVER
   //Receive messages(instructions) from client

  connectionLocal.on('message', function(message) {

    if (message.type === 'utf8') {  

      var jsondata = JSON.parse(message.utf8Data);

      console.log((new Date()) + ' Received Message from client ' + connectedClientsCount + " -> " + jsondata.action);
        
      if(jsondata.action === 'connect2binarycom'){

          connectToBinaryCom();
          
          console.log((new Date()) + " Binary.com connection request sent  " + connectedClientsCount); 
     
      }
      // else if(jsondata.data === 'requestBalance'){
      //   sendServerClock2Client();
      // }
    }
  });

  //Log disconnect request from client to console
  connectionLocal.on('close', function(connectionLocal) {

     if(connectedClients.indexOf(sid) != -1){
       var removeclient = connectedClients.indexOf(sid);
       connectedClients.shift(removeclient);
       // connections.shift(sid);
       connectedClientsCount--;
    }
    console.log((new Date()) + " Client " + connectedClientsCount +  " disconnected.");
  });
  //Send server timer to client
});

//////////////////////////////////////////////////// LOCAL SENDER
//////////////////////////////////////////////////// LOCAL SENDER
//////////////////////////////////////////////////// LOCAL SENDER

var tick = 0;
var serverlocaltimer;
var sendmetimer;

function sendToWebCLient(receivedbalance){

  connectionLocal.sendUTF(JSON.stringify({ type: 'bobalanceupdate', data: receivedbalance} ));

}

function disconnectmaster() {
  connectedClients = []; 
}

function startServerClock() {
  
  serverlocaltimer = setInterval(function() {
    tick++;
    tick = tick%60;
  }, 1000);

}

// function sendServerClock2Client() {
  
//   sendmetimer = setInterval(function() {
//     connectionLocal.sendUTF(JSON.stringify({ type: 'timer', data: tick} ));
//   }, 1000);
// }

// function sendClientBalance() {
//     connectionLocal.sendUTF(JSON.stringify({ type: 'balance', data: bo_balance} ));
// }

function sendToClient(clientdata , data) {
  if(clientdata == "bo_balance"){
    connectionLocal.sendUTF(JSON.stringify({ type: clientdata, data: data} ));
  }
  else if(clientdata == "bo_fullname"){
    connectionLocal.sendUTF(JSON.stringify({ type: clientdata, data: data} ));
  }
  else if(clientdata == "Errors"){
    connectionLocal.sendUTF(JSON.stringify({ type: clientdata, data: "NO INTERNET FOUND."} ));
  }
  else if(clientdata == "serverclock"){
    sendmetimer = setInterval(function() {
      connectionLocal.sendUTF(JSON.stringify({ type: "serverclock", data: tick} ));
    }, 1000);
  }
}


function stopServerClock() {
  clearInterval(serverlocaltimer);
}
function stopSendingClientTimer() {
  clearInterval(sendmetimer);
}





/////////////////////////////////////////////////////////////////////// Websocket Client Connection to BINARY.COM
/////////////////////////////////////////////////////////////////////// Websocket Client Connection to BINARY.COM
/////////////////////////////////////////////////////////////////////// Websocket Client Connection to BINARY.COM
/////////////////////////////////////////////////////////////////////// Websocket Client Connection to BINARY.COM
/////////////////////////////////////////////////////////////////////// Websocket Client Connection to BINARY.COM


 var tokenmaster = 'z1LSl9sAHnQsGP0';
 var appidmaster = '10881';

// var tokenmaster = 'eXl5FaHcDVEmwI5';
// var appidmaster = '11135';

// var tokenmaster = '1nQOWj5XA8DiC8K'; //carlu demo
// var appidmaster = '11043';

// var tokenmaster = 'uvegWYBfgYOQPj8'; //jentu demo
// var appidmaster = '11935';

var connectedClientsCount = 0; // ADDED
var connectedClients = []; // ADDED
var connectionRemote;
// var msg = require('./testend.js');
// console.log(msg.SimpleMessage);
var js;
var bo_balance = 0;
var bo_fullname = 0;


//define websocket dependency
var WebSocketClient = require('websocket').client;
//create client object to connect to binary.com
var boclient = new WebSocketClient();
//throw error if client connection fails
boclient.on('connectFailed', function(error) {
    console.log((new Date()) + '' + error.toString());
    sendToClient("Errors", error.toString());
});
//client is successfully connected
boclient.on('connect', function(connectionRemote) {

  connectionRemote.on('error', function(error) {
      console.log((new Date()) + "Connection Error: " + error.toString());
  });
  connectionRemote.on('close', function() {
      console.log((new Date()) + 'echo-protocol Connection Closed');
      var bo_balance = 0;
      var bo_fullname = "";
      stopSendingClientTimer();
  });

  //////////////////////////////////////////////////// RECEIVE FROM BINARY.COM
  //////////////////////////////////////////////////// RECEIVE FROM BINARY.COM
  //////////////////////////////////////////////////// RECEIVE FROM BINARY.COM
  //////////////////////////////////////////////////// RECEIVE FROM BINARY.COM
  //////////////////////////////////////////////////// RECEIVE FROM BINARY.COM
  //////////////////////////////////////////////////// RECEIVE FROM BINARY.COM
  
  
  connectionRemote.on('message', function(message) {
      var js = JSON.parse(message.utf8Data);
      //var data = message.utf8Data.toString();
     
     // if (message.type === 'utf8') {
       // = message.utf8Data.msg_type.toString() ;

       //console.log(new Date() + " " + js.msg_type);

       if(js.msg_type === 'authorize'){
          bo_balance = js.authorize.balance;
          bo_fullname = js.authorize.fullname;
          console.log((new Date()) + " Connected Successfully ... ");
          sendToClient("serverclock",tick);
          sendToClient("bo_balance",bo_balance);
          sendToClient("bo_fullname",bo_fullname);
        }
      

      //  if(message.type === 'authorize'){
      //       sendServerClock2Client();
      //        console.log((new Date()) + ' WebSocket Client Connected' + connectionRemote.data);
      //        bo_balance = js.authorize.balance;
      //  }else {

      //       console.log((new Date()) + ' Not Connected: ' + message.type + " -> " +connectionRemote);
      //  }
      
       // bo_balance = js.authorize.balance;
      // sendToWebCLient(bo_balance);
      
      //  console.log((new Date()) + " $" + js.authorize.balance);
          // for(var i = 0;i < js.length; i++){
          //   console.log(js[i]);
     // }
      //}else if (message.type === 'balance') {
       // console.log("Your balance is $" + message.data.balance);
      // }else if (message.type === 'balance'){
      //   console.log("Received: '" + message.balance + "'");
     // }
  });
  
  //////////////////////////////////////////////////// SEND TO BINARY.COM
  //////////////////////////////////////////////////// SEND TO BINARY.COM
  //////////////////////////////////////////////////// SEND TO BINARY.COM
  //////////////////////////////////////////////////// SEND TO BINARY.COM
  //////////////////////////////////////////////////// SEND TO BINARY.COM
  //////////////////////////////////////////////////// SEND TO BINARY.COM
  

  function getAuthorized(token) {
    console.log((new Date()) + " Authorizing binary.com account ... ");
    if (connectionRemote.connected) {
      connectionRemote.send(JSON.stringify({
        authorize: token
      }));
    }
  } 

  // function getBalance() {
  //   if (connection.connected) {
  //       connection.send(JSON.stringify({
  //            balance: 1
  //           }));
  //   }
  // }

  getAuthorized(tokenmaster);
  //getBalance();
});

// client.connect('wss://ws.binaryws.com/websockets/v3?app_id='+appidmaster);
function connectToBinaryCom() {
  console.log((new Date()) + ' Connecting to binary.com...');
  boclient.connect('wss://ws.binaryws.com/websockets/v3?app_id='+appidmaster);
  //return true;
}