import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton({ otherId }) {
    const [buttonText, setButtonText] = useState("");
    // const [ otherId, setOtherId ] =
    // props.otherId;
    useEffect(() => {
        // let id = props.otherId;
        // console.log("id", id);

        (async () => {
            try {
                // console.log("id", id);
                let { data } = await axios.get(
                    `/api/checkFriendStatus/${otherId}`
                );
                setButtonText(data.btnText);
                // console.log("data", data);
                // console.log(props.otherId);

                // setUsers(data);
            } catch (err) {
                console.log(
                    "error in axios GET /checkFriendStatus/otherId:",
                    err
                );
            }
        })();
    }, []);

    return <button name="friendship">{buttonText}</button>;
}
