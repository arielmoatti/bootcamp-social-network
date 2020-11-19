import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {};
        // this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
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
            <>
                <div className="formContainer">
                    <h1>welcome to cool beans!</h1>
                    <h3>
                        please take a moment to
                        <br />
                        register with us
                    </h3>

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
                    <button name="submit" onClick={() => this.submit()}>
                        register
                    </button>
                    {this.state.error && (
                        <h1 className="errMsg">{this.state.message}</h1>
                    )}
                    <div className="formLower">
                        <h3>already a member? then please</h3>
                        <Link to="/login">
                            <button>log in</button>
                        </Link>
                    </div>
                </div>
            </>
        );
    }
}
