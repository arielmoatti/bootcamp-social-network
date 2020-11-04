import React from "react";
import axios from "./axios";
import Greetee from "./greetee";

export default class HelloWorld extends React.Component {
    constructor() {
        super();
        this.state = {
            name: "Ariel",
        };
    }

    componentDidMount() {
        console.log("component mounted!");
        setTimeout(() => {
            this.setState({
                name: "banana",
            });
        }, 1000);
    }

    handleClick() {
        console.log("was clicked");
        this.setState({
            name: "apple",
        });
    }

    render() {
        return (
            <>
                <h1 onClick={() => this.handleClick()}>Hello,</h1>
                <Greetee name={this.state.name} />
            </>
        );
    }
}

// export default function HelloWorld() {
//     return (
//         <>
//             <h1>Hello, World!</h1>
//             <p>first paragraph</p>
//             <p>second paragraph</p>
//             <p>third paragraph</p>
//             <p>fourth paragraph</p>
//         </>
//     );
// }
