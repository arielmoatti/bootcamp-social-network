import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FindPeople() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        (async () => {
            // const { data } = await axios.post("/users");
            let { data } = await axios.post("/users");
            console.log("data", data);
            // setUsers(data.user);
        })();
    }, []);

    return <h1>this is FindPeople component!</h1>;
}
