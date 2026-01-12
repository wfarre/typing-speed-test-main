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

const compareText = (userInput, expectedInput) => {
  const textToTypeDOM = document.querySelector(".text-to-type");

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
    textToTypeDOM.children[index].classList.add(
      isCharCorrect ? "correct" : "incorrect"
    );
    textToTypeDOM.children[index + 1].classList.add("current");
  });
};

export { getWordPerMinute, compareText };
