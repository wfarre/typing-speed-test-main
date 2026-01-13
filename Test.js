import {
  getWordPerMinute,
  compareTextChars,
  getTextDataFrom,
  saveUserResults,
  getAccuracy,
  TIMER_INTERVAL,
} from "./utils.js";

class Test {
  textToType = "";
  userInput = "";
  currentDifficulty = "easy";
  currentTime = TIMER_INTERVAL;
  wpm = 0;
  accuracy = 100;
  isTestRunning = false;
  correct = 0;
  incorrect = 0;

  startTest = () => {
    this.isTestRunning = true;
  };

  endTest = () => {
    const userResult = {
      wpm: this.wpm,
      correct: this.correct,
      incorrect: this.incorrect,
      accuracy: this.accuracy,
    };
    saveUserResults(userResult);
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
    const typedLength = this.userInput.length || 0;
    if (typedLength > this.textToType.length - 1) {
      this.endTest();
    }

    const charCorrect = compareTextChars(this.userInput, this.textToType);
    this.correct = charCorrect.correct;
    this.incorrect = charCorrect.incorrect;
    this.accuracy =
      typedLength === 0 ? 0 : getAccuracy(this.correct, typedLength);
  };

  updateWpm = () => {
    this.wpm = getWordPerMinute(
      this.currentTime,
      this.userInput.split(" ").length
    );
  };

  reset = () => {
    this.userInput = "";
    this.currentTime = TIMER_INTERVAL;
    this.wpm = 0;
    this.accuracy = 100;
    this.isTestRunning = false;
    this.correct = 0;
    this.incorrect = 0;
  };
}

export default Test;
