import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useDispatch, useSelector } from "react-redux";

export default function Chat() {
    const chatMessages = useSelector((state) => state.chatMessages);

    const elemRef = useRef();

    useEffect(() => {
        console.log("chat just mounted");
        console.log("elemRef", elemRef);
        console.log("scroll top", elemRef.current.scrollTop);
        console.log("client height", elemRef.current.clientHeight);
        console.log("scroll top", elemRef.current.scrollHeight);
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, []);
    const keyCheck = (e) => {
        if (e.key === "Enter") {
            // console.log("user wants to send message");
            e.preventDefault();
            console.log("value in textarea: ", e.target.value);
            //we still need to emit the message
            socket.emit("message from client", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <>
            <h1>Our chat component</h1>
            <div className="chat-display-container" ref={elemRef}>
                <p>chat message will go here</p>
                <p>chat message will go here</p>
                <p>chat message will go here</p>
                <p>chat message will go here</p>
                <p>chat message will go here</p>
                <p>chat message will go here</p>
                <p>chat message will go here</p>
                <p>chat message will go here</p>
                <p>chat message will go here</p>
                <p>chat message will go here</p>
                <p>chat message will go here</p>
                <p>chat message will go here</p>
                <p>chat message will go here</p>
                <p>chat message will go here</p>
                <p>chat message will go here</p>
                <p>chat message will go here</p>
                <p>chat message will go here</p>
                <p>chat message will go here</p>
                <p>chat message will go here</p>
                <p>chat message will go here</p>
                <p>chat message will go here</p>
            </div>
            <textarea placeholder="type here" onKeyDown={keyCheck}></textarea>
        </>
    );
}
