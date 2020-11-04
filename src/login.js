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
        // console.log("e.target.value", e.target.value);
        this.setState(
            {
                [e.target.name]: e.target.value,
            }
            // () => console.log(this.state)
        );
    }

    clearErrMsg() {
        this.setState({
            error: false,
        });
    }

    submit() {
        console.log("about to submit");
        axios
            .post("/login", this.state)
            .then((response) => {
                // console.log("response", response);
                if (response.data.success) {
                    //then redirect to our webpage
                    location.replace("/");
                } else {
                    //show error message
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
                <h1>please log in</h1>
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
                    log in!
                </button>
                {this.state.error && (
                    <h1 className="errMsg">{this.state.message}</h1>
                )}
                <div className="formLower">
                    <h3>not yet a member?</h3>
                    <h3>
                        then please
                        <Link to="/"> register</Link>
                    </h3>
                    <h3>forgot your password?</h3>
                    <h3>
                        click here to
                        <Link to="/reset-password"> reset</Link>
                    </h3>
                </div>
            </div>
        );
    }
}
