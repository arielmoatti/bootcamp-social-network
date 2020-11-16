import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function NavBar({ first, last, profilePicUrl, toggleUploader }) {
    let logOut = async () => {
        try {
            console.log("log out fired!");
            // await axios.get("/api/logout");
            // location.replace("/welcome#/login");
        } catch (err) {
            console.log("error in axios GET /api/logout ", err);
        }
    };

    return (
        <>
            <div id="navbar">
                <Link to={"/"} className="navProf navItem">
                    <img
                        className="profileImage"
                        key={profilePicUrl}
                        src={profilePicUrl || "/fallback-profile.png"}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/fallback-profile.png";
                        }}
                        alt={`${first} ${last}`}
                    />
                    <p>
                        <strong>{`${first} ${last}`}</strong>
                    </p>
                    <p>see your profile</p>
                </Link>
                <div className="navProfPic navItem" onClick={toggleUploader}>
                    <i className="fas fa-camera"></i>
                    <p>change profile picture</p>
                </div>

                <Link to={"/users"} className="navItem">
                    <i className="fas fa-address-book"></i>
                    list of members
                </Link>
                <Link to={"/friends"} className="navItem">
                    <i className="fas fa-user-friends"></i>
                    manage your friendships
                </Link>
                <p className="navLogOut navItem" onClick={() => logOut()}>
                    <i className="fas fa-sign-out-alt"></i>
                    log out
                </p>
            </div>
        </>
    );
}
