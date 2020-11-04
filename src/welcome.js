import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";

export default function Welcome() {
    return (
        <div>
            <img src="/coffee_background.jpg" className="bgImg"></img>
            <div className="topLeft">
                <img src="/cool_beans_transp.png" className="logo"></img>
                <h1 className="title">nerdy coffee talks</h1>
            </div>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
