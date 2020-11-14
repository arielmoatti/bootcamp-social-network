import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { getList, unfriend, accept, reject, cancel } from "./actions";

export default function Friends() {
    const dispatch = useDispatch();

    const friends = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((each) => each.accepted)
    );
    const wannabes = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((each) => each.accepted == false)
    );
    const pendings = useSelector((state) => state.myRequests);

    useEffect(() => {
        dispatch(getList());
    }, []);

    if (!friends || !wannabes || !pendings) {
        return null;
    }

    return (
        <>
            <div id="friendsAndWannabes-wrapper">
                {friends && (
                    <div className="friends-container">
                        <h2>my friends</h2>
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
                                    <div className="buttons">
                                        <button
                                            onClick={() =>
                                                dispatch(unfriend(friend.id))
                                            }
                                        >
                                            unfriend
                                        </button>
                                    </div>
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
                                                dispatch(accept(wannabe.id))
                                            }
                                        >
                                            accept
                                        </button>
                                        <button
                                            onClick={() =>
                                                dispatch(reject(wannabe.id))
                                            }
                                        >
                                            reject
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
                                    <div className="buttons">
                                        <button
                                            onClick={() =>
                                                dispatch(cancel(pending.id))
                                            }
                                        >
                                            cancel
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
