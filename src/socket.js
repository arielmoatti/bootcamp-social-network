import * as io from "socket.io-client";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
        /*
        //receiving a message from server
        //first arg is the name of the event, what's in the string
        //second is a callback function
        socket.on("welcome", (msg) => {
            console.log("socket message is: ", msg);
        });

        //listening to the io.emit
        socket.on("messageWithIoEmit", (payload) => {
            console.log("payload from message sent io emit", payload);
        });

        socket.on("broadcastEmitTest", (data) => {
            console.log("broadcastEmitTest data: ", data);
        });

        //sending message from cliecnt to server. This is the only method that can be used on both sides
        socket.emit("messageFromClient", [1, 2, 3]);
        */
    }
};
