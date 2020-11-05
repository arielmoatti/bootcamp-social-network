import React from "react";

export default function ProfileIcon({ first, last, imgUrl }) {
    return (
        <>
            <h2>This is the profile icon</h2>
            <p>My name is: {first}</p>
            <img
                className="profileIcon"
                src={imgUrl || "/fallback-profile.png"}
            />
        </>
    );
}
