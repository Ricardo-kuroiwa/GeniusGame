//caracters
let playerAnswers = [];
let score = 0;
let roundAnswers = [];
let difficulty = 4;
let highScore = 0;

let waitingPlayerAnswer = false;
let canStartRound = true;
let intervalDecrease = 0;

const restartButton = document.querySelector('.restart');
const scoreElement = document.querySelector('#currentScore');
const highScoreElement = document.querySelector('#maxScore');
const buttonElements = document.querySelectorAll('.clickable');
const controlElement = document.querySelector('.control .background');
const controlStatusElement = document.querySelector('.control p');


const toggleButtonsCursorStyle = () => {
  for (let element of buttonElements) {
    element.style.cursor = element.style.cursor === 'pointer' ? '' : 'pointer';
  }
};
//Restart Game
const restartGame = () => {
  if (roundAnswers.length == 0) {
    return;
  } else {
    for (let index = 0; index < roundAnswers.length; index++) {
      roundAnswers.pop();
    }
    controlElement.style.backgroundColor = '#f0fff4';
    controlStatusElement.innerHTML = 'Start';
    difficulty = 4;
    scoreElement.innerHTML=0
    waitingPlayerAnswer = false;
    canStartRound = true;
    intervalDecrease = 0;
  }
};

//Random value
const getRandomValueAtArray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};
//display sequence
const displaySequence = (index) => {
  restartButton.setAttribute("disabled", "");
  const element = roundAnswers[index];

  setTimeout(() => {
    element.classList.add('active');

    setTimeout(() => {
      element.classList.remove('active');
      index++;

      if (index < roundAnswers.length) {
        displaySequence(index);
      } else {
        waitingPlayerAnswer = true;

        controlElement.style.backgroundColor = 'lightblue';
        controlStatusElement.innerHTML = 'REPRODUZA';
        
        restartButton.removeAttribute("disabled");
        toggleButtonsCursorStyle();
      }
    }, 1000 - intervalDecrease)
  }, 1000 - intervalDecrease)
  
  //restartButton.removeAttribute("disabled");
};
//CAll round
const callRound = () => {
  playerAnswers = [];

  controlElement.style.cursor = 'auto';
  controlElement.style.color = '#f0fff4';
  controlElement.style.backgroundColor = '#ded118';
  controlStatusElement.innerHTML = 'LOOK';

  const loopLimit = difficulty - roundAnswers.length;

  for (let i = 0; i < loopLimit; i++) {
    const randomValue = getRandomValueAtArray(buttonElements);
    console.log(randomValue);

    roundAnswers.push(randomValue);
  }
  
  displaySequence(0);
  
};
//star play
controlElement.onclick = () => {
  if (canStartRound) {
    callRound();
    
    canStartRound = false;
  }
};
//Restart
restartButton.onclick = () => {
  restartGame();
}
const updateScore = () => {
  scoreElement.innerHTML = score;
  highScoreElement.innerHTML = (highScore > 0) ? highScore : '-';
};
const processAnswers = () => {
  waitingPlayerAnswer = false;

  toggleButtonsCursorStyle();

  let allCorrect = true;

  for (let i in roundAnswers) {
    const properAnswer = roundAnswers[i];
    const playerAnswer = playerAnswers[i];

    if (properAnswer !== playerAnswer) {
      allCorrect = false;
    }
  }

  if (allCorrect) {
    controlElement.style.cursor = 'pointer';
    controlElement.style.backgroundColor = 'green';

    controlStatusElement.innerHTML = 'ACERTOU';

    setTimeout(() => {
      callRound()
    }, 1500);
  } else {
    controlElement.style.cursor = 'pointer';
    controlElement.style.backgroundColor = 'red';

    controlStatusElement.innerHTML = 'RECOMEÇAR';

    highScore = (score > highScore) ? score : highScore;

    canStartRound = true;
  }

  score = (allCorrect) ? score + 1 : score;
  score = (allCorrect) ? score : 0;

  updateScore();
  revampDifficulty(allCorrect);
};
const revampDifficulty = (toIncrease) => {
  if (toIncrease) {
    difficulty++;
    intervalDecrease = (intervalDecrease < 800) ? intervalDecrease + 10 : intervalDecrease;
  } else {
    difficulty = 4;
    intervalDecrease = 0;
  }
};

const processClick = (element) => {
  if (!waitingPlayerAnswer) {
    return;
  }

  playerAnswers.push(element);
  element.classList.add('active');

  setTimeout(() => {
    element.classList.remove('active');
  }, 750);

  const i = playerAnswers.length - 1;

  if (playerAnswers[i] !== roundAnswers[i] || playerAnswers.length === roundAnswers.length) {
    processAnswers();
  }
};
for (let element of buttonElements) {
  element.onclick = () => {
    processClick(element);
  };

  element.onmouseenter = () => {
    if (waitingPlayerAnswer && !element.classList.contains('active')) {
      element.classList.add('hover');
    }
  };

  element.onmouseleave = () => {
    if (waitingPlayerAnswer && !element.classList.contains('active')) {
      element.classList.remove('hover');
    }
  }
}