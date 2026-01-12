import {
  getWordPerMinute,
  compareTextChars,
  compareTextWords,
  loadResultsFromStorage,
  getTextDataFrom,
  saveUserResults,
  getAccuracy,
} from "./utils.js";

const TIMER_INTERVAL = 10; // 60 seconds

class Test {
  textToType =
    "The dog ran across the park chasing a ball. He was fast and loved to play. After a while, he got tired and lay down in the cool shade of a big oak tree.";
  userInput = "";
  currentDifficulty = "easy";
  currentTime = TIMER_INTERVAL;
  wpm = 0;
  accuracy = 100;
  isTestRunning = false;
  correct = 0;
  incorrect = 0;
  typedLength = 0;

  startTest = () => {
    document.querySelector(".start-modal")?.classList.add("hidden");
    this.isTestRunning = true;
  };

  testComplete = () => {
    const userResult = {
      wpm: this.wpm,
      correct: this.correct,
      incorrect: this.incorrect,
      accuracy: this.accuracy,
    };
    saveUserResults(userResult);

    document.querySelector(".start-modal")?.classList.remove("hidden");
    document.location.replace("./results.html");
    this.isTestRunning = false;
  };

  loadTextToType = async () => {
    this.reset();
    const { text, error } = await getTextDataFrom(
      "./data.json",
      this.currentDifficulty
    );

    if (error) {
      alert("Error fetching text data:", error);
      alert("Reload the page to try again.");
      return;
    }

    this.textToType = text;
  };

  checkUserInput = () => {
    const charCorrect = compareTextChars(this.userInput, this.textToType);

    this.correct = charCorrect.correct;
    this.incorrect = charCorrect.incorrect;
    this.typedLength = this.userInput.length || 0;

    this.wordTypedLength = this.userInput.split(" ").length || 0;
    this.accuracy =
      this.typedLength === 0 ? 0 : getAccuracy(this.correct, this.typedLength);
  };

  updateWpm = (wordsTyped) => {
    this.wpm = getWordPerMinute(this.currentTime, wordsTyped);
  };

  reset = () => {
    this.userInput = "";
    this.currentTime = TIMER_INTERVAL;
    this.wpm = 0;
    this.accuracy = 100;
    this.isTestRunning = false;
    this.correct = 0;
    this.incorrect = 0;
    this.typedLength = 0;
  };
}

export default Test;
