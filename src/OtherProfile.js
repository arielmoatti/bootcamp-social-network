import React from "react";
import axios from "./axios";

export default class OtherProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        //here axios request to retrieve info about the profile
        let otherProfileId = this.props.match.params.id;
        (async () => {
            try {
                let response = await axios.post(`/user/${otherProfileId}`);
                const { id, first, last, avatar, bio } = response.data.rows;
                if (this.props.match.params.id == response.data.ownId) {
                    // if (response.data.match) {
                    console.log("match! redirect");
                    this.props.history.push("/");
                } else {
                    console.log("no match, will give you all");
                }
                this.setState({
                    first: first,
                    last: last,
                    profilePicUrl: avatar,
                    bio: bio,
                });
            } catch (err) {
                console.log("error in axios POST /user/id: ", err);
            }
        })();

        //
        // console.log("this.props.match", this.props.match);
        // console.log("this.props.match.params.id", this.props.match.params.id);
        // we'll want to use this.props.match.params.id to tell our server for which user
        // we want to get information for, our server should also check and see if we are
        // trying to access our own profile, or simply send back the id of our logged
        // in user alongside the information for the one we are currently viewing,
        // if we are viewing ourself, we should be send back to the slash route
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
