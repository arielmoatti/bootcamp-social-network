import React from "react";
import axios from "./axios";
import { BrowserRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";

import ProfilePic from "./ProfilePic";
import Uploader from "./uploader";
import Profile from "./profile";
import Logo from "./Logo";
import OtherProfile from "./OtherProfile";
import FindPeople from "./FindPeople";
import Friends from "./friends";
import NavBar from "./NavBar";
import MessageBoard from "./MessageBoard";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
            navbarIsVisible: false,
            flagHide: false,
        };
        this.methodInApp = this.methodInApp.bind(this);
        this.methodInAppBio = this.methodInAppBio.bind(this);
    }

    componentDidMount() {
        (async () => {
            try {
                let response = await axios.get("/api/user");
                const { id, first, last, avatar, bio } = response.data.rows;
                this.setState({
                    id: id,
                    first: first,
                    last: last,
                    profilePicUrl: avatar,
                    bio: bio,
                });
            } catch (err) {
                console.log("error in axios GET /api/user: ", err);
            }
        })();
    }

    toggleUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    toggleNavBar() {
        this.setState({
            navbarIsVisible: !this.state.navbarIsVisible,
        });
    }
    showNavBar() {
        this.setState({
            navbarIsVisible: true,
        });
    }

    hideNavBar() {
        this.state.flagHide && this.setState({ navbarIsVisible: false });
    }

    hideNavbarFromItem() {
        this.setState({ navbarIsVisible: false });
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
                <div id="app-wrapper">
                    <header>
                        <Logo />
                        <div
                            id="nav-container"
                            onMouseEnter={() =>
                                this.setState({ flagHide: false })
                            }
                            onMouseLeave={() => {
                                this.setState({ flagHide: true });
                                setTimeout(() => {
                                    this.hideNavBar();
                                }, 400);
                            }}
                            // tabIndex="0"
                            // onBlur={() => this.hideNavBar()}
                        >
                            <ProfilePic
                                first={this.state.first}
                                last={this.state.last}
                                key={this.state.profilePicUrl}
                                profilePicUrl={this.state.profilePicUrl}
                                toggleNavBar={() => this.toggleNavBar()}
                            />
                            <div className="spacer"></div>
                            <NavBar
                                first={this.state.first}
                                last={this.state.last}
                                profilePicUrl={this.state.profilePicUrl}
                                toggleUploader={() => this.toggleUploader()}
                                navVisible={this.state.navbarIsVisible}
                                hideNavbarFromItem={() =>
                                    this.hideNavbarFromItem()
                                }
                            />
                        </div>
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
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/users"
                            render={() => <FindPeople />}
                        />
                    </div>

                    <Route exact path="/friends" render={() => <Friends />} />
                    <Route
                        exact
                        path="/msgboard"
                        render={() => <MessageBoard />}
                    />

                    {this.state.uploaderIsVisible && (
                        <>
                            <div className="overlay"></div>
                            <Uploader
                                methodInApp={this.methodInApp}
                                profilePicUrl={this.state.profilePicUrl}
                            />
                        </>
                    )}
                </div>
            </BrowserRouter>
        );
    }
}
