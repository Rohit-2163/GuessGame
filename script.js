'use strict';

// developing application step by step

//defining our sceret number score and highscore
let secretNumber = Math.trunc(Math.random()*20)+1;  
let currScore=20;
let currHighScore=0;

const displayMessage=function(message){
    document.querySelector('.message').textContent=message;
};

//event listener
document.querySelector('.check').addEventListener('click',function(){
    let guess=Number(document.querySelector('.guess').value);
    if (currScore > 0) {
        if(!guess){
            // document.querySelector('.message').textContent='⛔No number!';
            displayMessage('⛔No number!');
        }else if(guess===secretNumber){
            // document.querySelector('.message').textContent='😎 Correct Number ';
            displayMessage('😎 Correct Number ')
            document.querySelector('.number').textContent=secretNumber;
            if(currScore>currHighScore){
                currHighScore=currScore;
                document.querySelector('.highscore').textContent=currHighScore;
            }
            document.querySelector('body').style.backgroundColor='#60b347';
    
        }else{
            // document.querySelector('.message').textContent=guess>secretNumber?'📈 Too high':'📉 Too low ';
            displayMessage(guess>secretNumber?'📈 Too high':'📉 Too low ');
            currScore--;
            document.querySelector('.score').textContent=currScore;
        }
        
    }else{
        // document.querySelector('.message').textContent='🚨 you lost the Game! ';
        displayMessage('🚨 you lost the Game! ');
    }
   

});

document.querySelector('.again').addEventListener('click',function(){
    secretNumber=Math.trunc(Math.random()*20)+1;
    console.log(secretNumber);
    currScore=20;
    document.querySelector('.message').textContent='🎮Start guessing...';
    document.querySelector('.score').textContent=currScore;
    document.querySelector('.number').textContent='?';
    document.querySelector('.guess').value='';
    document.querySelector('body').style.backgroundColor='#333';

});
