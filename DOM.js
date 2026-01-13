const displayResultsDOM = (results) => {
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

const UpdateCharDOM = (index, isCorrect) => {
  const textToTypeDOM = document.querySelector(".text-to-type");
  textToTypeDOM.children[index].classList.remove(
    "neutral",
    "correct",
    "incorrect",
    "current"
  );
  textToTypeDOM.children[index].classList.add(
    isCorrect ? "correct" : "incorrect"
  );
  textToTypeDOM.children[index + 1].classList.add("current");
};

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

export { setTextToTypeDOM, updateScoreDOM, UpdateCharDOM, displayResultsDOM };
