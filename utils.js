const isCurrentCharCorrect = (currentChar, expectedChar) => {
  // Normalize characters for comparison
  const normalizeChar = (char) => {
    // Treat hyphen, en dash, and em dash as equivalent
    if (char === "—" || char === "–" || char === "-") return "-";
    return char;
  };

  return normalizeChar(currentChar) === normalizeChar(expectedChar);
};

const getWordPerMinute = (currentTime, wordsTyped) =>
  Math.round((wordsTyped / (60 - currentTime)) * 60);

const compareTextChars = (userInput, expectedInput) => {
  const textToTypeDOM = document.querySelector(".text-to-type");
  let correct = 0;
  let incorrect = 0;
  const userInputArray = userInput.split("");
  const expectedInputArray = expectedInput.split("");

  userInputArray.forEach((word, index) => {
    const isCharCorrect = isCurrentCharCorrect(word, expectedInputArray[index]);
    textToTypeDOM.children[index].classList.remove(
      "neutral",
      "correct",
      "incorrect",
      "current"
    );
    if (isCharCorrect) {
      correct += 1;
    } else {
      incorrect += 1;
    }
    textToTypeDOM.children[index].classList.add(
      isCharCorrect ? "correct" : "incorrect"
    );
    textToTypeDOM.children[index + 1].classList.add("current");
  });
  return { correct, incorrect };
};

const compareTextWords = (userInput, expectedInput) => {
  let correct = 0;
  let incorrect = 0;

  const userInputArray = userInput.split(" ");
  const expectedInputArray = expectedInput.split(" ");

  userInputArray.forEach((word, index) => {
    const isWordCorrect = word === expectedInputArray[index];
    if (isWordCorrect) {
      correct += 1;
    } else {
      incorrect += 1;
    }
  });
  return { correct, incorrect };
};

const loadResultsFromStorage = () => {
  const userResult = localStorage.getItem("userResult");
  console.log(userResult);

  return userResult ? JSON.parse(userResult) : null;
};

const displayResults = (results) => {
  const wpmDOM = document.getElementById("wpm");
  const correctDOM = document.getElementById("correct");
  const incorrectDOM = document.getElementById("incorrect");
  const accuracyDOM = document.getElementById("accuracy");

  if (results) {
    wpmDOM.textContent =
      isNaN(results.wpm) || !isFinite(results.wpm) ? 0 : results.wpm;
    correctDOM.textContent = results ? results.correct : 0;
    incorrectDOM.textContent = results ? results.incorrect : 0;
    accuracyDOM.textContent = results ? results.accuracy + "%" : "0%";
  }
};

/**
 *  Load text data from a given URL
 * @param {string} url
 * @param {string} currentDifficulty "easy" | "medium" | "hard"
 * @returns {error: string, text: string}
 */
const getTextDataFrom = async (url, currentDifficulty) => {
  let error = null;
  let text = null;
  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.log("pouet");

      throw new Error(`HTTP error! status: ${text.status}`);
    }
    const data = await res.json();
    const randomIndex = Math.floor(
      Math.random() * data[currentDifficulty].length
    );
    const textToType = data[currentDifficulty][randomIndex].text;
    text = textToType;
  } catch (err) {
    error = err;
  }

  return { text, error };
};

const saveUserResults = (results) => {
  localStorage.setItem("userResult", JSON.stringify(results));
};

const getAccuracy = (correct, totalTyped) =>
  totalTyped === 0 ? 0 : Math.round((correct / totalTyped) * 100);

export {
  getWordPerMinute,
  compareTextChars,
  compareTextWords,
  loadResultsFromStorage,
  displayResults,
  getTextDataFrom,
  saveUserResults,
  getAccuracy,
};
