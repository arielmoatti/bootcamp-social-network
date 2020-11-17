import * as io from "socket.io-client";
// import { chatMessages, chatMessage } from "./actions";

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

        socket.on(
            'chatMessages',
            msgs => store.dispatch(
                chatMessages(msgs)
            )
        );

        socket.on(
            'chatMessage',
            msg => store.dispatch(
                chatMessage(msg)
            )
        );
        */
    }
    socket.on("chatHistory", (chatMsgs) => {
        console.log("last ten chat msgs", chatMsgs);
        //dispatch an action that adds the history to the redux global state
    });
    socket.on("new message to add to chat", (msg) => {
        console.log("new msg to add to chat", msg);
        //new message object, need to dispatch an action to add the object to redux global state
    });
};
