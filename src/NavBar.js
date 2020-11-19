import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import ProfilePic from "./ProfilePic";

export default function NavBar({
    first,
    last,
    profilePicUrl,
    toggleUploader,
    navVisible,
    hideNavbarFromItem,
}) {
    let logOut = async () => {
        try {
            console.log("log out fired!");
            await axios.get("/api/logout");
            location.replace("/welcome#/login");
        } catch (err) {
            console.log("error in axios GET /api/logout ", err);
        }
    };

    return (
        <>
            <div
                id="navbar"
                onClick={hideNavbarFromItem}
                className={navVisible ? "nav-visible" : "nav-hidden"}
            >
                <Link to={"/"} className="navProf navItem">
                    <ProfilePic
                        first={first}
                        last={last}
                        key={profilePicUrl}
                        profilePicUrl={profilePicUrl}
                    />
                    <div className="profileText">
                        <p>
                            <strong>{`${first} ${last}`}</strong>
                        </p>
                        <p>See your profile</p>
                    </div>
                </Link>

                <div className="navItem" onClick={toggleUploader}>
                    <i className="fas fa-camera"></i>
                    Change profile picture
                </div>

                <Link to={"/users"} className="navItem">
                    <i className="fas fa-search"></i>
                    Find other members
                </Link>
                <Link to={"/friends"} className="navItem">
                    <i className="fas fa-user-friends"></i>
                    Manage friendships
                </Link>
                <Link to={"/msgboard"} className="navItem">
                    <i className="fas fa-comments"></i>
                    Message board
                </Link>
                <p className="navLogOut navItem" onClick={() => logOut()}>
                    <i className="fas fa-sign-out-alt"></i>
                    Log out
                </p>
            </div>
        </>
    );
}
