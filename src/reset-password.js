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

    submitReset() {
        axios
            .post("/password/reset/start", this.state)
            .then((response) => {
                // console.log("response", response);
                if (response.data.success) {
                    //then continue to the next step

                    this.setState({
                        step: "provideCodePW",
                    });
                    this.clearErrMsg();
                } else {
                    //show error message
                    this.setState({
                        error: true,
                        message: response.data.message,
                    });
                }
            })
            .catch((e) =>
                console.log("error in axios post /password/reset/start", e)
            );
    }

    getCurrentDisplay() {
        const step = this.state.step;
        if (step == "provideEmail") {
            return (
                <div className="formContainer">
                    <h1>please enter your email</h1>
                    <input
                        name="email"
                        placeholder="Email Address *"
                        autoComplete="off"
                        onChange={(e) => this.handleChange(e)}
                        onClick={() => this.clearErrMsg()}
                    ></input>
                    <button name="submit" onClick={() => this.submitReset()}>
                        send email
                    </button>
                    {this.state.error && (
                        <h1 className="errMsg">{this.state.message}</h1>
                    )}
                </div>
            );
        } else if (step == "provideCodePW") {
            return (
                <div className="formContainer">
                    <h3>
                        recovery email was sent! please check your mailbox for
                        instructions and fill out these fields
                    </h3>
                    <input
                        name="secretCode"
                        placeholder="Recovery Code *"
                        autoComplete="off"
                        onChange={(e) => this.handleChange(e)}
                        onClick={() => this.clearErrMsg()}
                    ></input>
                    <input
                        name="password"
                        placeholder="New Password *"
                        autoComplete="off"
                        type="password"
                        onChange={(e) => this.handleChange(e)}
                        onClick={() => this.clearErrMsg()}
                    ></input>
                    <button name="submit" onClick={() => this.submit()}>
                        reset password
                    </button>
                    {this.state.error && (
                        <h1 className="errMsg">{this.state.message}</h1>
                    )}
                </div>
            );
        } else {
            return (
                <div className="formContainer">
                    <h1>password reset successfully!</h1>
                    <div className="formLower">
                        <h3>now you can go ahead</h3>
                        <h3>
                            and <Link to="/login"> log in</Link>
                        </h3>
                    </div>
                </div>
            );
            //...........
        }
    }

    render() {
        return <div> {this.getCurrentDisplay()} </div>;
    }
}
