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
                const { first, last, avatar, bio } = response.data.rows;
                // if (otherProfileId == response.data.ownId) {
                if (response.data.match) {
                    this.props.history.push("/");
                } else {
                    this.setState({
                        first: first,
                        last: last,
                        profilePicUrl: avatar,
                        bio: bio,
                    });
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
