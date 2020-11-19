import React from "react";

export default function ProfilePic({
    first,
    last,
    profilePicUrl,
    toggleNavBar,
    alertBrokenImg,
}) {
    // if (!alertBrokenImg) {
    //     return null;
    // }
    return (
        <>
            <img
                className="profileImage"
                key={profilePicUrl}
                src={profilePicUrl || "/fallback-profile.png"}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/fallback-profile.png";
                    // alertBrokenImg();
                    alert(
                        "Oops... it appears like your profile picture is missing. Use the menu to upload a new one"
                    );
                }}
                alt={`${first} ${last}`}
                onClick={toggleNavBar}
            />
        </>
    );
}
