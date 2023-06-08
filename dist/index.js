"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/utils/helpers.ts
  function convertDegreeToBoxShadowOffset(angleInDegree, distance) {
    angleInDegree -= 90;
    if (angleInDegree < 0) {
      angleInDegree += 360;
    }
    let angleInRadians = angleInDegree * (Math.PI / 180);
    let offsetX = Math.floor(distance * Math.cos(angleInRadians));
    let offsetY = Math.floor(distance * Math.sin(angleInRadians));
    return { offsetX, offsetY };
  }

  // src/utils/Level.ts
  var Level = class {
    targetValue;
    userSelection;
    displayUserSelectionElement;
    referenceEl;
    targetEl;
    targetElProperty;
    userSelectEl;
    levelNumber;
    messageEl;
    timer;
    score;
    constructor(levelNumber, targetValue, userSelection, displayUserSelectionElement, referenceEl, targetElProperty, targetEl, userSelectEl, messageEl2, timer, score2) {
      this.levelNumber = levelNumber;
      this.targetValue = targetValue;
      this.userSelection = userSelection;
      this.displayUserSelectionElement = displayUserSelectionElement;
      this.referenceEl = referenceEl;
      this.targetElProperty = targetElProperty;
      this.targetEl = targetEl;
      this.userSelectEl = userSelectEl;
      this.messageEl = messageEl2;
      this.timer = timer;
      this.score = score2;
    }
    play() {
      console.log(`level ${this.levelNumber} started`);
      console.log(`update reference ${this.targetElProperty} to ${this.targetValue}`);
      this.referenceEl.style.setProperty(
        this.targetElProperty,
        this.formatPropertyValueToStringForLevel(this.levelNumber, this.targetValue)
      );
      this.userSelectEl.addEventListener("input", (e) => {
        this.userSelection = parseInt(e.target.value);
        this.updateGameUI();
        console.log(`user selected: ${this.userSelection}`);
      });
      this.timer.start();
    }
    updateGameUI() {
      this.displayUserSelectionElement.textContent = `${this.userSelection}`;
      this.targetEl.style.setProperty(
        this.targetElProperty,
        this.formatPropertyValueToStringForLevel(this.levelNumber, this.userSelection)
      );
      console.log(`update target ${this.targetElProperty} to ${this.userSelection}`);
    }
    checkAnswer() {
      this.timer.stop();
      let points = this.score.updateScore(this.targetValue, this.userSelection);
      this.messageEl.textContent = `user selected: ${this.userSelection} and target is: ${this.targetValue}! +${points} points`;
      return this.targetValue === this.userSelection;
    }
    formatPropertyValueToStringForLevel(level, value) {
      console.log({ value });
      if (level === 1) {
        return `${value}px`;
      } else if (level === 2) {
        return `"wdth" ${value}`;
      } else if (level === 3) {
        return `"wght" ${value}`;
      } else if (level === 4) {
        return `${value}px`;
      } else if (level === 5) {
        return `${value}%`;
      } else if (level === 6) {
        let boxShadowString = getComputedStyle(this.referenceEl).boxShadow;
        let splitString = boxShadowString.split(" ");
        splitString[4] = `${value}px`;
        let newBoxShadowString = splitString.join(" ");
        return newBoxShadowString;
      } else if (level === 7) {
        let boxShadowString = getComputedStyle(this.referenceEl).boxShadow;
        let splitString = boxShadowString.split(" ");
        let horizontalOffset = parseInt(splitString[4], 10);
        let verticalOffset = parseInt(splitString[5], 10);
        let distance = Math.sqrt(
          horizontalOffset * horizontalOffset + verticalOffset * verticalOffset
        );
        let { offsetX, offsetY } = convertDegreeToBoxShadowOffset(value, distance);
        splitString[4] = `${offsetX}px`;
        splitString[5] = `${offsetY}px`;
        let newBoxShadowString = splitString.join(" ");
        return newBoxShadowString;
      }
      return "";
    }
  };

  // src/utils/Timer.ts
  var Timer = class {
    // holds the current remaining time
    constructor(timeLimit, timeElement) {
      this.timeLimit = timeLimit;
      this.timeElement = timeElement;
      this.timeRemaining = this.timeLimit;
      console.log({ timeElement });
      this.timeElement.textContent = this.formatTime(this.timeRemaining);
    }
    countdown;
    // holds the setInterval
    timeRemaining;
    start() {
      this.countdown = setInterval(() => {
        console.log(`timeRemaining: ${this.timeRemaining}`);
        this.timeRemaining--;
        if (this.timeRemaining < 0) {
          this.stop();
        } else {
          this.timeElement.textContent = this.formatTime(this.timeRemaining);
        }
      }, 1e3);
    }
    stop() {
      clearInterval(this.countdown);
    }
    reset() {
      this.stop();
      this.timeRemaining = this.timeLimit;
      this.timeElement.textContent = this.formatTime(this.timeRemaining);
    }
    getTime() {
      return this.timeRemaining;
    }
    formatTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
  };

  // src/utils/Score.ts
  var Score = class {
    constructor(scoreElement) {
      this.scoreElement = scoreElement;
      this.scoreElement.textContent = this.currentScore.toString();
    }
    currentScore = 0;
    updateScore(targetValue, userSelection) {
      let points = this.calculateScore(targetValue, userSelection);
      this.currentScore += points;
      this.scoreElement.textContent = this.currentScore.toString();
      return points;
    }
    calculateScore(targetValue, userSelection) {
      const percentageDifference = Math.abs((targetValue - userSelection) / targetValue) * 100;
      if (percentageDifference <= 10) {
        return 2;
      } else if (percentageDifference <= 20) {
        return 1;
      }
      return 0;
    }
    reset() {
      this.currentScore = 0;
      this.scoreElement.textContent = this.currentScore.toString();
    }
    getScore() {
      return this.currentScore;
    }
  };

  // src/index.ts
  var referenceEls = document.querySelectorAll('[data-game="reference-el"]' /* REFERENCE_ELEMENTS */);
  var targetEls = document.querySelectorAll('[data-game="target-el"]' /* TARGET_ELEMENTS */);
  var displaySelectEls = document.querySelectorAll('[data-game="display-user-selection"]' /* DISPLAY_SELECT */);
  var userSelectEls = document.querySelectorAll('[data-game="user-select-el"]' /* USER_SELECT_ELEMENTS */);
  var submitButtons = document.querySelectorAll('[data-game="submit-button"]' /* SUBMIT_BUTTONS */);
  var nextRoundButtons = document.querySelectorAll('[data-game="next-button"]' /* NEXT_ROUND_BUTTONS */);
  var messageEl = document.querySelector('[data-game="message-el"]' /* MESSAGE_ELEMENT */);
  var tabLinks = document.querySelectorAll(".w-tab-link" /* TAB_LINKS */);
  var timerEl = document.querySelector('[data-game="time-remaining"]' /* TIMER_ELEMENT */);
  var scoreEl = document.querySelector('[data-game="score"]' /* SCORE_ELEMENT */);
  var roundEl = document.querySelector('[data-game="round-number"]' /* ROUND_ELEMENT */);
  console.log({
    referenceEls,
    targetEls,
    userSelectEls,
    submitButtons,
    messageEl,
    nextRoundButtons,
    displaySelectEls,
    tabLinks,
    timerEl,
    scoreEl,
    roundEl
  });
  var currentLevel = 1;
  var levels = [];
  var LEVEL_PROPERTIES_NAMES = {
    1: "-webkit-text-stroke-width",
    2: "font-variation-settings",
    3: "font-variation-settings",
    4: "border-radius",
    5: "opacity",
    6: "box-shadow",
    7: "box-shadow"
  };
  var numLevels = Object.keys(LEVEL_PROPERTIES_NAMES).length;
  var score = new Score(scoreEl);
  roundEl.textContent = currentLevel.toString().padStart(2, "0");
  hideNextShowSubmit();
  for (let i = 0; i < numLevels; i++) {
    let level = new Level(
      i + 1,
      // level number
      getRandomInt(parseInt(userSelectEls[i].min, 10), parseInt(userSelectEls[i].max, 10)),
      // target value
      parseInt(userSelectEls[i].value, 10),
      // user selection
      displaySelectEls[i],
      // element displaying user selection
      referenceEls[i],
      // reference element
      LEVEL_PROPERTIES_NAMES[i + 1],
      // target element property
      targetEls[i],
      userSelectEls[i],
      messageEl,
      new Timer(90, timerEl),
      score
    );
    levels.push(level);
  }
  levels[currentLevel - 1].play();
  submitButtons.forEach((button) => {
    button.addEventListener("click", handleSubmitButtonClicked);
  });
  nextRoundButtons.forEach((button) => {
    button.addEventListener("click", handleNextRoundButtonClicked);
  });
  function handleSubmitButtonClicked() {
    levels[currentLevel - 1].checkAnswer();
    hideSubmitShowNext();
  }
  function handleNextRoundButtonClicked() {
    currentLevel++;
    roundEl.textContent = currentLevel.toString().padStart(2, "0");
    simulateClick(tabLinks[currentLevel - 1]);
    levels[currentLevel - 1].play();
    hideNextShowSubmit();
  }
  function hideSubmitShowNext() {
    submitButtons.forEach((button) => {
      button.style.setProperty("visibility", "hidden");
    });
    nextRoundButtons.forEach((button) => {
      button.style.setProperty("visibility", "visible");
    });
  }
  function hideNextShowSubmit() {
    submitButtons.forEach((button) => {
      button.style.setProperty("visibility", "visible");
    });
    nextRoundButtons.forEach((button) => {
      button.style.setProperty("visibility", "hidden");
    });
  }
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function simulateClick(element) {
    let clickEvent = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: false
    });
    element.dispatchEvent(clickEvent);
  }
})();
//# sourceMappingURL=index.js.map
