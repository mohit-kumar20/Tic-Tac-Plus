import { getAllWinningCombinations,playSound, updateSessionStorage} from "./Utility.js";

//Declaring Game State Variable
let playerX;
let playerO;
let level;
let gameMode;
let winningCombinations=[];
let positionsOfX = [];
let positionsOfO = [];
let currentPlayer;
let dummyBoard;
let maxDepth= {'3':7,
    '4':6,
    '5':5
}

const status = document.getElementById('gameStatus');
const restartButton = document.getElementById('restart');

bindGameStateFromSessionStorage();
setUpGameBoard();
updateEntriesInGameBoard(); 


if(gameMode==='auto-player')
    {
        dummyBoard = getDummyBoard(level);
    }

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
  if(gameMode==='auto-player')
    {
        dummyBoard = getDummyBoard(level);
    }
  updatePositionsOfPlayersInSessionStorage(positionsOfX,positionsOfO);
});



function boxClicked(selectedBox) 
{

    if(currentPlayer=='X')
    {
        selectedBox.innerText = "X";
        positionsOfX.push(selectedBox.value);
        if(gameMode==='auto-player')
            {
                dummyBoard[selectedBox.value.charAt(0)-1][selectedBox.value.charAt(1)-1]='X';
            }            
    }
    else
    {
        selectedBox.innerText = "O";
        positionsOfO.push(selectedBox.value);        
        if(gameMode==='auto-player')
            {
                dummyBoard[selectedBox.value.charAt(0)-1][selectedBox.value.charAt(1)-1]='O';
            }   
    }

    selectedBox.disabled = true; 
    updateStyleOfEntry(selectedBox); 
  //  updatePositionsOfPlayersInSessionStorage(positionsOfX,positionsOfO); 

    if(positionsOfO.length>=level || positionsOfX.length>=level)
    {
        if(CheckForWin())
        return;
    }
    playSound(currentPlayer==='X'?'inputByX':'inputByO');  
    currentPlayer= currentPlayer==='X'?'O':'X';
    status.innerHTML = `<b>${currentPlayer==='X'?playerX:playerO}</b>'s turn`;
    if(gameMode=='auto-player' && (isWinner('X') || isWinner('O') || isDummyBoardFull()))
        return;
    if(gameMode=='auto-player' && currentPlayer=='O')
        {   
            const classId = getAImove();
            const aiSelectedBox = document.getElementsByClassName(`box ${classId}`);            
            aiSelectedBox[0].click();           
        }     
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
   return isBoardFull();
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

function bindGameStateFromSessionStorage()
{
   if(sessionStorage.getItem('ticTacPlusGameState')!==null)
    {        
        const state = JSON.parse(sessionStorage.getItem('ticTacPlusGameState'));
        //console.log(state);
        playerX =state.playerX;
        playerO =state.playerO!==''?state.playerO:'Auto Player';
        level   =state.boardDimension;
        gameMode=state.gameMode;
        positionsOfX=state.playerXPositions;
        positionsOfO=state.playerOPositions;
        currentPlayer=positionsOfX.length===positionsOfO.length?'X':'O';
        winningCombinations= getAllWinningCombinations(level);
        status.innerHTML = `<b>${currentPlayer=='X'?playerX:playerO}</b>'s turn`;              
        //console.log(winningCombinations);
    }
    else
    {
        window.location.href = 'index.html';
    }
}


function setUpGameBoard()
{
    const gameBoard = document.getElementById('game-board');
    for(let i=1;i<=level;i++)
    {
        for(let j=1;j<=level;j++)
        {
            const box = document.createElement('button');
            box.className = `box ${i}${j}`;
            box.value = `${i}${j}`;
            box.addEventListener('click', function() {
                boxClicked(box);
            });
            gameBoard.appendChild(box);
        }        
    }
    styleGameBoard();
}


function styleGameBoard()
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
}

function updateEntriesInGameBoard()
{
    positionsOfX.forEach((position)=>{        
        const box = document.getElementsByClassName(`box ${position}`);
        box[0].innerHTML='X';
        updateStyleOfEntry(box[0]);
    });

    positionsOfO.forEach((position)=>{
        const box = document.getElementsByClassName(`box ${position}`);
        box[0].innerHTML='O';
        updateStyleOfEntry(box[0]);
    });
}

function updateStyleOfEntry(selectedBox)
{
    selectedBox.style.color = (selectedBox.innerText === 'X') ? '#b4b1ad':'#5edf89';  
}

