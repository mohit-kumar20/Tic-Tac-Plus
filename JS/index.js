import {updateSessionStorage} from './Utility.js';


const autoPlayerRadioBtn = document.getElementById('auto-player');
const twoPlayerRadioBtn = document.getElementById('two-player');

const labelPlayer1Name = document.querySelector('label[for="player1"]');
const labelPlayer2Name = document.querySelector('label[for="player2"]');

const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
const levelSelectInput = document.querySelector('select[id="level"]');

const tossButton = document.getElementById('tossButton');
let tossWinner = '';
let tossLooser = '';


const  bindDataFromSessionStorage = ()=>{
    if(sessionStorage.getItem('ticTacPlusGameState')!==null)
    {
        const obj = JSON.parse(sessionStorage.getItem('ticTacPlusGameState'));
        if(player1Input) player1Input.value = obj.player1;
        if(player2Input) player2Input.value = obj.player2;
        tossWinner = obj.tossWinner;
        if(obj.gameMode==='auto-player')
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

        if(tossWinner!=='')
        {
            tossResult.innerHTML =  `<span class='toss-winner'>${tossWinner.toUpperCase()}</span> will go first!`;        
        }
    }
};
bindDataFromSessionStorage();




const handleGameModeChange = ()=>{
    if(autoPlayerRadioBtn.checked)
    {
        labelPlayer1Name.innerText='Player :'
        labelPlayer2Name.style.display='none';
        player2Input.style.display='none';
        player2Input.removeAttribute('required');
    }
    else
    {
        labelPlayer1Name.innerText='Player 1:';
        labelPlayer2Name.style.display='block';
        player2Input.style.display='block';
        player2Input.setAttribute('required',true);
    }
};

handleGameModeChange();
autoPlayerRadioBtn.addEventListener('change',handleGameModeChange);
twoPlayerRadioBtn.addEventListener('change',handleGameModeChange);



const setupForm = document.getElementById('setupForm');

setupForm.addEventListener('submit', (event) => {    
    
    event.preventDefault(); 
    if (!tossWinner) {
        const proceedWithoutToss = window.confirm(`You haven't tossed the coin. Do you want to start first with ${player1Input.value.trim()} ?`);
        if (proceedWithoutToss) {
            tossWinner = player1Input.value.trim();
        }
        else
        {
        tossButton.click();
        return;
        }
    } 
    const storage = {
        boardDimension : levelSelectInput.value,
        gameMode : autoPlayerRadioBtn.checked?'auto-player':'two-player',
        player1 : player1Input.value.trim(),
        player2 : player2Input.value.trim()==''?'Auto-Player':player2Input.value.trim(),
        tossWinner : tossWinner,
        player1Positions: [],
        player2Positions: []
    }

    updateSessionStorage(storage);
    window.location.href='gameBoard.html';    
});

tossButton.addEventListener('click', () => {
    const player1Name = document.getElementById('player1').value.trim();    
    const player2Name = autoPlayerRadioBtn.checked ?'Auto-Player': document.getElementById('player2').value.trim();

    if (player1Name==='' || player2Name==='') 
    {
        alert("Please enter players' name first !");
        return;
    }

    tossResult.innerHTML = '';

    coin.style.transform = 'rotateX(0)';
    setTimeout(() => {
        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        const rotateAngle = result === 'heads' ? 1800 : 1980; // 1800 or 1980 degrees for 5 or 5.5 full flips
        coin.style.transform = `rotateX(${rotateAngle}deg)`;
        
        setTimeout(() => {
            tossWinner = result === 'heads' ? player1Name : player2Name;
            tossResult.innerHTML =  `<span class='toss-winner'>${tossWinner.toUpperCase()}</span> will go first!`;
        }, 500); 
    }, 100);
});


