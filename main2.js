import Text from "./Test.js";

const test = new Text();

// DOM Elements
const wpmDOM = document.getElementById("wpm");
const startBtnDOM = document.getElementById("start-btn");
const remainingTimeDOM = document.getElementById("remaining-time");
const difficultyButtons = document.querySelectorAll(
  "input[type='radio'][name='difficulty']"
);
const typedTextDOM = document.getElementById("typed-text");

// Event Listeners
startBtnDOM?.addEventListener("click", (e) => {
  e.preventDefault();
  test.startTest();
});

function handleKeyPress(event) {
  const key = event.key;
  if (typedTextDOM) {
    typedTextDOM.value += key;
    typedTextDOM.dispatchEvent(new Event("input"));
  }
}

difficultyButtons?.forEach((radioButton) => {
  radioButton?.addEventListener("change", (e) => {
    test.currentDifficulty = e.target.value;
    test.loadTextToType();
  });
});

document?.addEventListener("keypress", handleKeyPress);
typedTextDOM?.addEventListener("input", (e) => {
  test.checkUserInput();
});

// Initial Load
test.loadTextToType();

// Timer Interval
setInterval(() => {
  if (test.isTestRunning === false) return;
  if (test.currentTime <= 0) {
    test.testComplete();
    return;
  }
  test.currentTime -= 1;
  remainingTimeDOM.textContent = test.currentTime;

  const wordsTyped = typedTextDOM.value.split(" ").length;
  test.updateWpm(wordsTyped);
  wpmDOM.textContent = isNaN(test.wpm) || !isFinite(test.wpm) ? 0 : test.wpm;
}, 1000);
