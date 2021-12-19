/* All winning combinations  */

let WinConds = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
];

let playerX = ""; /* entered name of X  */
let playerO = ""; /* entered name of O */
let started = false; /* game is not started yet */
let X_turn = true; /* X will make first move */
let X_moves = []; /*push clicked box's no. by X into X_moves */
let O_moves = []; /*push clicked box's no. by O into O_moves */
let totalMoves = 0;
let isGameWon = false; /* check whether game is won or not */

let boxes = document.getElementsByClassName('box'); /* Get all 9 boxes */
let inputX = document.getElementById('playerX'); /* input element for X*/
let inputO = document.getElementById('playerO'); /* input element for O */
let message = document.getElementById('message'); /* message element */
let restartButton = document.getElementById('restart');
restartButton.disabled = true;

/*intially all boxes are disabled. To make them clickable we will press start (after entering names of player) */
for (i = 0; i < boxes.length; i++) {
    boxes[i].disabled = true;
}

/*get names of players if entered  */
function getName() {
    playerX = inputX.value.toUpperCase();
    playerO = inputO.value.toUpperCase();
}

function setName() {
    inputX.value = playerX;
    inputO.value = playerO;
    /* make boxes clickable */
    if (started == false) {
        for (i = 0; i < boxes.length; i++) {
            boxes[i].disabled = false;
        }
    }
    message.innerHTML = `<b>${playerX || "X"}</b>'s move`;
    started = true;
    if (isGameWon)
        restart();
}

function clicked(currentBox) {
    /* make input disabled until game is completed */
    totalMoves++;
    inputX.disabled = true;
    inputO.disabled = true;
    restartButton.disabled = false;

    currentBox.innerText = X_turn ? "X" : "O";
    X_turn ? X_moves.push(parseInt(currentBox.value)) : O_moves.push(parseInt(currentBox.value));
    currentBox.disabled = true;
    playSound("press");
    check(X_turn, totalMoves); /*check conditions */
    X_turn = !(X_turn);
}

function check(X_turn) {
    let matchedCount;
    let matchedPattern = [];
    let totalMoves = X_moves.length + O_moves.length;
    if (X_turn) {
        if (X_moves.length >= 3) {
            WinConds.forEach((eachCond) => {
                matchedCount = 0; //assumption eachCond is subarray of X_moves
                eachCond.forEach((el) => {
                    if (X_moves.includes(el))
                        matchedCount++;
                });
                if (matchedCount == 3) {
                    matchedPattern = eachCond;
                    isGameWon = true;
                    return;
                }
            });
        }

    } else {
        if (O_moves.length >= 3) {
            WinConds.forEach((eachCond, i) => {
                matchedCount = 0;
                eachCond.forEach((el) => {
                    if (O_moves.includes(el))
                        matchedCount++;
                });
                if (matchedCount == 3) {
                    matchedPattern = eachCond;
                    isGameWon = true;
                    return;
                }
            });
        }
    }
    if (isGameWon) {

        setTimeout(() => {
            if (X_turn) {
                message.innerHTML = `HURRAY! <b>${playerX || "X"}</b> WON`;
                playSound("hurray");
            } else {
                message.innerHTML = `HURRAY! <b>${playerO || "O"}</b> WON`;
                playSound("hurray");
            }

            matchedPattern.forEach((element) => {
                document.getElementsByClassName(
                    `box ${element}`
                )[0].style.color = "#9FE649";
            });
        }, 300);
        for (i = 0; i < boxes.length; i++) {
            boxes[i].disabled = true;
        }
    } else {
        if (totalMoves == 9) {
            setTimeout(() => {
                message.innerHTML = `<b>GAME DRAWN</b>`;
                playSound("drawn");
            }, 300)

        } else {
            message.innerHTML = !X_turn ? `<b>${playerX || "X"}</b>'s move` : `<b>${playerO || "O"}</b>'s move`;
        }
    }
}

function playSound(type) {
    let audio = new Audio(`./Sounds/${type}.mp3`);
    audio.play();
}

function restart() {
    X_moves = []; /*push clicked box's no. by X into X_moves */
    O_moves = []; /*push clicked box's no. by O into O_moves */
    isGameWon = false;
    for (i = 0; i < boxes.length; i++) {
        boxes[i].innerHTML = " ";
        boxes[i].disabled = false;
        boxes[i].style.color = "black";
    }
    X_turn = true;
    message.innerHTML = `<b>${playerX || "X"}</b>'s move`;
}