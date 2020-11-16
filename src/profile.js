import React from "react";

import BioEditor from "./BioEditor";
import ProfilePic from "./ProfilePic";

export default function Profile({ first, last, profilePicUrl }, props) {
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
                    <BioEditor
                        bio={props.bio}
                        methodInAppBio={props.methodInAppBio}
                    />
                </div>
            </div>
        </>
    );
}
