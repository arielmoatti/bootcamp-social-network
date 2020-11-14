import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { getList, acceptFriend, unfriend } from "./actions";

export default function Friends() {
    const dispatch = useDispatch();
    const pendings = useSelector((state) => state.myRequests);
    const friends = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((friend) => friend.accepted)
    );
    const wannabes = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((wannabe) => wannabe.accepted == false)
    );
    useEffect(() => {
        dispatch(getList());
    }, []);

    if (!pendings || !friends || !wannabes) {
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
                                    <img
                                        src={
                                            friend.avatar ||
                                            "/fallback-profile.png"
                                        }
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src =
                                                "/fallback-profile.png";
                                        }}
                                    />
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
                                    <img
                                        src={
                                            wannabe.avatar ||
                                            "/fallback-profile.png"
                                        }
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src =
                                                "/fallback-profile.png";
                                        }}
                                    />
                                    <div className="buttons">
                                        <button
                                            onClick={() =>
                                                dispatch(
                                                    acceptFriend(wannabe.id)
                                                )
                                            }
                                        >
                                            accept
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {pendings && (
                    <div className="pendings-container">
                        <h2>my pending requests</h2>
                        <div className="items">
                            {pendings.map((pending) => (
                                <div className="member" key={pending.id}>
                                    <p>
                                        {pending.first} {pending.last}
                                    </p>
                                    <img
                                        src={
                                            pending.avatar ||
                                            "/fallback-profile.png"
                                        }
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src =
                                                "/fallback-profile.png";
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
