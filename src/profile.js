import React from "react";

import BioEditor from "./BioEditor";
import ProfilePic from "./ProfilePic";

export default function Profile({
    first,
    last,
    profilePicUrl,
    bio,
    methodInAppBio,
}) {
    return (
        <>
            <div className="personalProfile profileContainer">
                <h2>
                    {first} {last}
                </h2>
                <div className="profileInner">
                    <ProfilePic
                        first={first}
                        last={last}
                        key={profilePicUrl}
                        profilePicUrl={profilePicUrl}
                    />
                    <BioEditor bio={bio} methodInAppBio={methodInAppBio} />
                </div>
            </div>
        </>
    );
}
