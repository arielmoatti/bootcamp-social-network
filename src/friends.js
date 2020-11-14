import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { getList, acceptFriend, unfriend } from "./actions";

// import axios from "./axios";

export default function Friends() {
    const dispatch = useDispatch();
    // const members = useSelector((state) => state.members);
    const friends = useSelector(
        (state) =>
            state.members && state.members.filter((friend) => friend.accepted)
    );
    const wannabes = useSelector(
        (state) =>
            state.members &&
            state.members.filter((wannabe) => wannabe.accepted == false)
    );
    useEffect(() => {
        dispatch(getList());
    }, []);

    if (!friends || !wannabes) {
        return null;
    }

    return (
        <>
            <div id="friendsAndWannabes-wrapper">
                {friends && (
                    <div className="friends-container">
                        <h2>your friends</h2>
                        <div className="items">
                            {friends.map((friend) => (
                                <div className="member" key={friend.id}>
                                    <p>
                                        {friend.first} {friend.last}
                                    </p>
                                    <img src={friend.avatar} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {wannabes && (
                    <div className="wannabes-container">
                        <h2>wannabes</h2>
                        <div className="items">
                            {wannabes.map((wannabe) => (
                                <div className="member" key={wannabe.id}>
                                    <p>
                                        {wannabe.first} {wannabe.last}
                                    </p>
                                    <img src={wannabe.avatar} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
