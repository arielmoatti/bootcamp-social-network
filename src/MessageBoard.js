import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export default function MessageBoard() {
    const boardMessages = useSelector((state) => state && state.boardMessages);
    boardMessages && console.log("boardMessages", boardMessages);
    // for now this will always log undefined,
    // you will need to create a chat table, add a bit of dummy data, complete
    // the socket connection stuff, dispatch an action and put the chat history in
    // redux global state and THEN this const will have actual value

    const elemRef = useRef();

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
        // boardMessages &&
        //     (elemRef.current.scrollTop =
        //         elemRef.current.scrollHeight - elemRef.current.clientHeight);
    }, [boardMessages]);

    boardMessages && boardMessages.length == 0 && (boardMessages = null);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            // console.log("value in textarea: ", e.target.value);
            socket.emit("newMsgFromClient", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <>
            <div id="messageBoard">
                <div className="msgboard-innerContainer" ref={elemRef}>
                    {boardMessages && (
                        <div className="msg-items">
                            {boardMessages.map((msg) => (
                                <div className="message" key={msg.msgId}>
                                    <p className="authorName">
                                        {msg.first} {msg.last}
                                    </p>
                                    <img
                                        src={
                                            msg.avatar ||
                                            "/fallback-profile.png"
                                        }
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src =
                                                "/fallback-profile.png";
                                        }}
                                        alt={`${msg.first} ${msg.last}`}
                                    />
                                    <p className="message-box">{msg.message}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <textarea
                    autoFocus={true}
                    rows="2"
                    cols="100"
                    onKeyDown={keyCheck}
                />
            </div>
        </>
    );
}
