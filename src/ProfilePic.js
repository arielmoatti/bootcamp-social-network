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
                className="profileImage"
                key={profilePicUrl}
                src={profilePicUrl || "/fallback-profile.png"}
                // onError={(e) => (e.target.src = "/fallback-profile.png")}
                // onError={(e) => {
                //     e.target.onerror = null;
                //     e.target.src = "/fallback-profile.png";
                // }}
                alt={`${first} ${last}`}
                onClick={toggleUploader}
            />
        </>
    );
}
