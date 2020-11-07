import React from "react";
import axios from "./axios";
let formdataUrl;

export default class Uploader extends React.Component {
    constructor(props) {
        super();
        this.state = {
            imgUrl: props.profilePicUrl,
            file: null,
        };
        this.handleFileChange = this.handleFileChange.bind(this);
    }

    methodInUploader() {
        this.props.methodInApp(this.state.imgUrl);
    }

    handleFileChange(e) {
        this.setState({
            file: e.target.files[0],
        });
    }

    submit() {
        let formData = new FormData();
        formData.append("file", this.state.file);
        (async () => {
            try {
                let response = await axios.post("/upload/profilepic", formData);
                let { returnedUrl } = response.data;
                this.setState({ imgUrl: returnedUrl });
                this.methodInUploader();
            } catch (err) {
                console.log("error in axios POST unpload profilepic:", err);
            }
        })();
    }

    render() {
        return (
            <>
                <div className="uploaderModal">
                    <h2>click below to update your profile picture</h2>
                    <input
                        type="file"
                        name="file"
                        placeholder="choose image"
                        accept="image/*"
                        onChange={this.handleFileChange}
                    ></input>
                    <button onClick={() => this.submit()}>upload</button>
                </div>
            </>
        );
    }
}
