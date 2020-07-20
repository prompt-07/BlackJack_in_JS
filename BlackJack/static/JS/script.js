// : BlackJack
var el=document.getElementById("hitbtn");
if(el){
    el.addEventListener('click',bjhit);
}
document.querySelector('#dealbtn').addEventListener('click',resetAll);
document.querySelector('#standbtn').addEventListener('click',forBot);
document.querySelector('#dealbtn').disabled=true;
document.querySelector('#standbtn').disabled=true;

let blackjackdata={
    'you':{'scorespan':'#your-score-span','div':'#your-box','score':0},
    'bot':{'scorespan':'#bot-score-span','div':'#bot-box','score':0},
    'cards':['2','3','4','5','6','7','8','9','10','K','Q','J','A'],
    'cardval':{'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'K':10,'Q':10,'J':10,'A':[1,11]},
    'wins':0,
    'losses':0,
    'draws':0,
    'stand':false,
    'turnover':false,
};

const PROMPT=blackjackdata['you'];
const BOT=blackjackdata['bot'];
const hitsound=new Audio("static/sounds/swish.m4a");
const winsound=new Audio("static/sounds/cash.mp3");
const loosesound=new Audio("static/sounds/aww.mp3");

//--------------------------------------------------------------------------------------------------//

function bjhit(){
    let card=randomCard();
    showCard(PROMPT,card);
    let val1=blackjackdata['cardval'][card];
    console.log(val1);
    updateScore(PROMPT,card);
    showScore(PROMPT);
    document.querySelector('#standbtn').disabled=false;
}



function updateScore(activePlayer,card){
    if(card==='A'){
        if(activePlayer['score']+blackjackdata['cardval'][card][1]<=21)
            activePlayer['score']+=blackjackdata['cardval'][card][1];
        else
            activePlayer['score']+=blackjackdata['cardval'][card][0];
}
 else
    activePlayer['score']+=blackjackdata['cardval'][card];

}

function showScore(activePlayer){
    if(activePlayer['score']>21){
        document.querySelector(activePlayer['scorespan']).textContent='BUST!';
        document.querySelector(activePlayer['scorespan']).style.color='red';
    }
    else
    document.querySelector(activePlayer['scorespan']).textContent=activePlayer['score']; 
}

function showCard(activePlayer,card){
    if(activePlayer['score']<=21){
    let carddemo=document.createElement('img');
    carddemo.src='static/images/'+card+'.png';
    document.querySelector(activePlayer['div']).appendChild(carddemo);   
    hitsound.play();
}

}

function randomCard(){
    let cardIndex=Math.floor(Math.random()*13);
    return blackjackdata['cards'][cardIndex];
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}
//-------------------------------------------------------------------------------------//

function resetAll(){
 

    let allimgPrompt=document.querySelector(PROMPT['div']).querySelectorAll('img');
    for(let i=0;i<allimgPrompt.length;i++){
          allimgPrompt[i].remove();
    }
    let allimgBot=document.querySelector(BOT['div']).querySelectorAll('img');
    for(let i=0;i<allimgBot.length;i++){
          allimgBot[i].remove();
       }
    
    PROMPT['score']=0;
    BOT['score']=0;

    document.querySelector('#your-score-span').textContent=0;
    document.querySelector('#your-score-span').style.color='#ffffff';
    document.querySelector('#bot-score-span').textContent=0;
    document.querySelector('#bot-score-span').style.color='#ffffff';
    
    document.querySelector('#dealbtn').disabled=true;
    document.querySelector('#hitbtn').disabled=false;
    document.querySelector('#standbtn').disabled=false;
    
    document.querySelector('#textspan').textContent="Let's Play";
    document.querySelector('#textspan').style.color='black'
}

async function forBot(){
    while(BOT['score']<16){
    let card=randomCard();
    showCard(BOT,card);
    updateScore(BOT,card);
    showScore(BOT);
    await sleep(1000);
}
        let winner=computeWinner();
        showResult(winner);
     
}

function computeWinner(){
   let winner;

   if(PROMPT['score']<=21){
       if(PROMPT['score']>BOT['score'] || BOT['score']>21){
           winner=PROMPT;
           blackjackdata['wins']++;
       }

       else if(PROMPT['score']<BOT['score']){
            winner=BOT;
            blackjackdata['losses']++;
       }
       else if(PROMPT['score']===BOT['score']){
           winner=null;
           //console.log('River2 Draw');
           blackjackdata['draws']++;
        }
}

       else if(PROMPT['score']>21&&BOT['score']<=21){
           winner=BOT;
           blackjackdata['losses']++;
       }
       else if(PROMPT['score']>21&&BOT['score']>21){
           winner=null;
           blackjackdata['draws']++;
           //console.log('River2 Draw');
       }
       console.log(winner);
       return winner;
}


function showResult(winner){
    document.querySelector('#dealbtn').disabled=false;
    let msg,msgcolor;
    if(winner===PROMPT){
        document.querySelector('#winsspan').textContent=blackjackdata['wins'];
        msg="You Won ✌";
        msgcolor="green";
        winsound.play();
    }
    else if(winner===BOT){
        document.querySelector('#lossspan').textContent=blackjackdata['losses'];
        msg="You lost 🤦‍♂️";
        msgcolor="red";
        loosesound.play();
    }
    else{
        document.querySelector('#drawspan').textContent=blackjackdata['draws'];
        msg="You Drew 😒";
        msgcolor="black";
   }

   document.querySelector('#textspan').textContent=msg;
   document.querySelector('#textspan').style.color=msgcolor;
   document.querySelector('#hitbtn').disabled=true;
   document.querySelector('#standbtn').disabled=true;
}
