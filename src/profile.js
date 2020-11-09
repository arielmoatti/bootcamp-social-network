import React from "react";

import BioEditor from "./BioEditor";
import ProfilePic from "./ProfilePic";

export default function Profile(props) {
    return (
        <>
            <div className="profileContainer">
                <h2>
                    {props.first} {props.last}
                </h2>
                <div className="profileInner">
                    <ProfilePic
                        first={props.first}
                        last={props.last}
                        key={props.profilePicUrl}
                        profilePicUrl={props.profilePicUrl}
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
