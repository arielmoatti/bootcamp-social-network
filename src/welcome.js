import React from "react";
import Registration from "./registration";

export default function Welcome() {
    return (
        <div>
            <img src="/coffee_background.jpg" className="bgImg"></img>
            <div className="topLeft">
                <img src="/cool_beans_transp.png" className="logo"></img>
                <h1 className="title">nerdy coffee talks</h1>
            </div>
            <div>
                <Registration />
            </div>
        </div>
    );
}
