const holes = document.querySelectorAll('section.main-game div.col-4');
const moles = document.querySelectorAll('section.main-game div.col-4 div.mole');
const minText = document.querySelector('.countdown .minutes');
const secText = document.querySelector('.countdown .seconds');
const startBtn = document.querySelector('.btn.btn-grad.start');
const scoreText = document.querySelector('div.score .current-score');
const result = document.querySelector('div.results');
const replay = document.querySelector('div.replay button');
const hiScore = document.querySelector('.highest-score');
let numOnClicks = 0;
let timeUp = false;
let score = 0;
let total = 0;
let prevHole;

const randomNum = (min , max) =>Math.floor(Math.random() * (max-min) + min);

const randomHole = () =>{

    let currHole = randomNum(0, holes.length);

    if(currHole === prevHole){
        return randomHole();
    }

    prevHole = currHole;
    return holes[currHole];
}


const playGame = () =>{
  
    let time = randomNum(200 , 1000);
    let currHole = randomHole();
    currHole.querySelector('.mole').classList.add('up');
    total++;

    setTimeout( ()=>{
        currHole.querySelector('.mole').classList.remove('up');
        
        if(!timeUp){
            playGame();
        }

    }, time);
};


const timer = () =>{
    let sec = 60;
    let minutes = 1;
    let Interval = setInterval(() => {

        sec--;

        if (sec <= 9) {
            secText.innerHTML = `0${sec}`;
        }
        else {
            secText.innerHTML = sec;
        }

        if(sec < 60){
            minutes --;
            minText.innerHTML = "00";
        }


        if(sec === 0){
            clearInterval(Interval);
            startBtn.setAttribute("disable", false);
            startBtn.classList.remove("btn-disabled");
            timeUp = true; 
            let percent = Math.round((score/total) * 100);

            let highestScore = localStorage.getItem("score");
            if (percent > highestScore) {
                localStorage.setItem("score", percent);
                result.querySelector('.result-text').innerHTML = `Time is up! Your got ${percent}% <br> Your highest score so far!!`;
            }
             else{
                result.querySelector('.result-text').innerHTML = `Time is up! Your got ${percent}%`;
             }


            result.classList.remove('d-none');
            replay.addEventListener('click' , restart);
           
            displayHighest();
        }

    }, 1000);
}

const updateScore = () =>{
    score++;
    if(score <= 9){
        scoreText.innerHTML = `0${score}`;
    }
    else{
        scoreText.innerHTML = score;
    }
}

const restart = () =>{
    total = 0;
    score = 0;
    timeUp = false;
    result.classList.add('d-none');
    timer();
    playGame();
}

startBtn.addEventListener('click' , e =>{
    e.preventDefault();
    startBtn.setAttribute("disable" , true);
    startBtn.classList.add("btn-disabled");

    if (numOnClicks === 0){
        numOnClicks++;
        timer();
        playGame();
    }
});


moles.forEach(mole =>{
    mole.addEventListener('click' , e => {

        if(e.isTrusted)
            updateScore();
    });
});


const displayHighest = () =>{
    if (typeof Storage !== undefined) {

        if (localStorage.getItem("score")) {
            hiScore.innerHTML = `${localStorage.getItem("score")}%`;
        }
    }
    else {
        document.querySelector('.score span').classList.add('d-none');
        hiScore.classList.add('d-none');
    }
}

const addTransition = () =>{

    moles.forEach(mole =>{
        mole.style.WebkitTransition = "all 0.4s ease-in";
        mole.style.transition = "all 0.4s ease-in";
    });
}

displayHighest();
addTransition();

