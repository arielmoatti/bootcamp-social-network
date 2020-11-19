import React from "react";

export default function ProfilePic({
    first,
    last,
    profilePicUrl,
    toggleNavBar,
}) {
    let alert = () => {
        console.log("change photo!");
    };
    return (
        <>
            <img
                className="profileImage"
                key={profilePicUrl}
                src={profilePicUrl || "/fallback-profile.png"}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/fallback-profile.png";
                    e.target.id = "fallback";
                    alert();
                }}
                alt={`${first} ${last}`}
                onClick={toggleNavBar}
            />
        </>
    );
}
