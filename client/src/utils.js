// collection of utility functions for frontend


const cell = {
    x: 0,
    y: 0,
    guessed: false,
    hasShip: false
};
let aiHits = []; //keeps track of AI's hits
let randomDir = [-1, 1, -10, 10];
let usedHits = [];
// myBoard: 10x10 array of cell objects
export const aiAttack = (myBoard, difficulty, drawnCells) => {
    let aiGuess;
    if(difficulty === 0){ //random
        aiGuess = Math.floor(Math.random() * (100));

        let alreadyGuessed = drawnCells.some((cell) => {
            return aiGuess%10+1 === cell.x && Math.floor(aiGuess/10)+1 === cell.y;
        });

        while (alreadyGuessed) {
            aiGuess = Math.floor(Math.random() * (100));
            alreadyGuessed = drawnCells.some((cell) => {
                return aiGuess%10+1 === cell.x && Math.floor(aiGuess/10)+1 === cell.y;
            });
        }

        console.log("aigiess: "+aiGuess);
    }
    else if(difficulty === 1) { //normal
        for (let i = 0; i < usedHits.length; i++) {
            console.log("used: " + usedHits[i] + " length " + usedHits.length);
        }
        for (let i = 0; i < 100; i++) {
            let hit = drawnCells.some((cell) => {
                return i % 10 + 1 === cell.x && Math.floor(i / 10) + 1 === cell.y && cell.hit;
            });
            if(hit && !usedHits.includes(i) && !aiHits.includes(i)){
                aiHits.push(i);
            }
        }
        for (let i = 0; i < aiHits.length; i++) {
            console.log("aiHits: " + aiHits[i] + " length " + aiHits.length);
        }
        let alreadyGuessed;
        if (aiHits.length > 0) {
            let dirs = 0;
            do{
                if (1) {
                    // if (aiHits.includes(aiHits[aiHits.length - 1] - 1)) { //one left of the hit
                    //     aiGuess = aiHits[aiHits.length - 1] - 1;
                    // } else if (aiHits.includes(aiHits[aiHits.length - 1] + 1)) { //one right of the hit
                    //     aiGuess = aiHits[aiHits.length - 1] + 1;
                    // } else if (aiHits.includes(aiHits[aiHits.length - 1] - 10)) { //one above the hit
                    //     aiGuess = aiHits[aiHits.length - 1] - 10;
                    // } else if (aiHits.includes(aiHits[aiHits.length - 1] + 10)) { //one below the hit
                    //     aiGuess = aiHits[aiHits.length - 1] + 10;
                    // } else { //only one hit has been landed on a ship
                    aiGuess = aiHits[aiHits.length - 1] + randomDir[dirs];
                    dirs++;
                    // }
                    console.log("aiGuess: " + aiHits[aiHits.length - 1] + " + " + randomDir[Math.floor(Math.random() * (4))]);
                }

                alreadyGuessed = drawnCells.some((cell) => {
                    return aiGuess % 10 + 1 === cell.x && Math.floor(aiGuess / 10) + 1 === cell.y;
                });
                if(aiGuess < 0 || aiGuess >= 100){
                    aiGuess = Math.floor(Math.random() * (100));
                    alreadyGuessed = drawnCells.some((cell) => {
                        return aiGuess % 10 + 1 === cell.x && Math.floor(aiGuess / 10) + 1 === cell.y;
                    });
                    while (alreadyGuessed) {
                        aiGuess = Math.floor(Math.random() * (100));
                        alreadyGuessed = drawnCells.some((cell) => {
                            return aiGuess%10+1 === cell.x && Math.floor(aiGuess/10)+1 === cell.y;
                        });
                    }
                }

                if(dirs === 4) {
                    //console.log("nuts");
                    for(let i = 0; i < aiHits.length; i++){
                        if(!usedHits.includes(aiHits[i]))
                            usedHits.push(aiHits[i]);
                    }
                    console.log("popped: " + aiHits.pop());

                    //aiGuess = Math.floor(Math.random() * (100));
                    alreadyGuessed = drawnCells.some((cell) => {
                        return aiGuess%10+1 === cell.x && Math.floor(aiGuess/10)+1 === cell.y;
                    });
                    while (alreadyGuessed) {
                        aiGuess = Math.floor(Math.random() * (100));
                        alreadyGuessed = drawnCells.some((cell) => {
                            return aiGuess%10+1 === cell.x && Math.floor(aiGuess/10)+1 === cell.y;
                        });
                    }
                }
                console.log("dirs: " + dirs);
                // if(myBoard[aiGuess].guessed === false && myBoard[aiGuess].hasShip === true) {
                //     aiHits[aiHits.length - 1].used == true;
                //     aiHits.push(aiGuess);
                //     break;
                // }
                // else if(myBoard[aiGuess].guessed === false)
                //     break
                console.log("aiguessed..." + aiGuess);
            }while(alreadyGuessed && dirs < 4 && aiGuess >= 0 && aiGuess < 100);
        }
        else {
            aiGuess = Math.floor(Math.random() * (100));
            alreadyGuessed = drawnCells.some((cell) => {
                return aiGuess%10+1 === cell.x && Math.floor(aiGuess/10)+1 === cell.y;
            });
            while (alreadyGuessed) {
                aiGuess = Math.floor(Math.random() * (100));
                alreadyGuessed = drawnCells.some((cell) => {
                    return aiGuess%10+1 === cell.x && Math.floor(aiGuess/10)+1 === cell.y;
                });
            }
        }
    }
        // else
        //     while(1) {
        //         aiGuess = Math.random() * (100);
        //         if(myBoard[aiGuess].guessed === false)
        //             break;
        //     }

    let x = aiGuess % 10;
    let y = Math.floor(aiGuess / 10);
    return {x: x+1, y: y+1, hit: false};
};


