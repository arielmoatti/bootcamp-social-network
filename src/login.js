import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {};
        // this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    clearErrMsg() {
        this.setState({ error: false });
    }

    submit() {
        // console.log("about to submit");
        axios
            .post("/login", this.state)
            .then((response) => {
                if (response.data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                        message: response.data.message,
                    });
                }
            })
            .catch((e) => console.log("error in axios post /login", e));
    }

    render() {
        return (
            <div className="formContainer">
                <h1>welcome back!</h1>
                <h2>please log in</h2>
                <input
                    name="email"
                    placeholder="Email Address *"
                    autoComplete="off"
                    onChange={(e) => this.handleChange(e)}
                    onClick={() => this.clearErrMsg()}
                ></input>
                <input
                    name="password"
                    placeholder="Password *"
                    autoComplete="off"
                    type="password"
                    onChange={(e) => this.handleChange(e)}
                    onClick={() => this.clearErrMsg()}
                ></input>
                <button name="submit" onClick={() => this.submit()}>
                    log in
                </button>
                {this.state.error && (
                    <h1 className="errMsg">{this.state.message}</h1>
                )}
                <div className="formLower">
                    <h3>not yet a member? then please</h3>
                    <Link to="/">
                        <button>register</button>
                    </Link>
                    <Link to="/reset-password">
                        <button>forgot password?</button>
                    </Link>
                </div>
            </div>
        );
    }
}
