import React from "react";
import axios from "axios";

export default class Registration extends React.Component {
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
            .post("/register", this.state)
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
            .catch((e) => console.log("error in axios post /register", e));
    }

    render() {
        return (
            <div>
                <h1>please take a moment to register</h1>
                <input
                    name="firstname"
                    placeholder="First Name *"
                    autoComplete="off"
                    pattern="^[a-zA-Z ]+$"
                    onChange={(e) => this.handleChange(e)}
                    onClick={() => this.clearErrMsg()}
                ></input>
                <input
                    name="lastname"
                    placeholder="Last Name *"
                    autoComplete="off"
                    pattern="^[a-zA-Z ]+$"
                    onChange={(e) => this.handleChange(e)}
                    onClick={() => this.clearErrMsg()}
                ></input>
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
                <button onClick={() => this.submit()}>register!</button>
                {this.state.error && (
                    <h1 className="errMsg">{this.state.message}</h1>
                )}
            </div>
        );
    }
}
