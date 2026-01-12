class Test {}

const TIMER_INTERVAL = 1; // 1 second
let currentTime = 60;
const wpmDOM = document.getElementById("wpm");
const startBtnDOM = document.getElementById("start-btn");
const remainingTimeDOM = document.getElementById("remaining-time");
const difficultyButtons = document.querySelectorAll(
  "input[type='radio'][name='difficulty']"
);
const typedTextDOM = document.getElementById("typed-text");
const textToTypeDOM = document.querySelector(".text-to-type");
let textToType =
  "The dog ran across the park chasing a ball. He was fast and loved to play. After a while, he got tired and lay down in the cool shade of a big oak tree.";
let currentDifficulty = "easy";

const startTest = () => {
  // Logic to start the test can be added here
  loadTextToType();
  currentTime = TIMER_INTERVAL;
  remainingTimeDOM.textContent = currentTime;
  typedTextDOM.value = "";
  document.querySelector(".start-modal").classList.add("hidden");
};

const testComplete = () => {
  // Logic to handle test completion can be added here
  document.querySelector(".start-modal").classList.remove("hidden");
  document.location.replace("./results.html");
};

startBtnDOM.addEventListener("click", (e) => {
  e.preventDefault();
  startTest();
});

setInterval(() => {
  if (currentTime <= 0) {
    testComplete();
    return;
  }
  currentTime -= 1;
  remainingTimeDOM.textContent = currentTime;

  const wordsTyped = typedTextDOM.value.split(" ").length;
  const wpm = getWordPerMinute(currentTime, wordsTyped);
  wpmDOM.textContent = isNaN(wpm) || !isFinite(wpm) ? 0 : wpm;
}, 1000);

const getWordPerMinute = (currentTime, wordsTyped) =>
  Math.round((wordsTyped / (60 - currentTime)) * 60);

const compareText = (userInput, expectedInput) => {
  const userInputArray = userInput.split("");
  const expectedInputArray = expectedInput.split("");

  console.log(userInputArray);
  console.log(expectedInputArray);

  userInputArray.forEach((word, index) => {
    const isWordCorrect = isCurrentWordCorrect(word, expectedInputArray[index]);
    textToTypeDOM.children[index].classList.remove(
      "neutral",
      "correct",
      "incorrect",
      "current"
    );
    textToTypeDOM.children[index].classList.add(
      isWordCorrect ? "correct" : "incorrect"
    );
    textToTypeDOM.children[index + 1].classList.add("current");
  });
};

const isCurrentWordCorrect = (currentWord, expectedWord) => {
  // Normalize characters for comparison
  const normalizeChar = (char) => {
    // Treat hyphen, en dash, and em dash as equivalent
    if (char === "—" || char === "–" || char === "-") return "-";
    return char;
  };

  return normalizeChar(currentWord) === normalizeChar(expectedWord);
};

function handleKeyPress(event) {
  const key = event.key;
  typedTextDOM.value += key;
  typedTextDOM.dispatchEvent(new Event("input"));
}

const generateText = (text) => {
  let textArray = text.split("");
  textArray.forEach((word) => {
    const wordSpan = document.createElement("span");
    wordSpan.classList.add("word");
    wordSpan.classList.add("neutral");
    wordSpan.textContent = word;
    textToTypeDOM.appendChild(wordSpan);
  });

  // Logic to generate text based on difficulty can be added here
  // return "The dog ran across the park chasing a ball. He was fast and loved to play. After a while, he got tired and lay down in the cool shade of a big oak tree.";
};

const loadTextToType = () => {
  textToTypeDOM.innerHTML = "";
  typedTextDOM.value = "";

  fetch("./data.json")
    .then((res) => res.json())
    .then((data) => {
      const randomIndex = Math.floor(
        Math.random() * data[currentDifficulty].length
      );
      const text = data[currentDifficulty][randomIndex].text;
      textToType = text;
      generateText(text);
    })
    .catch((err) => console.error(err));
};

loadTextToType();

difficultyButtons.forEach((radioButton) => {
  radioButton.addEventListener("change", (e) => {
    console.log(e.target.value);
    currentDifficulty = e.target.value;
    loadTextToType();

    // Logic to change text based on difficulty can be added here
  });
});

const text = textToType.innerText;

document.addEventListener("keypress", handleKeyPress);

typedTextDOM.addEventListener("input", (e) => {
  compareText(e.target.value, textToType);
});
