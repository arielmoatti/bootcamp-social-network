import React from "react";
import Registration from "./registration";

export default function Welcome() {
    return (
        <div>
            {/* some image */}
            <h1 className="title">welcome to our social network</h1>
            <Registration />
            <p>already a member? log in...</p>
        </div>
    );
}
