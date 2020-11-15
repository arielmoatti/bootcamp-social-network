import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { getList, unfriend, accept, reject, cancel } from "./actions";

export default function Friends() {
    const dispatch = useDispatch();

    let friends = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((each) => each.accepted)
    );
    let wannabes = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((each) => each.accepted == false)
    );
    let pendings = useSelector((state) => state.myRequests);

    useEffect(() => {
        dispatch(getList());
    }, []);

    friends && friends.length == 0 && (friends = null);
    wannabes && wannabes.length == 0 && (wannabes = null);
    pendings && pendings.length == 0 && (pendings = null);

    return (
        <>
            <div id="friendsList-wrapper">
                <h1>Friendship Status</h1>
                {friends && (
                    <div className="friends-container">
                        <h2>my friends</h2>
                        <div className="items">
                            {friends.map((friend) => (
                                <div className="member" key={friend.id}>
                                    <p>
                                        {friend.first} {friend.last}
                                    </p>
                                    <Link to={`/user/${friend.id}`}>
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
                                            alt={`${friend.first} ${friend.last}`}
                                        />
                                    </Link>
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
                                    <Link to={`/user/${wannabe.id}`}>
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
                                            alt={`${wannabe.first} ${wannabe.last}`}
                                        />
                                    </Link>
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
                                    <Link to={`/user/${pending.id}`}>
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
                                            alt={`${pending.first} ${pending.last}`}
                                        />
                                    </Link>
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