function updatePositionsOfPlayersInSessionStorage(positionsOfX,positionsOfO)
{
    if(sessionStorage.getItem('ticTacPlusGameState')!==null)
    {
            let obj = JSON.parse(sessionStorage.getItem('ticTacPlusGameState'));
            obj = {...obj,playerXPositions:positionsOfX,playerOPositions:positionsOfO}
            sessionStorage.setItem('ticTacPlusGameState',JSON.stringify(obj));            
    }
}

// boardDimension : levelSelectInput.value,
//         gameMode : autoPlayerRadioBtn.checked?'auto-player':'two-player',
//         playerX : user1Input.value,
//         playerO : autoPlayerRadioBtn.checked?'':user1Input.value,
//         playerXPositions: [],
//         playerOPositions: []

function getAImove(){
    let bestScore = Number.MIN_VALUE;
    let row = -1;
    let col = -1;

    for(let i=0;i<level;i++)
        {
            for(let j=0;j<level;j++)
                {
                    if(dummyBoard[i][j]==='')
                        {
                            //console.log("inside loop")
                            dummyBoard[i][j]='O';
                            // //console.log(dummyBoard);
                            let score = minimax(0,false,Number.MIN_VALUE,Number.MAX_VALUE);
                            dummyBoard[i][j]='';
                            //console.log(score);
                            if(score>bestScore)
                                {
                                    bestScore=score;
                                    row=i;
                                    col=j;
                                }                               
                        }
                }
        }
        dummyBoard[row][col]='O';
       return (row+1)+''+(col+1);
}

function minimax(depth,isMaximizer,alpha,beta)
{
    if(isWinner('O')) 
    {
        console.log('winner O', dummyBoard);
        return 10-depth;
    } 
    if(isWinner('X'))  {
        console.log('winner X', dummyBoard);
        return depth-10;
    } 
    if(isDummyBoardFull() || (depth>=maxDepth[level]))
        {
            console.log(dummyBoard);
            console.log(depth);
            return 0;
        } 

    if(isMaximizer)
        {
            let bestScore = Number.MIN_VALUE;
            for(let i=0;i<level;i++)
                {
                    for(let j=0;j<level;j++)
                        {
                            if(dummyBoard[i][j]==='')
                                {
                                    dummyBoard[i][j] = 'O';
                                    let score = minimax(depth+1,false,alpha,beta);
                                    dummyBoard[i][j] = '';
                                    bestScore=Math.max(score,bestScore);
                                    alpha=Math.max(alpha,score);
                                    if(beta<=alpha)
                                        break;
                                }
                        }
                }
                return bestScore;
        }
        else
        {
            let bestScore = Number.MAX_VALUE;
            for(let i=0;i<level;i++)
                {
                    for(let j=0;j<level;j++)
                        {
                            if(dummyBoard[i][j]==='')
                                {
                                    dummyBoard[i][j]='X';
                                    let score = minimax(depth+1,true,alpha,beta);
                                    dummyBoard[i][j]='';
                                    bestScore=Math.min(score,bestScore);
                                    beta=Math.min(beta,score);
                                    if(beta<=alpha)
                                        break;
                                }
                        }
         
             }
             return bestScore;  
        }       
}

function isBoardFull()
{
        if((positionsOfO.length+positionsOfX.length)==level*level)
        {
                 playSound("drawn");
                 status.innerHTML = `<b>DRAW</b>`;
                 return true;
        }
        return false;
}

function isDummyBoardFull()
{
    for(let i=0;i<level;i++)
        {
            for(let j=0;j<level;j++)
                {
                    if(dummyBoard[i][j]==='')
                        return false;
                }
        }
        return true;
}

function isWinner(player)
{
    let playerPositions = [];
    for(let i=0;i<level;i++)
    {
        for(let j=0;j<level;j++)
         {
        if(dummyBoard[i][j]===player)
            {
                playerPositions.push((i+1)+''+(j+1));
            }
        }
    }

    for(let i=0;i<winningCombinations.length;i++)
        {
            let winCombination = winningCombinations[i];
            let missingPositions = winCombination.filter(position => !playerPositions.includes(position));
            if(missingPositions.length===0)
            {
                return true;
            }
       } 
    return false;
}

function getDummyBoard(level)
{
    let board = [];
    for(let i=0;i<level;i++)
        {
            let row = [];
            for(let j=0;j<level;j++)
                {
                    row.push('');
                }
                board.push(row);
        }
    return board;
}