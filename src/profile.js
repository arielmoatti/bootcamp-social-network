import React from "react";

import BioEditor from "./BioEditor";
import ProfilePic from "./ProfilePic";

export default function Profile(props) {
    // console.log("props", props);
    return (
        <>
            <div className="profile">
                <h1>THIS IS PROFILE COMPONENT</h1>
                <p>This is {props.first}'s profile</p>
                <ProfilePic url={props.profilePicUrl} />
                <BioEditor />
            </div>
        </>
    );
}
