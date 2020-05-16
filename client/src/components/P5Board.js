import React, {Component} from "react";
import Sketch from "react-p5";
import '../styles/App.css';
import '../styles/P5Board.css';
import styled from 'styled-components';
import {aiAttack, placeAiShips} from "../utils";
import { Button } from "react-bootstrap";


// main game board: 10x10 grid
// might refactor this to reduce use of state (suggested by react-p5 author)
// need to optimize this
// after submitting ship positions, just draw them without any computation (new sketch?)

const SidePanel = styled.div`
    height: 660px;
    width: 300px;
    background-color: #696b71;
    margin-left: 50px;
`;

const GameWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 20px;
`;

const MySketch = styled(Sketch)`
    padding: 20px;  
`;

const StartButton = styled(Button)`
    border-radius: 30px;
    background-repeat:no-repeat;
  cursor:pointer;
  overflow: hidden;
  align-items: center;
  background-color: Transparent;
`


class P5Board extends Component {
    cellSize = 60;
    // array of (x,y) in pixels that represents where user has placed a ship tile
    // should convert to "A3"
    coords = [];
    drawn = [];
    aiGuesses = [];

    state = {
        horizontal: true,
        invalidPlacement: false,
        hoverCells: [],
        drawnCells: [],
        shipsFinalized: false,
        toPlaceNext: 5,
        placing3: false,
        errorText: "",
        myTurnToGuess: false,
        aiShipLocations: [],
        hitOrMissText: "",
        myGuesses: []
    };

    // called ~30x/sec
    drawRects = (p5, coords) => {
        // remove duplicates
        if (this.state.shipsFinalized) {
            if (!this.drawn.length) {
                for (let i = 0; i < this.state.drawnCells.length; i++) {
                    let cell = this.state.drawnCells[i];
                    let alreadyDrawn = this.drawn.some(oneCell => oneCell.x === cell.x && oneCell.y === cell.y);
                    if (!alreadyDrawn) {
                        this.drawn.push({x:cell.x, y:cell.y});
                    }
                }
            }

            for (let i = 0; i < this.drawn.length; i++) {
                let cell = this.drawn[i];
                p5.rect(cell.x+15, cell.y+15, 30,30);
            }

            return;
        }

        coords.map((coord) => {
            if (coord.x > 0 && coord.y > 0) {
                p5.rect(coord.x+15, coord.y+15, 30,30);
                let alreadyInDrawn = this.state.drawnCells.some((cell) => cell.x === coord.x && cell.y === coord.y);
                if (!alreadyInDrawn) {
                    this.setState({drawnCells: [...this.state.drawnCells, {x: coord.x, y: coord.y}]});
                }
            }
        });

        // check collisions between already placed blocks and walls
        let outOfRoomX = this.state.horizontal && p5.mouseX+this.cellSize*this.state.toPlaceNext > 720;
        let outOfRoomY = !this.state.horizontal && p5.mouseY+this.cellSize*this.state.toPlaceNext > 720;
        let collision = this.state.hoverCells.some(hoverCell => this.state.drawnCells.some(drawnCell => drawnCell.x === hoverCell.x && drawnCell.y === hoverCell.y));

        if (this.state.toPlaceNext > 1) {
            if (p5.mouseX < 60 || p5.mouseY < 60 || outOfRoomX || outOfRoomY || collision) {
                p5.stroke("rgb(255,5,2)");
                this.setState({invalidPlacement:true});
            } else {
                p5.stroke("rgb(23,5,24)");
                this.setState({invalidPlacement:false});
            }
            this.state.hoverCells.map((hoverCell) => {
                const cell = this.getCellCorner(hoverCell.x, hoverCell.y);
                p5.rect(cell.x+15, cell.y+15, 30,30);
            });
        }
    };

    // returns coordinate of upper left of cell for x,y
    getCellCorner = (x, y) => {
        let snapX = Math.round(x);
        let snapY = Math.round(y);

        if (x > 0 && y > 0) {
            while (snapX % this.cellSize !== 0) {
                snapX--;
            }
            while (snapY % this.cellSize !== 0) {
                snapY--;
            }
        }
        return {
            x: snapX,
            y: snapY
        }
    };

    sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    drawBasicBoard = (p5) => {
        p5.background("rgb(243,255,242)");
        p5.stroke("rgb(0,0,0)");
        p5.fill("rgb(0,0,0)");
        for (let i = 0; i < 11; i++) {
            p5.line(0, this.cellSize*i, 660, this.cellSize*i);
            p5.line(this.cellSize*i, 0, this.cellSize*i, 660);
        }

        let charCode = 65;
        p5.textSize(20);

        for (let i = 1; i < 11; i++) {
            p5.text(i, 30, this.cellSize*i + 30);
            p5.text(String.fromCharCode(charCode), this.cellSize*i + 30, 30);
            charCode++;
        }

    }

    setup = (p5, canvasParentRef) => {
        p5.createCanvas(660,660).parent(canvasParentRef);
        p5.frameRate(20);
    };

    draw = (p5) => {
        this.drawBasicBoard(p5);

        p5.fill("rgb(255,255,255)");


        // freezes the board so we don't do unnecessary computation after ships have been placed
        if (this.state.shipsFinalized) {
            this.drawRects(p5, null);
            p5.fill("rgb(0,0,255)");

            this.aiGuesses.map((guess) => {
                if (guess.hit) p5.fill("rgb(255,0,0)");
                p5.circle(guess.x*60+30, guess.y*60+30, 30);
                p5.fill("rgb(0,0,255)");
            });
            return;
        }

        let xInc = 0;
        let yInc = 0;
        // add cell corner instead of raw value?
        const hoverCorner = this.getCellCorner(p5.mouseX, p5.mouseY);
        for (let i = 0; i < this.state.toPlaceNext; i++) {
            let alreadyHover = this.state.hoverCells.some((cell) => cell.x === hoverCorner.x+xInc && cell.y === hoverCorner.y+yInc);
            if (!alreadyHover) {
                this.setState({ hoverCells: [...this.state.hoverCells, {x: hoverCorner.x+xInc, y: hoverCorner.y+yInc}] });
            }
            if (this.state.horizontal) {
                xInc += 60;
            } else {
                yInc += 60;
            }
        }

        // 5,4,3,3,2 = 17 / 100
        this.state.hoverCells = this.state.hoverCells.filter((cell) => {
            // need to check all proper surrounding spots too
            // want condition to be true for 3 times, not just one
            const cornerCell = this.getCellCorner(cell.x, cell.y);
            // how to only include those in hover?
            let xInc = 0;
            let yInc = 0;
            for (let i = 0; i < this.state.toPlaceNext; i++) {
                if (hoverCorner.x+xInc === cornerCell.x && hoverCorner.y+yInc === cornerCell.y) {
                    return true;
                }
                if (this.state.horizontal) {
                    xInc += 60;
                } else {
                    yInc += 60;
                }
            }
            return false;
        });

        this.drawRects(p5, this.coords);
    };

    mouseClicked = (p5) => {
        if (!this.state.aiShipLocations.length) {
            this.setState({aiShipLocations: placeAiShips()});
        }
        let x = p5.mouseX;
        let y = p5.mouseY;
        console.log(this.state.hoverCells.length);
        if (x < this.cellSize || y < this.cellSize) return;

        if (this.state.toPlaceNext > 1 && !this.state.invalidPlacement){
            // pushing all hoverCells to coords: bad
            this.state.hoverCells.map((cell) => {
                // don't push if cell already in coords
                let cellAlreadyInCoords = this.coords.some((coord) =>coord.x === cell.x && coord.y === cell.y);
                if (!cellAlreadyInCoords) {
                    this.coords.push({
                        x: cell.x,
                        y: cell.y
                    });
                }

            });
            // if we just placed ship length 3, need another
            if (this.state.toPlaceNext === 3 && !this.state.placing3) {
                this.setState({
                    placing3: true,
                    errorText: ""
                });
            } else {
                this.setState({
                    toPlaceNext: this.state.toPlaceNext - 1,
                    errorText: ""
                });
            }
        } else {
            this.setState({errorText: "Error! You can't place your ship there"});
        }
    };

    keyPressed = (p5) => {
        if (p5.keyCode === 38) {
            this.setState({horizontal: !this.state.horizontal});
        }
    };

    startRealGame = () => {
        this.setState({shipsFinalized: true, myTurnToGuess: true});
        // here: generate the opponent's ai board
        // pick 5,4,3,3,2
    }

    // if game has started, show opponent's board too
    setupOpponent = (p5, canvasParentRef) => {
        // should we randomly generate the opponent's board?
        p5.createCanvas(660,660).parent(canvasParentRef);
        p5.frameRate(24);
    }

    rad = 2;
    drawOpponent = (p5) => {
        this.drawBasicBoard(p5);
        p5.stroke("rgb(0,0,0)");
        p5.fill("rgb(0,120,110)");

        // only draw last element in guesses
        if (this.state.myGuesses.length){
            const last = this.state.myGuesses[this.state.myGuesses.length-1];
            // draw all myGuesses
            this.state.myGuesses.map((guess) => {
                if (guess.hit) p5.fill("rgb(120,0,34)");
                p5.circle(guess.x+30, guess.y+30, 30);
                p5.fill("rgb(0,120,110)");
            });

            if (last.hit) {
                p5.fill("rgb(120,0,34)");
                // update a p tag with boom hit
                this.setState({hitOrMissText: "BOOM! HIT"});
                console.log("Boom HIT");
            } else {
                this.setState({hitOrMissText: "Miss"});
            }
            let radius = this.rad >= 30 ? 30 : this.rad;
            p5.circle(last.x+30, last.y+30, radius);
            this.rad+=3;
        }
    }

    mouseClickedOpponent = async (p5) => {
        if (!this.state.myTurnToGuess) return;
        // if (!this.state.myTurnToGuess) {
        //     let guess = aiAttack(null, 0, this.aiGuesses);
        //     console.log("ai guess: "+ guess.x + ", " + guess.y);
        //     this.setState({myTurnToGuess: true});
        //     return;
        // }
        //aiGuesses.length


        // given that im guessing
        // box follows mouse like ship placement
        this.rad = 0;

        let cell = this.getCellCorner(p5.mouseX, p5.mouseY);
        if (!cell.x || !cell.y) return;
        console.log("mx "+ cell.x);
        console.log("my "+ cell.y);

        // cell / board length will check against aiShips
        // find if cell.x == any aishiplocations.col*60
        cell.hit = this.state.aiShipLocations.some((aiCell) => {
            return aiCell.col*60 === cell.x && aiCell.row*60 === cell.y;
        });

        // cell.hit = Math.random() >= 0.5;
        this.setState({myGuesses: [...this.state.myGuesses, cell]});

        await this.sleep(500);

        // wait some time, then computer guess
        // get difficulty based on state of prev component
        console.log("prop diff: "+this.props.aiDifficulty);
        let difficultyInt = this.props.aiDifficulty === "random" ? 0 : 1;
        let guess = aiAttack(null, difficultyInt, this.aiGuesses);
        guess.hit = this.state.drawnCells.some((cell) => {
            return cell.x === guess.x*60 && cell.y === guess.y*60;
        });
        this.aiGuesses.push(guess);
        console.log("ai guess: "+ guess.x + ", " + guess.y);
        this.setState({myTurnToGuess: true});

    }

    render() {
        return (
            <GameWrapper>
                {this.state.shipsFinalized ?
                    <MySketch className="mySketch" setup={this.setupOpponent} draw={this.drawOpponent} mouseClicked={this.mouseClickedOpponent}/>
                    : null}
                <Sketch className="mySketch" setup={this.setup} draw={this.draw} mouseClicked={this.mouseClicked} keyPressed={this.keyPressed}/>

                <SidePanel>
                    <h2 style={{color:"white"}}>{"Welcome to Battleboats, "+this.props.username}</h2>
                    {this.state.shipsFinalized ?
                      this.state.myTurnToGuess ? <p>{"Make a guess by clicking on a cell on the opponent's board!"}</p>
                          : <p>{"Opponent is guessing..."}</p>
                        : <p>{"To begin, place your ships anywhere on the board."}</p>
                    }
                    <p>{"Total Guesses: "+this.state.myGuesses.length}</p>
                    <p>{"Fewest Guesses: N/A"}</p>
                    <button className="nonSelected" onClick={this.startRealGame}>{"Start Game"}</button>
                    <p>{this.state.hitOrMissText}</p>
                </SidePanel>
            </GameWrapper>
        );
    }
}

export default P5Board;