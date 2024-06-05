import {updateSessionStorage} from './Utility.js';


const autoPlayerRadioBtn = document.getElementById('auto-player');
const twoPlayerRadioBtn = document.getElementById('two-player');

const labelForUser1Input = document.querySelector('label[for="player1"]');
const labelForUser2Input = document.querySelector('label[for="player2"]');

const user1Input = document.getElementById('player1');
const user2Input = document.getElementById('player2');
const levelSelectInput = document.querySelector('select[id="level"]');



const  bindDataFromSessionStorage = ()=>{
    console.log(sessionStorage.getItem('ticTacPlusGameState'));
    if(sessionStorage.getItem('ticTacPlusGameState')!==null)
    {
        const obj = JSON.parse(sessionStorage.getItem('ticTacPlusGameState'));
        if(user1Input) user1Input.value = obj.playerX;
        if(user2Input) user2Input.value = obj.playerO;
        if(obj.gameMode=='auto-player')
        {
            autoPlayerRadioBtn.setAttribute('checked',true);
        }
        else
        {
            twoPlayerRadioBtn.setAttribute('checked',true);
        }

        Array.from(levelSelectInput.options).forEach((option)=>{
            if(option.value===obj.boardDimension)
                option.selected=true;
        });
    }
};
bindDataFromSessionStorage();




const handleGameModeChange = ()=>{
    if(autoPlayerRadioBtn.checked)
    {
        labelForUser1Input.innerText='Player :'
        labelForUser2Input.style.display='none';
        user2Input.style.display='none';
        user2Input.removeAttribute('required');
    }
    else
    {
        labelForUser1Input.innerText='Player 1:';
        labelForUser2Input.style.display='block';
        user2Input.style.display='block';
        user2Input.setAttribute('required',true);
    }
};

handleGameModeChange();
autoPlayerRadioBtn.addEventListener('change',handleGameModeChange);
twoPlayerRadioBtn.addEventListener('change',handleGameModeChange);



const setupForm = document.getElementById('setupForm');

setupForm.addEventListener('submit', (event) => {    
    event.preventDefault(); 
    const storage = {
        boardDimension : levelSelectInput.value,
        gameMode : autoPlayerRadioBtn.checked?'auto-player':'two-player',
        playerX : user1Input.value,
        playerO : autoPlayerRadioBtn.checked?'':user2Input.value,
        playerXPositions: [],
        playerOPositions: []
    }
    console.log(storage);
    updateSessionStorage(storage);
    window.location.href='gameBoard.html';    
});




