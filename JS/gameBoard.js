import { getAllWinningCombinations, playSound, updateSessionStorage } from "./Utility.js";

//Declaring Game State Variable
let playerX;
let playerO;
let level;
let gameMode;
let winningCombinations = [];
let positionsOfX = [];
let positionsOfO = [];
let currentPlayer;
let maxDepth = {
    '3': 8,
    '4': 5,
    '5': 4
}

const status = document.getElementById('gameStatus');
const restartButton = document.getElementById('restart');

bindGameStateFromSessionStorage();
setUpGameBoard();
updateEntriesInGameBoard();


restartButton.addEventListener('click', (event) => {
    positionsOfX.length = 0;
    positionsOfO.length = 0;
    currentPlayer = 'X';

    status.innerHTML = `<b>${playerX}</b>'s turn`;
    const boxes = document.getElementsByClassName('box');
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].innerHTML = '';
        boxes[i].disabled = false;
    }
    updatePositionsOfPlayersInSessionStorage(positionsOfX, positionsOfO);
});



function boxClicked(selectedBox) {
    if (currentPlayer == 'X') {
        selectedBox.innerText = "X";
        positionsOfX.push(selectedBox.value);
    }
    else {
        selectedBox.innerText = "O";
        positionsOfO.push(selectedBox.value);
    }

    selectedBox.disabled = true;
    updateStyleOfEntry(selectedBox);
    updatePositionsOfPlayersInSessionStorage(positionsOfX, positionsOfO);

    if (positionsOfO.length >= level || positionsOfX.length >= level) {
        if (CheckForWin())
            return;
    }

    playSound((currentPlayer === 'X') ? 'inputByX' : 'inputByO');
    currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
    status.innerHTML = `<b>${(currentPlayer === 'X') ? playerX : playerO}</b>'s turn`;

    if ((gameMode === 'auto-player') && (currentPlayer === 'O')) {
        setTimeout(()=>{getAImove()},1000);
    }
}


function CheckForWin() {
    for (let i = 0; i < winningCombinations.length; i++) {
        let combination = winningCombinations[i];
        let missingPositions = combination.filter(position => !((currentPlayer === 'X') ? positionsOfX : positionsOfO).includes(position));
        if (missingPositions.length == 0) {
            playSound("hurray");
            status.innerHTML = `HURRAY! <b>${currentPlayer == 'X' ? playerX : playerO}</b> WON`;
            disableRemainingBoxes();
            highlightWinningCombination(combination);
            return true;
        }
    }
    return isBoardFull();
}

function disableRemainingBoxes() {
    const boxes = document.getElementsByClassName('box');
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].disabled = true;
    }
}

function highlightWinningCombination(combination) {
    for (let i = 0; i < combination.length; i++) {
        const box = document.getElementsByClassName(`box ${combination[i][0]}${combination[i][1]}`);
        box[0].style.color = '#9FE649';
    }
}

function bindGameStateFromSessionStorage() {
    if (sessionStorage.getItem('ticTacPlusGameState') !== null) {
        const state = JSON.parse(sessionStorage.getItem('ticTacPlusGameState'));
        playerX = state.playerX;
        playerO = state.playerO !== '' ? state.playerO : 'Auto Player';
        level = state.boardDimension;
        gameMode = state.gameMode;
        positionsOfX = state.playerXPositions;
        positionsOfO = state.playerOPositions;
        currentPlayer = positionsOfX.length === positionsOfO.length ? 'X' : 'O';
        winningCombinations = getAllWinningCombinations(level);
        status.innerHTML = `<b>${currentPlayer == 'X' ? playerX : playerO}</b>'s turn`;
    }
    else {
        window.location.href = 'index.html';
    }
}


function setUpGameBoard() {
    const gameBoard = document.getElementById('game-board');
    for (let i = 1; i <= level; i++) {
        for (let j = 1; j <= level; j++) {
            const box = document.createElement('button');
            box.className = `box ${i}${j}`;
            box.value = `${i}${j}`;
            box.addEventListener('click', function () {
                boxClicked(box);
            });
            gameBoard.appendChild(box);
        }
    }
    styleGameBoard();
}


