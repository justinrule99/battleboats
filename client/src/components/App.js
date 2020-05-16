import React from 'react';
import '../styles/App.css';
import styled from 'styled-components';
import P5Board from "./P5Board";
import { Button } from "react-bootstrap";
import SignIn from "./SignIn";

const WelcomeText = styled.h1`
    color: #f7f7ff;
    font-size: calc(40px + 5vmin);
`;

class App extends React.Component {

    constructor(props) {
        super(props);
        this.handleSignedInChange = this.handleSignedInChange.bind(this);
    }

    state = {
        inQuickStart: false,
        opponentType: "",
        aiDifficulty: "",
        inGame: false,
        signedIn: false,
        username: ""
    };

    handleSignedInChange = (value, user) => {
        this.setState({signedIn: value, username: user});
    }

    handleBtnClick = (button) => {

        if (button === "quickstart") {
            this.setState({inQuickStart: true, inGame: false});
        }

        if (button === "vsai" || button === "vsonline") {
            this.setState({opponentType: button});
        }
        if (button === "random" || button === "normal") {
            this.setState({aiDifficulty: button});
        }

        if (button === "start") {
            this.setState({inQuickStart: false, opponentType: "", inGame: true});
        }
    };

    render() {
        let btnClass = this.state.inQuickStart ? "selectedButton" : "nonSelected";
        let vsAiClass = this.state.opponentType === "vsai" ? "selectedButton" : "nonSelected";
        let vsOnlineClass = this.state.opponentType === "vsonline" ? "selectedButton" : "nonSelected";
        let aiRandomClass = this.state.aiDifficulty === "random" ? "selectedButton" : "nonSelected";
        let aiNormalClass = this.state.aiDifficulty === "normal" ? "selectedButton" : "nonSelected";

        return (
            <div className="App">
                <header className="App-header">
                    <WelcomeText>{"BATTLEBOATS"}</WelcomeText>
                </header>
                <div className="App-intro">
                    <SignIn onUsernameChange={this.handleSignedInChange}/>

                    <button className={btnClass} onClick={() => this.handleBtnClick( "quickstart")} >{"Quick Start"}</button>
                    {this.state.inQuickStart ?
                        <>
                            <div>
                                <button className={vsAiClass} onClick={() => this.handleBtnClick( "vsai")}>{"Play vs AI"}</button>
                                <button className={vsOnlineClass} onClick={() => this.handleBtnClick( "vsonline")}>{"Play Online"}</button>
                            </div>
                            {this.state.opponentType === 'vsai' ?
                                <div>
                                    <button className={aiRandomClass} onClick={() => this.handleBtnClick( "random")}>{"Random AI (Easy)"}</button>
                                    <button className={aiNormalClass} onClick={() => this.handleBtnClick( "normal")}>{"Normal AI (Hard)"}</button>
                                </div>
                                : null}
                            {this.state.opponentType ?
                                <button className="nonSelected" onClick={() => this.handleBtnClick( "start")}>{"Start Game"}</button>
                                : null}
                        </>
                         : null
                    }
                </div>
                {this.state.inGame ?
                    <P5Board aiDifficulty={this.state.aiDifficulty} username={this.state.username}/>
                    : null}
            </div>
        );
    }
}

export default App;
