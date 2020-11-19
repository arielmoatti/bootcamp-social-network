import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton({ otherId }) {
    const [buttonText, setButtonText] = useState("");
    const [btnUpdate, setBtnUpdate] = useState(false);

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
    }, [btnUpdate]);

    function handleClick() {
        setBtnUpdate(false);
        (async () => {
            try {
                let { data } = await axios.post(
                    `/api/setFriendship/${otherId}`
                );
                data.success && setBtnUpdate(true);
            } catch (err) {
                console.log("error in axios POST /setFriendship/otherId:", err);
            }
        })();
    }

    return (
        <button
            name="friendshipMain"
            onClick={() => {
                handleClick();
            }}
        >
            {buttonText}
        </button>
    );
}