function styleGameBoard() {
    let cellSize = 100; // represents width and height of a cell of 3x3 grid
    let decrement = 8; // change in width and height for higher dimension greater than 3

    cellSize = cellSize - (level - 3) * decrement;

    let boardSize = cellSize * level;

    const cell = document.getElementsByClassName('box');
    for (let i = 0; i < cell.length; i++) {
        cell[i].style.height = cellSize + 'px';
        cell[i].style.width = cellSize + 'px';
        cell[i].style.setProperty('box-sizing', 'border-box');
    }

    const gameBoard = document.getElementById('game-board');
    gameBoard.style.width = boardSize + 'px';
    gameBoard.style.height = boardSize + 'px';
    gameBoard.style.setProperty('box-sizing', 'border-box');
}

function updateEntriesInGameBoard() {
    positionsOfX.forEach((position) => {
        const box = document.getElementsByClassName(`box ${position}`);
        box[0].innerHTML = 'X';
        updateStyleOfEntry(box[0]);
    });

    positionsOfO.forEach((position) => {
        const box = document.getElementsByClassName(`box ${position}`);
        box[0].innerHTML = 'O';
        updateStyleOfEntry(box[0]);
    });
}

function updateStyleOfEntry(selectedBox) {
    selectedBox.style.color = (selectedBox.innerText === 'X') ? '#b4b1ad' : '#5edf89';
}

function updatePositionsOfPlayersInSessionStorage(positionsOfX, positionsOfO) {
    if (sessionStorage.getItem('ticTacPlusGameState') !== null) {
        let obj = JSON.parse(sessionStorage.getItem('ticTacPlusGameState'));
        obj = { ...obj, playerXPositions: positionsOfX, playerOPositions: positionsOfO }
        sessionStorage.setItem('ticTacPlusGameState', JSON.stringify(obj));
    }
}


function getAImove() {
    if (isBoardFull(true)) {
        return;
    }

    let bestScore = Number.NEGATIVE_INFINITY;
    let bestMoves = [];

    for (let i = 1; i <= level; i++) {
        for (let j = 1; j <= level; j++) {
            let move = i + '' + j;
            if (!positionsOfX.includes(move) && !positionsOfO.includes(move)) {
                positionsOfO.push(move);
                let score = minimax(0, false, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
                positionsOfO.pop();
                if (score > bestScore) {
                    bestScore = score;
                    bestMoves = [move];
                }
                else if(score==bestScore)
                    {
                        bestMoves.push(move);
                    }
            }
        }
    }

    if (bestMoves.length>0) {
        let bestMove= bestMoves[Math.floor(Math.random()*bestMoves.length)];
        console.log('best move ' + bestMove)
        let aiSelectedBox = document.querySelector(`button[value="${bestMove}"]`);
        aiSelectedBox.click();
    }
}

function minimax(depth, isMaximizer, alpha, beta) {

    if (isWinner('O')) {
        return 10 - depth;
    }
    if (isWinner('X')) {
        return depth - 10;
    }
    if (isBoardFull(true) || depth>=maxDepth[level]) {
        return 0;
    }

    if (isMaximizer) {
        let bestScore = Number.NEGATIVE_INFINITY;
        for (let i = 1; i <= level; i++) {
            for (let j = 1; j <= level; j++) {
                let move = i + '' + j;
                if (!positionsOfX.includes(move) && !positionsOfO.includes(move)) {
                    positionsOfO.push(move);
                    let score = minimax(depth + 1, false, alpha, beta);
                    positionsOfO.pop();
                    bestScore = Math.max(score, bestScore);
                    alpha = Math.max(alpha, bestScore);
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Number.POSITIVE_INFINITY;
        for (let i = 1; i <= level; i++) {
            for (let j = 1; j <= level; j++) {
                let move = i + '' + j;
                if (!positionsOfX.includes(move) && !positionsOfO.includes(move)) {
                    positionsOfX.push(move);
                    let score = minimax(depth + 1, true, alpha, beta);
                    positionsOfX.pop();
                    bestScore = Math.min(score, bestScore);
                    beta = Math.min(beta, bestScore);
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
        }
        return bestScore;
    }
}



function isBoardFull(isAiMove = false) {
    if ((positionsOfO.length + positionsOfX.length) == (level * level)) {
        if (!isAiMove) {
            playSound("drawn");
            status.innerHTML = `<b>DRAW</b>`;
        }
        return true;
    }
    return false;
}


function isWinner(player) {
    const positions = (player === 'X') ? positionsOfX : positionsOfO;
    for (let i = 0; i < winningCombinations.length; i++) {
        let combination = winningCombinations[i];
        let missingPositions = combination.filter(position => !positions.includes(position));
        if (missingPositions.length == 0) {
            return true;
        }
    }
    return false;
}