import * as io from "socket.io-client";
// import { useDispatch } from "react-redux";
import { mbdbHistory, mbdbNewEntry } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("mbdbHistory", (msgs) => {
            store.dispatch(mbdbHistory(msgs));
            console.log("array to be dispatched: ", msgs);
        });

        socket.on("mbdbNewEntry", (msg) => {
            store.dispatch(mbdbNewEntry(msg));
            console.log("new msg to add to chat", msg);
        });
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
    } //end of IF block
};
