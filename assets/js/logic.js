// add variables that keep track of the quiz "state"
let currentQuestionIndex = 0;
let time = questions.length * 15;
let timerId;

// add variables to reference DOM elements
// example is below
let startScreen = document.getElementById("start-screen");
let endScreen = document.getElementById("end-screen");
let questionsEl = document.getElementById("questions");
let questionTitle = document.getElementById("question-title");
let submitBtn = document.getElementById("submit");
let startBtn = document.getElementById("start");
let choicesEl = document.getElementById("choices");
let initialsEl = document.getElementById("initials");

// reference the sound effects
let sfxRight = new Audio("assets/sfx/correct.wav");
let sfxWrong = new Audio("assets/sfx/incorrect.wav");

function startQuiz() {
  // hide start screen
  startScreen.classList.add("hide");

  // un-hide questions section
  questionsEl.classList.remove("hide");

  // start timer
  timerId = setInterval(clockTick, 1000);

  // show starting time
  document.getElementById("time").textContent = time;

  // call a function to show the next question
  getQuestion();
}

function getQuestion() {
  // get current question object from array
  const currentQuestion = questions[currentQuestionIndex];

  // update title with current question
  document.title = currentQuestion.title;

  // clear out any old question choices
  choicesEl.innerHTML = "";
  questionTitle.innerHTML = currentQuestion.title;

  // length of the current question choices
  let numberOfChoices = currentQuestion.choices.length; 

  // loop over the choices for each question
  for (let i = 0; i < numberOfChoices; i++) {
    // create a new button for each choice, setting the label and value for the button
    const choice = document.createElement("button");
    choice.textContent = currentQuestion.choices[i];
    choice.setAttribute("value", currentQuestion.choices[i]);

    // display the choice button on the page
    choicesEl.appendChild(choice);
  }
}

function questionClick(event) {
  // identify the targeted button that was clicked on
  const target = event.target;

  // if the clicked element is not a choice button, do nothing.
  if (!target.matches("button")) return;

  // check if user guessed wrong
  if (target.value !== questions[currentQuestionIndex].answer) {
    // if they got the answer wrong, penalize time by subtracting 15 seconds from the timer
    time -= 15;

    // if they run out of time (i.e., time is less than zero) set time to zero so we can end quiz
    if (time < 0) {
      time = 0;
    }

    // display new time on page
    document.getElementById("time").textContent = time;

    // play "wrong" sound effect
    sfxWrong.play();

    // display "wrong" feedback on page
    document.getElementById("feedback").textContent = "Wrong!";
  } else {
    // play "right" sound effect
    sfxRight.play();

    // display "right" feedback on page by displaying the text "Correct!" in the feedback element
    document.getElementById("feedback").textContent = "Correct!";
  }

  // flash right/wrong feedback on page for half a second
  document.getElementById("feedback").classList.remove("hide");
  
  // after one second, remove the "feedback" class from the feedback element
  setTimeout(() => {
    document.getElementById("feedback").classList.add("hide");
  }, 500);

  // move to next question
  currentQuestionIndex++;

  // check if we've run out of questions
  if (currentQuestionIndex === questions.length) {
    // if the time is less than zero and we have reached the end of the questions array,
    // call a function that ends the quiz (quizEnd function)
    quizEnd();
  } else {
    // or else get the next question
    getQuestion();
  }
}

// define the steps of the QuizEnd function...when the quiz ends...
function quizEnd() {
  // stop the timer
  clearInterval(timerId);

  // show end screen
  endScreen.classList.remove("hide");

  // show final score
  document.getElementById("final-score").textContent = time;

  // hide the "questions" section
  questionsEl.classList.add("hide");
}

// add the code in this function to update the time, it should be called every second
function clockTick() {
  // right here - update time
  time--;

  // update the element to display the new time value
  document.getElementById("time").textContent = time;

  // check if user ran out of time; if so, call the quizEnd() function
  if (time <= 0) {
    quizEnd();
  }
}

// complete the steps to save the high score
function saveHighScore() {
  // get the value of the initials input box
  const initials = initialsEl.value.trim();

  // make sure the value of the initials input box wasn't empty
  if (initials !== "") {
    // if it is not, check and see if there is a value of high scores in local storage
    let highscores = localStorage.getItem("highscores");

    // if there isn't any, then create a new array to store the high score
    if (!highscores) {
      highscores = [];
    } else {
      // otherwise, if there are high scores stored in local storage,
      // retrieve the local storage value that has the high scores,
      // convert it back to an array,
      highscores = JSON.parse(highscores);
    }

    // add the new initials and high score to the array
    highscores.push({ initials, score: time });

    // sort high scores
    highscores.sort((a, b) => b.score - a.score);

    // store the high score in local storage
    localStorage.setItem("highscores", JSON.stringify(highscores));

    // redirect the user to the high scores page.
    window.location.href = "highscores.html";
  }
}

// use this function when the user presses the "enter" key when submitting high score initials
function checkForEnter(event) {
  // if the user presses the enter key, then call the saveHighscore function
  if (event.key === "Enter") {
    saveHighScore();
  }
}

// user clicks button to submit initials
submitBtn.onclick = saveHighScore;

// user clicks button to start quiz
startBtn.onclick = startQuiz;

// user clicks on an element containing choices
choicesEl.onclick = questionClick;

initialsEl.onkeyup = checkForEnter;
