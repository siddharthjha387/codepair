const express = require('express');
const http = require('http');
const {Server}=require('socket.io');
const ACTIONS = require('./src/Actions');

const app=express();
const server=http.createServer(app);

const io=new Server(server);

io.on('connection',(socket)=>{
    console.log('socked connected',socket.id);
    socket.on(ACTIONS.JOIN)
});

const PORT=process.env.PORT||5000;

server.listen(PORT,()=>console.log(`Listening on port ${PORT}`))
