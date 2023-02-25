const port = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer();
server.listen(port);
console.log('listening');

const wsServer = new webSocketServer({
    httpServer:server
});


// program to generate random strings

const getString = () => {
    const tag1 = Math.random().toString(36).substring(2,7);
    const tag2 = Math.random().toString(36).substring(2,7);
    const tag3 = Math.random().toString(36).substring(2,7);
    const number1 = (Math.random()*1000).toFixed(2);
    const number2 = (Math.random()*1000).toFixed(2);
    return  {Tag1: tag1, Tag2: tag2,Tag3: tag3, Metric1: number1, Metric2: number2};

}

const sendData = (connection) => {
    const result = getString();
    setTimeout(() => {
        connection.send(JSON.stringify(result));
        sendData(connection);
    },1000)

}
wsServer.on('request', (request) => {
    console.log('request received');
    const connection = request.accept(null, request.origin);
    connection.on('message', (message) => {
            console.log(message);
            sendData(connection);
    })
})

