import React from "react";
import { Link } from "react-router-dom";

export default function Logo() {
    return (
        <>
            <Link to="/">
                <img className="logo" src="/cool_beans_transp.png" />
            </Link>
        </>
    );
}
