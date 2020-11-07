import React from "react";
import axios from "./axios";

import ProfilePic from "./ProfilePic";
import Uploader from "./uploader";
import Profile from "./profile";
import Logo from "./Logo";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
        };
        this.methodInApp = this.methodInApp.bind(this);
        this.methodInAppBio = this.methodInAppBio.bind(this);
    }

    componentDidMount() {
        (async () => {
            try {
                let response = await axios.post("/user");
                const { first, last, p_pic_url, bio } = response.data.rows;
                this.setState({
                    first: first,
                    last: last,
                    profilePicUrl: p_pic_url,
                    bio: bio,
                });
            } catch (err) {
                console.log("error in axios POST /user: ", err);
            }
        })();
    }

    toggleUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    methodInAppBio(arg) {
        this.setState({ bio: arg });
    }

    methodInApp(arg) {
        this.setState({ profilePicUrl: arg });
        this.toggleUploader();
    }

    render() {
        return (
            <>
                <header>
                    <Logo />
                    <ProfilePic
                        first={this.state.first}
                        last={this.state.last}
                        key={this.state.profilePicUrl}
                        profilePicUrl={this.state.profilePicUrl}
                        toggleUploader={() => this.toggleUploader()}
                    />
                </header>

                <Profile
                    first={this.state.first}
                    last={this.state.last}
                    profilePicUrl={this.state.profilePicUrl}
                    bio={this.state.bio}
                    methodInAppBio={this.methodInAppBio}
                />

                {this.state.uploaderIsVisible && (
                    <Uploader
                        methodInApp={this.methodInApp}
                        profilePicUrl={this.state.profilePicUrl}
                    />
                )}
            </>
        );
    }
}
