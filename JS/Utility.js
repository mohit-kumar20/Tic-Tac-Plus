

function getAllWinningCombinations(level)
{
    let winningCombinations=[];
    let combinationXY1=[]; // represets first diagonal winning combination
    let combinationXY2=[]; // represets second diagonal winning combination
   for(let i=1;i<=level;i++)
   {
      let combinationX=[]; // represets horizontal  winning combination
      let combinationY=[]; // represets vertical  winning combination       
      for(let j=1;j<=level;j++)
      {
        if(i==j)
        {
            combinationXY1.push(i+''+j);
        }
       
        if(level-(i-1)==j)
        {
            combinationXY2.push(i+''+j);
        }
        combinationX.push(i+''+j);
        combinationY.push(j+''+i);
      }
      winningCombinations.push(combinationX,combinationY);
   }
   winningCombinations.push(combinationXY1,combinationXY2);
   return winningCombinations;
}

function playSound(type) {
    let audio = new Audio(`../STATIC/SOUNDS/${type}.mp3`);
    audio.play();
}

export {getAllWinningCombinations,playSound};