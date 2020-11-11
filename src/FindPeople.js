import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [userSearch, setUserSearch] = useState("");
    let empty = false;

    useEffect(() => {
        (async () => {
            try {
                let { data } = await axios.post("/users");
                setUsers(data);
            } catch (err) {
                console.log("error in axios POST /users:", err);
            }
        })();
    }, []);

    useEffect(() => {
        let abort;
        (async () => {
            try {
                let { data } = await axios.post(`/users/${userSearch}`);
                // console.log("data", data);
                if (data.length == 0) {
                    empty = true;
                    console.log("empty", empty);
                    console.log("data is empty array");
                }
                if (!abort) {
                    setUsers(data);
                } else {
                    console.log("aborted!");
                }
            } catch (err) {
                console.log("error in axios POST /users/search:", err);
            }
        })();
        return () => {
            abort = true;
        };
    }, [userSearch]);

    return (
        <div className="lastThreeContainer profileContainer">
            {empty && <p>no results found</p>}
            <h1>check out our recent members:</h1>
            <h3>or if you want to search for someone, type name below</h3>
            <input
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
                                        src={user.avatar}
                                        alt={`${user.first} ${user.last}`}
                                    />
                                </Link>
                                {/* <br /> */}
                                <h3>
                                    {user.first} {user.last}
                                </h3>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
