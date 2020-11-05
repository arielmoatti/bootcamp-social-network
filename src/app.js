import React from "react";
import ProfileIcon from "./profile-icon";
import Uploader from "./uploader";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            first: "Ariel",
            last: "Moatti",
            imgUrl: null,
            uploaderVisible: false,
        };
    }

    componentDidMount() {
        // console.log("App just mounted");
        // axios here
    }

    toggleUploader() {
        this.setState({
            uploaderVisible: !this.state.uploaderVisible,
        });
    }

    methodInApp(arg) {
        console.log("running in App");
        console.log("the arg passed:", arg);
        //must bind this! because we didn't wrap it in a function
    }

    render() {
        return (
            <>
                {/* <Logo /> */}
                <h1>here is the App component</h1>
                <ProfileIcon
                    first={this.state.first}
                    last={this.state.last}
                    imgUrl={this.state.imgUrl}
                />
                <h2 onClick={() => this.toggleUploader()}>
                    click here to upload
                </h2>
                {this.state.uploaderVisible && (
                    <Uploader methodInApp={this.methodInApp} />
                )}
            </>
        );
    }
}
