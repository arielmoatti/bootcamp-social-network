import React from "react";
import { HashRouter, Route } from "react-router-dom";

import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./reset-password";

export default function Welcome() {
    return (
        <div id="welcome-container">
            <img src="/coffee_background.jpg" className="bgImg"></img>
            {/* <div className="welcome-wrap"> */}
            {/* <div className="topLeft"> */}
            {/* <img src="/cool_beans_transp.png" id="logo"></img> */}
            {/* <h1 className="title">nerdy coffee talks</h1> */}
            {/* </div> */}
            <HashRouter>
                <div id="welcomeElement">
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset-password" component={ResetPassword} />
                </div>
            </HashRouter>
            {/* </div> */}
        </div>
    );
}
