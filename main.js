import Text from "./Test.js";

const test = new Text();

const updateScoreDOM = (test) => {
  const remainingTimeDOM = document.getElementById("remaining-time");
  const wpmDOM = document.getElementById("wpm");
  const accuracyDOM = document.getElementById("accuracy");

  wpmDOM.textContent = isNaN(test.wpm) || !isFinite(test.wpm) ? 0 : test.wpm;
  accuracyDOM.textContent = isNaN(test.accuracy) ? 0 : `${test.accuracy}%`;
  remainingTimeDOM.textContent = test.currentTime;
};

const setTextToTypeDOM = (text) => {
  const textToTypeDOM = document.querySelector(".text-to-type");
  textToTypeDOM.textContent = "";

  const textArray = text.split("");
  textArray.forEach((char) => {
    const wordSpan = document.createElement("span");
    wordSpan.classList.add("word");
    wordSpan.classList.add("neutral");
    wordSpan.textContent = char;
    textToTypeDOM?.appendChild(wordSpan);
  });
};

// DOM Elements
const startBtnDOM = document.getElementById("start-btn");
const difficultyButtons = document.querySelectorAll(
  "input[type='radio'][name='difficulty']"
);
const typedTextDOM = document.getElementById("typed-text");

// Initial Load
test.loadTextToType();
setTextToTypeDOM(test.textToType);

// Event Listeners
startBtnDOM.addEventListener("click", (e) => {
  e.preventDefault();
  setTextToTypeDOM(test.textToType);
  test.startTest();
});

function handleKeyPress(event) {
  const key = event.key;
  if (test.isTestRunning === false) {
    test.startTest();
    return;
  }
  if (typedTextDOM) {
    typedTextDOM.value += key;
    test.userInput = typedTextDOM.value;
    typedTextDOM.dispatchEvent(new Event("input"));
  }
}

difficultyButtons.forEach((radioButton) => {
  radioButton?.addEventListener("change", (e) => {
    test.currentDifficulty = e.target.value;
    test.loadTextToType();
  });
});

document.addEventListener("keypress", handleKeyPress);
typedTextDOM.addEventListener("input", (e) => {
  test.checkUserInput();
});

// Timer Interval
setInterval(() => {
  if (test.isTestRunning === false) return;
  if (test.currentTime <= 0) {
    test.testComplete();
    return;
  }
  test.currentTime -= 1;
  const wordsTyped = typedTextDOM.value.split(" ").length;
  test.updateWpm(wordsTyped);
}, 1000);

setInterval(() => {
  if (test.isTestRunning === false) return;
  updateScoreDOM(test);
}, 500);
