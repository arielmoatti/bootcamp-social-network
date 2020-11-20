import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super();
        this.state = {
            imgUrl: props.profilePicUrl,
            file: null,
            errMsg: null,
        };
        this.handleFileChange = this.handleFileChange.bind(this);
    }

    methodInUploader() {
        this.props.methodInApp(this.state.imgUrl);
    }

    handleFileChange(e) {
        console.log("file size: ", e.target.files[0].size);
        this.setState({ errMsg: null });
        if (e.target.files[0].size > 2000000) {
            this.setState({
                errMsg: "File is too big... keep it under 2Mb",
            });
        } else {
            this.setState({
                file: e.target.files[0],
            });
        }
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
                console.log("error in axios POST /upload/profilepic:", err);
            }
        })();
    }

    render() {
        return (
            <>
                <div className="uploaderModal">
                    <button
                        name="cancel"
                        onClick={() => this.methodInUploader()}
                    >
                        x
                    </button>
                    <div className="modalInner">
                        <h2>click below to update your profile picture</h2>
                        <div className="fileButtons">
                            <label
                                htmlFor="file-upload"
                                className={
                                    this.state.file
                                        ? "file-loaded custom-file-upload"
                                        : "custom-file-upload"
                                }
                            >
                                <i className="fas fa-cloud-upload-alt">
                                    &nbsp;&nbsp;
                                </i>
                                {this.state.file
                                    ? this.state.file.name
                                    : "select file"}
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                name="file"
                                accept="image/*"
                                onChange={this.handleFileChange}
                            ></input>
                            {this.state.file && (
                                <button
                                    name="upload"
                                    onClick={() => this.submit()}
                                >
                                    upload
                                </button>
                            )}
                        </div>
                        {this.state.errMsg && (
                            <p className="errMsg">
                                <i className="fas fa-exclamation-triangle">
                                    &nbsp;&nbsp;
                                </i>
                                {this.state.errMsg}
                            </p>
                        )}
                    </div>
                </div>
            </>
        );
    }
}
