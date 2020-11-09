import React from "react";
import axios from "./axios";
import { BrowserRouter, Route } from "react-router-dom";

import ProfilePic from "./ProfilePic";
import Uploader from "./uploader";
import Profile from "./profile";
import Logo from "./Logo";
import OtherProfile from "./OtherProfile";

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
                let response = await axios.post("/api/user");
                const { id, first, last, avatar, bio } = response.data.rows;
                this.setState({
                    id: id,
                    first: first,
                    last: last,
                    profilePicUrl: avatar,
                    bio: bio,
                });
            } catch (err) {
                console.log("error in axios POST /api/user: ", err);
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
            <BrowserRouter>
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

                <div id="profileRoute">
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                id={this.state.id}
                                first={this.state.first}
                                last={this.state.last}
                                profilePicUrl={this.state.profilePicUrl}
                                bio={this.state.bio}
                                methodInAppBio={this.methodInAppBio}
                            />
                        )}
                    />
                    <Route
                        path="/user/:id"
                        render={(props) => (
                            <OtherProfile
                                id={this.state.id}
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                </div>

                {this.state.uploaderIsVisible && (
                    <Uploader
                        methodInApp={this.methodInApp}
                        profilePicUrl={this.state.profilePicUrl}
                    />
                )}
            </BrowserRouter>
        );
    }
}
