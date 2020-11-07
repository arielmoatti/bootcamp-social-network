import React from "react";

import BioEditor from "./BioEditor";
import ProfilePic from "./ProfilePic";

export default function Profile(props) {
    return (
        <>
            <div className="profile">
                <p>
                    {props.first} {props.last}
                </p>
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
        </>
    );
}
