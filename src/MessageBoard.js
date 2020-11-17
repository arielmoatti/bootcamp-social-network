import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export default function MessageBoard() {
    const boardMessages = useSelector((state) => state && state.boardMessages);
    console.log("boardMessages", boardMessages);
    // boardMessages && console.log("boardMessages", boardMessages);

    const elemRef = useRef();

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
        // boardMessages &&
        //     (elemRef.current.scrollTop =
        //         elemRef.current.scrollHeight - elemRef.current.clientHeight);
    }, []);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
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
                <p>
                    hit <strong>Enter</strong> to send
                </p>
            </div>
        </>
    );
}
