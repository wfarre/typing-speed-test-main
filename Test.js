import { getWordPerMinute, compareText } from "./utils.js";

const textToTypeDOM = document.querySelector(".text-to-type");
const TIMER_INTERVAL = 10; // 60 seconds
const typedTextDOM = document.getElementById("typed-text");
const remainingTimeDOM = document.getElementById("remaining-time");
const wpmDOM = document.getElementById("wpm");

class Test {
  textToType =
    "The dog ran across the park chasing a ball. He was fast and loved to play. After a while, he got tired and lay down in the cool shade of a big oak tree.";
  currentDifficulty = "easy";
  currentTime = TIMER_INTERVAL;
  wpm = 0;
  accuracy = 0;
  isTestRunning = false;
  correct = 0;
  incorrect = 0;
  typedLength = 0;

  startTest = () => {
    // Logic to start the test can be added here
    this.loadTextToType();
    this.currentTime = TIMER_INTERVAL;
    remainingTimeDOM.textContent = this.currentTime;
    typedTextDOM.value = "";
    document.querySelector(".start-modal")?.classList.add("hidden");

    this.isTestRunning = true;
  };

  testComplete = () => {
    // Logic to handle test completion can be added here

    document.querySelector(".start-modal")?.classList.remove("hidden");
    document.location.replace("./results.html");
    wpmDOM.textContent = isNaN(test.wpm) || !isFinite(test.wpm) ? 0 : test.wpm;
    this.isTestRunning = false;
  };

  generateText = (text) => {
    let textArray = text.split("");
    textArray.forEach((char) => {
      const wordSpan = document.createElement("span");
      wordSpan.classList.add("word");
      wordSpan.classList.add("neutral");
      wordSpan.textContent = char;
      textToTypeDOM?.appendChild(wordSpan);
    });

    // Logic to generate text based on difficulty can be added here
    // return "The dog ran across the park chasing a ball. He was fast and loved to play. After a while, he got tired and lay down in the cool shade of a big oak tree.";
  };

  loadTextToType = () => {
    if (textToTypeDOM && typedTextDOM) {
      textToTypeDOM.innerHTML = "";
      typedTextDOM.value = "";
    }

    fetch("./data.json")
      .then((res) => res.json())
      .then((data) => {
        const randomIndex = Math.floor(
          Math.random() * data[this.currentDifficulty].length
        );
        const text = data[this.currentDifficulty][randomIndex].text;
        this.textToType = text;
        this.generateText(text);
      })
      .catch((err) => console.error(err));
  };

  checkUserInput = () => {
    compareText(typedTextDOM?.value, this.textToType);
  };

  updateWpm = (wordsTyped) => {
    this.wpm = getWordPerMinute(this.currentTime, wordsTyped);
  };
}

export default Test;

class TestDOM {
  constructor() {
    this.textToTypeDOM = document.querySelector(".text-to-type");
  }
}
