import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        (async () => {
            let { data } = await axios.post("/users");
            setUsers(data);
        })();
    }, []);

    return (
        <div className="lastThreeContainer profileContainer">
            <h1>check out our recent members</h1>
            <div>
                {users &&
                    users.map((user) => {
                        return (
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
                        );
                    })}
            </div>
        </div>
    );
}
