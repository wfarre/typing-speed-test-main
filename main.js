import Text from "./Test.js";
import { setTextToTypeDOM, updateScoreDOM } from "./DOM.js";

const test = new Text();

// DOM Elements
const startBtnDOM = document.getElementById("start-btn");
const difficultyButtonsDesktop = document.querySelectorAll(
  "input[type='radio'][name='difficulty-desktop']"
);
const difficultyButtonsMobile = document.querySelectorAll(
  "input[type='radio'][name='difficulty-mobile']"
);
const modeButtonsDesktop = document.querySelectorAll(
  "input[type='radio'][name='mode-desktop']"
);
const modeButtonsMobile = document.querySelectorAll(
  "input[type='radio'][name='mode-mobile']"
);
const startModalDOM = document.querySelector(".start-modal");
const restartTestBtn = document.getElementById("restart-btn");

// Dropdown Elements
const difficultyDropdown = document.getElementById("difficulty-dropdown");
const difficultyMenu = document.getElementById("difficulty-menu");
const difficultySelected = document.getElementById("difficulty-selected");
const modeDropdown = document.getElementById("mode-dropdown");
const modeMenu = document.getElementById("mode-menu");
const modeSelected = document.getElementById("mode-selected");

// handle DOM event listener
const handleKeyPress = (event) => {
  const key = event.key;
  if (test.isTestRunning === false) {
    startTest(event);
    return;
  }
  test.userInput += key;
  test.checkUserInput();
};

/**
 * Start the test when Start Button is pressed
 * @param {Event} e
 */
const startTest = (e) => {
  e.preventDefault();
  setTextToTypeDOM(test.textToType);
  test.startTest();
  startModalDOM.classList.add("hidden");
};

/**
 * End the the test when press restart of timer reaches 0.
 */
const endTest = () => {
  test.endTest();
  startModalDOM.classList.remove("hidden");
};

/**
 * Restart the test when the restart test button is pressed
 * @param {Event} e
 */
const restartTest = (e) => {
  e.preventDefault();
  test.loadTextToType();
  test.reset();
  startModalDOM.classList.remove("hidden");
};

/**
 * Update the difficulty, when one difficulty button is clicked.
 * @param {Event} e
 */
const setDifficulty = (e) => {
  test.currentDifficulty = e.target.value;
  test.loadTextToType();
  setTextToTypeDOM(test.textToType);
};

// Initial Load
test.loadTextToType().then(() => setTextToTypeDOM(test.textToType));

// Event Listeners
startBtnDOM.addEventListener("click", startTest);
restartTestBtn.addEventListener("click", restartTest);
document.addEventListener("keypress", handleKeyPress);

// Timer Interval
setInterval(() => {
  // Disable both desktop and mobile buttons during test
  [...difficultyButtonsDesktop, ...difficultyButtonsMobile].forEach((btn) => {
    btn.disabled = test.isTestRunning;
  });
  if (test.isTestRunning === false) return;
  if (test.currentTime <= 0) {
    endTest();
    return;
  }
  test.currentTime -= 1;
}, 1000);

setInterval(() => {
  if (test.isTestRunning === false) return;
  updateScoreDOM(test);
  test.updateWpm();
}, 500);

// Dropdown functionality
const toggleDropdown = (dropdownBtn, dropdownMenu) => {
  const isActive = dropdownMenu.classList.contains("active");

  // Close all dropdowns
  document.querySelectorAll(".dropdown-menu").forEach((menu) => {
    menu.classList.remove("active");
  });
  document.querySelectorAll(".dropdown-button").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Toggle current dropdown
  if (!isActive) {
    dropdownMenu.classList.add("active");
    dropdownBtn.classList.add("active");
  }
};

// Close dropdowns when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".dropdown")) {
    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
      menu.classList.remove("active");
    });
    document.querySelectorAll(".dropdown-button").forEach((btn) => {
      btn.classList.remove("active");
    });
  }
});

// Sync function to keep desktop and mobile in sync
const syncDifficultySelection = (value) => {
  // Sync desktop buttons
  difficultyButtonsDesktop.forEach((btn) => {
    if (btn.value === value) btn.checked = true;
  });
  // Sync mobile buttons
  difficultyButtonsMobile.forEach((btn) => {
    if (btn.value === value) btn.checked = true;
  });
  // Update dropdown text
  const labelMap = { easy: "Easy", medium: "Medium", hard: "Hard" };
  difficultySelected.textContent = labelMap[value] || value;
};

// Desktop difficulty buttons
difficultyButtonsDesktop.forEach((radioButton) => {
  radioButton.addEventListener("change", (e) => {
    setDifficulty(e);
    syncDifficultySelection(e.target.value);
  });
});

// Mobile difficulty dropdown
difficultyDropdown.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleDropdown(difficultyDropdown, difficultyMenu);
});

difficultyButtonsMobile.forEach((radioButton) => {
  radioButton.addEventListener("change", (e) => {
    setDifficulty(e);
    syncDifficultySelection(e.target.value);
    difficultyMenu.classList.remove("active");
    difficultyDropdown.classList.remove("active");
  });
});

// Desktop mode buttons
modeButtonsDesktop.forEach((radioButton) => {
  radioButton.addEventListener("change", (e) => {
    const label = e.target.nextElementSibling.textContent;
    modeSelected.textContent = label;
    // Sync mobile
    modeButtonsMobile.forEach((btn) => {
      if (btn.id.includes(radioButton.id.replace("-desktop", ""))) {
        btn.checked = true;
      }
    });
  });
});

// Mobile mode dropdown
modeDropdown.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleDropdown(modeDropdown, modeMenu);
});

modeButtonsMobile.forEach((radioButton) => {
  radioButton.addEventListener("change", (e) => {
    const label = e.target.nextElementSibling.textContent;
    modeSelected.textContent = label;
    modeMenu.classList.remove("active");
    modeDropdown.classList.remove("active");
    // Sync desktop
    modeButtonsDesktop.forEach((btn) => {
      if (btn.id.includes(radioButton.id.replace("-mobile", ""))) {
        btn.checked = true;
      }
    });
  });
});
