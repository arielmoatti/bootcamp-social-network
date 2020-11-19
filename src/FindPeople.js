import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [userSearch, setUserSearch] = useState("");
    const [empty, setEmpty] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                let { data } = await axios.get("/api/users");
                setUsers(data);
            } catch (err) {
                console.log("error in axios GET /users: ", err);
            }
        })();
    }, []);

    useEffect(() => {
        let abort;
        (async () => {
            try {
                let { data } = await axios.get(`/api/users/${userSearch}`);
                if (data.length == 0) {
                    setUsers(data);
                    setEmpty(true);
                } else {
                    if (!abort) {
                        setUsers(data);
                        setEmpty(false);
                    } else {
                        console.log("aborted!");
                    }
                }
            } catch (err) {
                console.log("error in axios GET /user/search: ", err);
            }
        })();
        return () => {
            abort = true; //to make sure the results come in the right order, ignoring fast typing
        };
    }, [userSearch]);

    return (
        <div className="lastThreeContainer profileContainer">
            <h1>check out our three most recent members</h1>
            <h3>or if you wish to search for someone, type their name below</h3>
            <input
                autoComplete="off"
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="type member name here..."
            ></input>
            <div>
                {users &&
                    users.map((user) => (
                        <div key={user.id}>
                            <div className="profileInner">
                                <Link to={`/user/${user.id}`}>
                                    <img
                                        className="profilePicture"
                                        src={
                                            user.avatar ||
                                            "/fallback-profile.png"
                                        }
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src =
                                                "/fallback-profile.png";
                                        }}
                                        alt={`${user.first} ${user.last}`}
                                    />
                                </Link>
                                <h3>
                                    {user.first} {user.last}
                                </h3>
                            </div>
                        </div>
                    ))}
                {empty && <h2>no results found</h2>}
            </div>
        </div>
    );
}
