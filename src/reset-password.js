import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.state.step = "provideEmail";
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    clearErrMsg() {
        this.setState({ error: false });
    }

    submitEmail() {
        axios
            .post("/password/reset/start", this.state)
            .then((response) => {
                if (response.data.success) {
                    this.setState({
                        step: "provideCodePW",
                    });
                    this.clearErrMsg();
                } else {
                    this.setState({
                        error: true,
                        message: response.data.message,
                    });
                }
            })
            .catch((err) =>
                console.log("error in axios post /password/reset/start", err)
            );
    }

    submitNewPw() {
        axios
            .post("/password/reset/verify", this.state)
            .then((response) => {
                if (response.data.success) {
                    this.setState({
                        step: "",
                    });
                    console.log("phase 1 completed");
                    // this.clearErrMsg();
                } else {
                    this.setState({
                        error: true,
                        message: response.data.message,
                    });
                }
            })
            .catch((err) =>
                console.log("error in axios post /password/reset/verify", err)
            );
    }

    getCurrentDisplay() {
        const step = this.state.step;
        if (step == "provideEmail") {
            return (
                <div className="formContainer">
                    <h1>forgot your password?</h1>
                    <h2>please enter your email</h2>
                    <input
                        name="email"
                        placeholder="Email Address *"
                        autoComplete="off"
                        onChange={(e) => this.handleChange(e)}
                        onClick={() => this.clearErrMsg()}
                    ></input>
                    <button name="submit" onClick={() => this.submitEmail()}>
                        send email
                    </button>
                    {this.state.error && (
                        <h1 className="errMsg">{this.state.message}</h1>
                    )}
                    <div className="formLower">
                        <h3>know your password? then please</h3>
                        <Link to="/login">
                            <button> log in</button>
                        </Link>
                    </div>
                </div>
            );
        } else if (step == "provideCodePW") {
            return (
                <div className="formContainer">
                    <h3>email was sent! </h3>
                    <p>
                        please check your mailbox for the recovery code, and
                        fill out these fields
                    </p>
                    <input
                        name="secretCode"
                        placeholder="Recovery Code *"
                        autoComplete="off"
                        key={this.state.step}
                        onChange={(e) => this.handleChange(e)}
                        onClick={() => this.clearErrMsg()}
                    ></input>
                    <input
                        name="password"
                        placeholder="New Password *"
                        autoComplete="off"
                        key={this.state.step}
                        type="password"
                        onChange={(e) => this.handleChange(e)}
                        onClick={() => this.clearErrMsg()}
                    ></input>
                    <button name="submit" onClick={() => this.submitNewPw()}>
                        reset password
                    </button>
                    {this.state.error && (
                        <h3 className="errMsg">{this.state.message}</h3>
                    )}
                </div>
            );
        } else {
            return (
                <div className="formContainer">
                    <h1>password reset successfully!</h1>
                    <div className="formLower">
                        <p>
                            now you can go ahead
                            <br />
                            and log in with your new password
                        </p>
                        <Link to="/login">
                            <button>log in</button>
                        </Link>
                    </div>
                </div>
            );
        }
    }

    render() {
        return <div> {this.getCurrentDisplay()} </div>;
    }
}
