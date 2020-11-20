import React, { useEffect, useRef, useState } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export default function MessageBoard() {
    const boardMessages = useSelector((state) => state && state.boardMessages);
    //scroll controls
    const [scrolled, setScrolled] = useState(false);
    const [msgEntry, setMsgEntry] = useState(false);
    //message alert controls
    const [lowestNOM, setLowestNOM] = useState();
    const [currentNOM, setCurrentNOM] = useState();
    const [flagMounted, setFlagMounted] = useState(false);
    const [flagUnscrolled, setFlagUnscrolled] = useState(false);
    const [unreadMsgs, setUnreadMsgs] = useState(null);
    const elemRef = useRef();

    useEffect(() => {
        boardMessages && setFlagMounted(true); //helps set the initial length of msg array
        setMsgEntry(false); //reset flag for "no message written by current client"
        boardMessages && checkScroll();
        boardMessages && !scrolled && (scrollFn(), setScrolled(true));
        msgEntry && scrollFn(); //scrolls down with every new posted message
    }, [boardMessages]);

    useEffect(() => {
        boardMessages && setLowestNOM(boardMessages.length);
    }, [flagMounted]);

    const scrollFn = () => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
        setScrolled(true);
        setFlagUnscrolled(false); // help hide msg alert
    };

    const checkScroll = () => {
        if (
            elemRef.current.scrollHeight - 300 <=
            elemRef.current.scrollTop + elemRef.current.clientHeight
        ) {
            // console.log("user scrolled down!");
            scrollFn();
            setLowestNOM(boardMessages.length);
            setCurrentNOM(boardMessages.length + 1);
        } else {
            setFlagUnscrolled(true);
            // console.log("user scrolled up!");
            setCurrentNOM(boardMessages.length + 1);
            if (currentNOM && lowestNOM) {
                setUnreadMsgs(currentNOM - lowestNOM);
                // console.log("lowestNOM?", lowestNOM, "currentNOM?", currentNOM);
            }
        }
        // console.log(
        //     "scrollHeight",
        //     elemRef.current.scrollHeight,
        //     "scrollTop",
        //     elemRef.current.scrollTop,
        //     "clientHeight",
        //     elemRef.current.clientHeight
        // );
    };

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("newMsgFromClient", e.target.value);
            e.target.value = "";
            setMsgEntry(true);
            setLowestNOM(currentNOM);
            setUnreadMsgs(null);
        }
    };

    const showNewFn = () => {
        scrollFn();
        setUnreadMsgs(null);
        setLowestNOM(currentNOM - 1);
    };

    const dismissedFn = () => {
        setUnreadMsgs(null);
    };

    return (
        <>
            <div id="messageBoard">
                <h1>let's talk about coffee!</h1>
                <div className="msgboard-innerContainer" ref={elemRef}>
                    {boardMessages && (
                        <div className="msg-items">
                            {boardMessages.map((msg) => (
                                <div className="message" key={msg.id}>
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
                                    <p className="timestamp">
                                        [{msg.created_at.slice(11, 16)}{" "}
                                        {msg.created_at.slice(0, 10)}]
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="msgLower">
                    <div className="msgTextarea">
                        <textarea
                            autoFocus={true}
                            rows="2"
                            cols="50"
                            onKeyDown={keyCheck}
                        />
                        <p>
                            hit <strong>Enter</strong> to send
                        </p>
                    </div>
                    {unreadMsgs > 0 && flagUnscrolled && (
                        <div id="unreadBox" onClick={showNewFn}>
                            <p>{unreadMsgs}</p>
                            {/* <button onClick={showNewFn}>show me</button> */}
                            {/* <button onClick={dismissedFn}>hide</button> */}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
