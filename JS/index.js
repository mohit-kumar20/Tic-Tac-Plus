import { getAllWinningCombinations,playSound } from "./Utility.js";

//Setting Up Global Variables
let playerX;
let playerO;
let level;
let winningCombinations=[];
const positionsOfX = [];
const positionsOfO = [];
let currentPlayer = 'X';

// Get Status
const status = document.getElementById('gameStatus');

// Transition from Setup Page to Game Page
const setupContainer = document.getElementById('setupContainer');
const gameContainer = document.getElementById('gameContainer');

const setupForm = document.getElementById('setupForm');
setupForm.addEventListener('submit', (event) => {
    event.preventDefault(); 
    UpdateGlobalFields();
    TransitionToGame(); 
    CreateBoard();
});

const restartButton = document.getElementById('restart');
restartButton.addEventListener('click',(event)=>{
  positionsOfX.length=0;
  positionsOfO.length=0;
  currentPlayer = 'X';
  
  status.innerHTML = `<b>${playerX}</b>'s turn`;
  const boxes = document.getElementsByClassName('box');
  for(let i=0;i<boxes.length;i++)
  {
    boxes[i].innerHTML='';
    boxes[i].disabled = false;
  }
});

function UpdateGlobalFields()
{
    playerX= document.getElementById('user1').value.toUpperCase();
    playerO= document.getElementById('user2').value.toUpperCase();
    level = document.getElementById('level').value;
    console.log(level + playerX +playerO);
    winningCombinations= getAllWinningCombinations(level);
    console.log(winningCombinations);

    status.innerHTML = `<b>${playerX}</b>'s turn`;
}

function TransitionToGame() {

    setupContainer.style.transition = 'opacity 0.5s ease';
    setupContainer.style.opacity = '0';

    setTimeout(() => {
        setupContainer.style.display = 'none';
        gameContainer.style.display = 'block';
        gameContainer.style.transition = 'opacity 0.5s ease';
        gameContainer.style.opacity = '1';
    }, 500); 
}

// Create  Tic-Tac-Plus Board
function CreateBoard()
{
    const gameBoard = document.getElementById('game-board');
    for(let i=1;i<=level;i++)
    {
        for(let j=1;j<=level;j++)
        {
            const newButton = document.createElement('button');
            newButton.className = `box ${i}${j}`;
            newButton.value = `${i}${j}`;
            newButton.addEventListener('click', function() {
                boxClicked(newButton);
            });

            gameBoard.appendChild(newButton);
        }        
    }
    StyleBoard();
}


function StyleBoard()
{
   let cellSize = 100; // represents width and height of a cell of 3x3 grid
   let decrement = 8; // change in width and height for higher dimension greater than 3
   
   cellSize = cellSize-(level-3)*decrement;

   let boardSize = cellSize*level;

   const cell = document.getElementsByClassName('box');
   for(let i=0;i<cell.length;i++)
   {
    cell[i].style.height= cellSize+'px';
    cell[i].style.width= cellSize+'px';
    cell[i].style.setProperty('box-sizing', 'border-box');
   }

   const gameBoard = document.getElementById('game-board'); 
   gameBoard.style.width= boardSize+'px';
   gameBoard.style.height=boardSize+'px';
   gameBoard.style.setProperty('box-sizing', 'border-box');
   console.log(boardSize);
   console.log(cellSize);
}


function boxClicked(selectedBox) {

    console.log(selectedBox.value);
    if(currentPlayer=='X')
    {
        selectedBox.innerText = "X";
        positionsOfX.push(selectedBox.value);                
        currentPlayer='O';
    }
    else
    {
        selectedBox.innerText = "O";
        positionsOfO.push(selectedBox.value);
        currentPlayer='X';
    }

    selectedBox.disabled = true; 
    selectedBox.style.color = (selectedBox.innerText === 'X') ? '#b4b1ad':'#5edf89';    
    if(positionsOfO.length>=level || positionsOfX.length>=level)
    {
        if(CheckForWin())
        return;
    }
    playSound("press");   
    status.innerHTML = `<b>${currentPlayer=='X'?playerX:playerO}</b>'s turn`;
}


function CheckForWin()
{
    for(let i=0;i<winningCombinations.length;i++)
    {
        let combination = winningCombinations[i];
        let missingPositions = combination.filter(position => !((currentPlayer==='X')?positionsOfO:positionsOfX).includes(position));
        if(missingPositions.length==0)
        {
            playSound("hurray");
            status.innerHTML = `HURRAY! <b>${currentPlayer=='X'?playerO:playerX}</b> WON`;
            disableRemainingBoxes();
            highlightWinningCombination(combination);
            return true;
        }
   } 
   
   if((positionsOfO.length+positionsOfX.length)==level*level)
   {
            playSound("drawn");
            status.innerHTML = `<b>DRAW</b>`;
            return true;
   }
   return false;
}

function disableRemainingBoxes()
{
    const boxes = document.getElementsByClassName('box');
    for(let i=0;i<boxes.length;i++)
    {
        boxes[i].disabled = true;
    }
}

function highlightWinningCombination(combination)
{
    for(let i=0;i<combination.length;i++)
    {
        const box = document.getElementsByClassName(`box ${combination[i][0]}${combination[i][1]}`);
        box[0].style.color = '#9FE649';
    }
}






