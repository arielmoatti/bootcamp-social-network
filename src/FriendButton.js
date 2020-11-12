import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton({ otherId }) {
    const [buttonText, setButtonText] = useState("");

    useEffect(() => {
        (async () => {
            try {
                let { data } = await axios.get(
                    `/api/checkFriendStatus/${otherId}`
                );
                setButtonText(data.btnText);
            } catch (err) {
                console.log(
                    "error in axios GET /checkFriendStatus/otherId:",
                    err
                );
            }
        })();
    }, []);

    function handleClick() {
        console.log("clicked!");
        (async () => {
            try {
                await axios.post(`/api/setFriendship/${otherId}`);
            } catch (err) {
                console.log("error in axios POST /setFriendship/otherId:", err);
            }
        })();
    }

    return (
        <button
            name="friendship"
            onClick={() => {
                handleClick();
            }}
        >
            {buttonText}
        </button>
    );
}
