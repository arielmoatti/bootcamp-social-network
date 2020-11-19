import React, { useState } from "react";

import BioEditor from "./BioEditor";
import ProfilePic from "./ProfilePic";

export default function Profile({
    first,
    last,
    profilePicUrl,
    bio,
    methodInAppBio,
}) {
    // const [brokenImg, setBrokenImg] = useState(false);
    // let alertInProfile = () => {
    //     // console.log("alertInProfile fired!");
    //     setBrokenImg(true);
    // };

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
                        // alertBrokenImg={alertInProfile}
                    />
                    <BioEditor bio={bio} methodInAppBio={methodInAppBio} />
                </div>
                {/* {brokenImg && (
                    <p className="brokenImage">
                        Oops... it appears like your profile picture is missing.
                        Click here to upload a new one
                    </p>
                )} */}
            </div>
        </>
    );
}
