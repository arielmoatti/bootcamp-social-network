import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        // console.log("Uploader just mounted");
        console.log("this.props:", this.props);
        // axios here
    }

    methodInUploader() {
        this.props.methodInApp("lalala");
    }
    render() {
        return (
            <>
                <h1>here is the Uploader component</h1>
                <h2 onClick={() => this.methodInUploader()}>
                    click here to run te method in Uploader that triggers the
                    one in App
                </h2>
            </>
        );
    }
}