export const checkIfHit = (opponentBoard, guess) => {
    return opponentBoard[guess.x][guess.y].hasShip;
};

// returns string in form "A1" given coordinates of click
export const getCell = (x,y, width, height) => {
    // width and height are 660
};


export const placeAiShips = () => {
    // return array of cells to be added to state in other component
    // (x,y) where x is number for A-J and y is number for 1-10

    let cells = [];
    // 5,4,3,3,2
    // gen random number for start and random direction (avoid collisions)
    let horiz;
    // (col, row)
    // gen (4,3) where 4 == D and 3 == '3'
    // (4,3) == D4
    // return array of (col, row)

    // for all ships
    // how to prevent repeat

    let highest = 5;
    let repeating3 = false;
    for (let i = 5; i > 1; i--) {
        horiz = Math.random() >= 0.5;
        const maxX = horiz ? highest : 9;
        const maxY = horiz ? 9 : highest;
        highest++;
        const startX = Math.floor(Math.random() * Math.floor(maxX));
        const startY = Math.floor(Math.random() * Math.floor(maxY));

        let inc = 0;
        let duplicate = false;

        for (let j = 0; j < i; j++) {
            if (horiz) {
                // if ANY contained in cells, break and i++
                if (cells.some(cell => cell.col === startX+inc+1 && cell.row === startY)) {
                    duplicate = true;
                }
            } else {
                if (cells.some(cell => cell.col === startX && cell.row === startY+inc)) {
                    duplicate = true;
                }
            }
            inc++;
        }

        if (duplicate){
            i++;
            duplicate = false;
            continue;
        }

        inc = 0;
        for (let j = 0; j < i; j++) {
            // if horiz, push cells where x++
            if (horiz) {
                cells.push({col:startX+inc+1, row:startY});
            } else {
                cells.push({col:startX, row:startY+inc});
            }
            inc++;
        }
        if (i === 3 && !repeating3) {
            repeating3 = true;
            i++;
        }
    }

    console.log(JSON.stringify(cells, null, 2));
    console.log("len of cells: "+ cells.length);

    return cells;
}


// changes coordinate (ex: 300,300) to string (ex: C5)
export const convertCoordToStr = (x, y, boardLength) => {
    // assumes 10 by 10 board
    let row = Math.floor(x / ((boardLength - boardLength/11) / 10));
    let col = Math.floor(y / ((boardLength - boardLength/11) / 10));

    // convert 1 to A, 2 to B, etc
    let rowLetter = (row + 9).toString(36).toUpperCase();

    // "B3"
    return rowLetter+''+col;
};



export const checkUserAndPw = async (username, password) => {
    // local url only
    const url = 'http://localhost:8080/api/auth';
    const obj = {
        username: username,
        password: password
    }
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'Application/json',
        }
    });

    if(response.status === 500){
        return 'Server error when logging in';
    }

    // response.json will be:
    // {loggedIn, username}
    return response.json();
}

export const createUserInDb = async (username, password) => {
    const url = 'http://localhost:8080/api/createUser';
    const obj = {
        username: username,
        password: password
    };

    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'Application/json',
        }
    });

    if(response.status === 500){
        return 'Server error when creating user';
    }

    return response.json();
}