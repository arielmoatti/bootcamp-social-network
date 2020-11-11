import React from "react";
import axios from "./axios";
import FriendButton from "./FriendButton";

export default class OtherProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        let otherProfileId = this.props.match.params.id;
        (async () => {
            try {
                let response = await axios.get(`/api/user/${otherProfileId}`);
                if (response.data.rows && !response.data.match) {
                    // if (otherProfileId == response.data.ownId) {
                    const { first, last, avatar, bio } = response.data.rows;
                    this.setState({
                        first: first,
                        last: last,
                        profilePicUrl: avatar,
                        bio: bio,
                    });
                } else {
                    this.props.history.push("/");
                }
            } catch (err) {
                console.log("error in axios GET /user/id: ", err);
            }
        })();
    }

    render() {
        return (
            <>
                <div className="otherProfile profileContainer">
                    <h2>{`${this.state.first} ${this.state.last}`}</h2>
                    {/* <FriendButton otherId={this.state.otherId} /> */}
                    <FriendButton otherId={this.props.match.params.id} />
                    <div className="profileInner">
                        <img
                            className="profilePicture"
                            key={this.state.profilePicUrl}
                            src={
                                this.state.profilePicUrl ||
                                "/fallback-profile.png"
                            }
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/fallback-profile.png";
                            }}
                            alt={`${this.state.first} ${this.state.last}`}
                        />
                        <p className="bioText">
                            {this.state.bio || "no bio yet"}
                        </p>
                    </div>
                </div>
            </>
        );
    }
}
