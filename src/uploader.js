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
        this.submit = this.submit.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
    }

    submit() {
        this.fileUpload(this.state.file).then((response) => {
            // console.log("response from submit", response.data);
            let { url } = response.data;
            this.setState({
                imgUrl: url,
            });
            console.log("fileUpload returned promised");
            this.methodInUploader();
        });
    }

    handleFileChange(e) {
        // console.log("e.target.files[0]", e.target.files[0].name);
        // formdataUrl = e.target.files[0].name;
        // console.log("formdataUrl", formdataUrl);
        this.setState({ file: e.target.files[0] });
        // console.log("state after handleChange", this.state);
    }

    methodInUploader() {
        this.props.methodInApp(this.state.imgUrl);
    }

    fileUpload(file) {
        // console.log("state in submit", this.state);
        // console.log("file", file);
        let formData = new FormData();
        // formData.append("file", this.state.file);
        formData.append("file", file);
        // console.log("this.state.file", this.state.file);
        // console.log("formData", formData);
        return axios.post("/upload/profilepic", formData);
        /*
        (async () => {
            try {
                let response = await axios.post("/upload/profilepic", formData);
                let url = response.data.profilePicUrl;
                // // console.log(url);
                this.setState({
                    imgUrl: url,
                });
                this.methodInUploader();
            } catch (err) {
                console.log("error in axios POST /upload/profilepic: ", err);
            }
        })();
        */
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
                    <button onClick={this.submit}>upload</button>
                </div>
            </>
        );
    }
}
