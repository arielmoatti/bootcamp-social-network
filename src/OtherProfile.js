import React from "react";
import axios from "./axios";

export default class OtherProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        let otherProfileId = this.props.match.params.id;
        (async () => {
            try {
                let response = await axios.post(`/user/${otherProfileId}`);
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
                console.log("error in axios POST /user/id: ", err);
            }
        })();
    }

    render() {
        return (
            <>
                <h1>{`${this.state.first} ${this.state.last}`}</h1>
                <img
                    className="profilePicture"
                    src={this.state.profilePicUrl}
                    alt={`${this.state.first} ${this.state.last}`}
                />
                <p>{this.state.bio}</p>
            </>
        );
    }
}
