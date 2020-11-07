import React from "react";

export default function ProfilePic({
    first,
    last,
    profilePicUrl,
    toggleUploader,
}) {
    return (
        <>
            <img
                className="profileIcon"
                src={profilePicUrl || "/fallback-profile.png"}
                alt={first + " " + last}
                onClick={toggleUploader}
            />
        </>
    );
}
