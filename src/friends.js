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
    let pendings = useSelector((state) => state.myRequests && state.myRequests);

    useEffect(() => {
        dispatch(getList());
    }, []);
    //making sure that empty arrays appear falsy and filtered out (hide sections)
    friends && friends.length == 0 && (friends = null);
    wannabes && wannabes.length == 0 && (wannabes = null);
    pendings && pendings.length == 0 && (pendings = null);

    return (
        <>
            <div id="friendsList-wrapper">
                <h1>manage your friendships and requests</h1>
                {!friends && !wannabes && !pendings && (
                    <h1>no friendships to show...</h1>
                )}
                {friends && (
                    <div className="friends-container">
                        <h2>your current friends</h2>
                        <div className="items">
                            {friends.map((friend) => (
                                <div className="member" key={friend.id}>
                                    <p>
                                        {friend.first} {friend.last}
                                    </p>
                                    <Link to={`/user/${friend.id}`}>
                                        <div className="img-container">
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
                                        </div>
                                    </Link>
                                    <div className="buttons">
                                        <button
                                            name="friendship"
                                            onClick={() =>
                                                dispatch(unfriend(friend.id))
                                            }
                                        >
                                            unfriend
                                            <span>&nbsp;&nbsp;</span>
                                            <i className="fas fa-user-slash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {wannabes && (
                    <div className="wannabes-container">
                        <h2>members who wish to befriend you</h2>
                        <div className="items">
                            {wannabes.map((wannabe) => (
                                <div className="member" key={wannabe.id}>
                                    <p>
                                        {wannabe.first} {wannabe.last}
                                    </p>
                                    <Link to={`/user/${wannabe.id}`}>
                                        <div className="img-container">
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
                                        </div>
                                    </Link>
                                    <div className="buttons">
                                        <button
                                            name="friendship"
                                            onClick={() =>
                                                dispatch(accept(wannabe.id))
                                            }
                                        >
                                            accept
                                            <span>&nbsp;&nbsp;</span>
                                            <i className="fas fa-thumbs-up"></i>
                                        </button>
                                        <button
                                            name="friendship"
                                            onClick={() =>
                                                dispatch(reject(wannabe.id))
                                            }
                                        >
                                            reject
                                            <span>&nbsp;&nbsp;</span>
                                            <i className="fas fa-thumbs-down"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {pendings && (
                    <div className="pendings-container">
                        <h2>your pending friendship requests</h2>
                        <div className="items">
                            {pendings.map((pending) => (
                                <div className="member" key={pending.id}>
                                    <p>
                                        {pending.first} {pending.last}
                                    </p>
                                    <Link to={`/user/${pending.id}`}>
                                        <div className="img-container">
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
                                        </div>
                                    </Link>
                                    <div className="buttons">
                                        <button
                                            name="friendship"
                                            onClick={() =>
                                                dispatch(cancel(pending.id))
                                            }
                                        >
                                            cancel
                                            <span>&nbsp;&nbsp;</span>
                                            <i className="fas fa-window-close"></i>
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
