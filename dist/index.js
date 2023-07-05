"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/utils/constants.ts
  var PENALTY_DURATION = 5e3;
  var SHAKE_DURATION = 500;
  var LEVEL_PROPERTIES_NAMES = {
    1: "-webkit-text-stroke-width",
    2: "font-variation-settings",
    3: "font-variation-settings",
    4: "border-radius",
    5: "opacity",
    6: "box-shadow",
    7: "box-shadow"
  };
  var PERFECT_PERCENT = 10;
  var GOOD_PERCENT = 20;
  var POINTS_FOR_PERFECT = 2;
  var POINTS_FOR_GOOD = 1;
  var CLASSNAMES = {
    SUCCESS: "is-success",
    ERROR: "is-error",
    ACTIVE: "is-active",
    SHAKE: "shake-element"
  };

  // src/utils/helpers.ts
  function convertDegreeToBoxShadowOffset(angleInDegree, distance) {
    angleInDegree -= 90;
    if (angleInDegree < 0) {
      angleInDegree += 360;
    }
    const angleInRadians = angleInDegree * (Math.PI / 180);
    const offsetX = Math.floor(distance * Math.cos(angleInRadians));
    const offsetY = Math.floor(distance * Math.sin(angleInRadians));
    return { offsetX, offsetY };
  }
  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  function formatHumanReadableTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const minuteStr = minutes === 1 ? "minute" : "minutes";
    const secondStr = seconds === 1 ? "second" : "seconds";
    if (minutes === 0) {
      return `${seconds} ${secondStr}`;
    }
    return `${minutes} ${minuteStr} and ${seconds} ${secondStr}`;
  }

  // src/utils/Stopwatch.ts
  var Stopwatch = class {
    // <-- Define an event callbacks object
    constructor(startTime, timeElement) {
      this.startTime = startTime;
      this.timeElement = timeElement;
      this.timeElapsed = this.startTime;
      this.timeElement.textContent = formatTime(this.timeElapsed);
    }
    countup = 0;
    // holds the setInterval
    timeElapsed;
    // holds the current elapsed time
    eventCallbacks = {};
    on(eventName, callback) {
      if (!this.eventCallbacks[eventName]) {
        this.eventCallbacks[eventName] = [];
      }
      this.eventCallbacks[eventName].push(callback);
    }
    emit(eventName) {
      if (this.eventCallbacks[eventName]) {
        this.eventCallbacks[eventName].forEach((callback) => callback());
      }
    }
    start() {
      this.countup = setInterval(() => {
        this.timeElapsed += 1;
        this.timeElement.textContent = formatTime(this.timeElapsed);
      }, 1e3);
    }
    stop() {
      clearInterval(this.countup);
    }
    reset() {
      this.stop();
      this.timeElapsed = this.startTime;
      this.timeElement.textContent = formatTime(this.timeElapsed);
    }
    getTime() {
      return this.timeElapsed;
    }
  };

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
    score;
    isCircular;
    constructor(levelNumber, targetValue, userSelection, displayUserSelectionElement, referenceEl, targetElProperty, targetEl, userSelectEl, messageEl2, score2, isCircular = false) {
      this.levelNumber = levelNumber;
      this.targetValue = targetValue;
      this.userSelection = userSelection;
      this.displayUserSelectionElement = displayUserSelectionElement;
      this.referenceEl = referenceEl;
      this.targetElProperty = targetElProperty;
      this.targetEl = targetEl;
      this.userSelectEl = userSelectEl;
      this.messageEl = messageEl2;
      this.score = score2;
      this.isCircular = isCircular;
      this.updateGameUI();
    }
    play() {
      this.referenceEl.style.setProperty(
        this.targetElProperty,
        this.formatPropertyValueToStringForLevel(this.levelNumber, this.targetValue)
      );
      this.userSelectEl.addEventListener("input", (e) => {
        this.userSelection = parseInt(e.target.value);
        this.updateGameUI();
      });
    }
    updateGameUI() {
      this.displayUserSelectionElement.textContent = `${this.userSelection}`;
      this.targetEl.style.setProperty(
        this.targetElProperty,
        this.formatPropertyValueToStringForLevel(this.levelNumber, this.userSelection)
      );
    }
    checkAnswer() {
      let difference;
      let percentageDifference;
      if (this.isCircular) {
        difference = Math.abs(this.targetValue - this.userSelection);
        difference = Math.min(difference, 360 - difference);
        percentageDifference = difference / 360 * 100;
      } else {
        difference = Math.abs(this.targetValue - this.userSelection);
        percentageDifference = difference / this.targetValue * 100;
      }
      console.log({ percentageDifference });
      if (percentageDifference <= PERFECT_PERCENT) {
        return true;
      }
      return false;
    }
    formatPropertyValueToStringForLevel(level, value) {
      if (level === 1) {
        return `${value}px`;
      }
      if (level === 2) {
        return `"wdth" ${value}`;
      }
      if (level === 3) {
        return `"wght" ${value}`;
      }
      if (level === 4) {
        return `${value}px`;
      }
      if (level === 5) {
        return `${value}%`;
      }
      if (level === 6) {
        const boxShadowString = getComputedStyle(this.referenceEl).boxShadow;
        const splitString = boxShadowString.split(" ");
        splitString[4] = `${value}px`;
        const newBoxShadowString = splitString.join(" ");
        return newBoxShadowString;
      }
      if (level === 7) {
        const boxShadowString = getComputedStyle(this.referenceEl).boxShadow;
        const splitString = boxShadowString.split(" ");
        const horizontalOffset = parseInt(splitString[4], 10);
        const verticalOffset = parseInt(splitString[5], 10);
        const distance = Math.sqrt(
          horizontalOffset * horizontalOffset + verticalOffset * verticalOffset
        );
        const { offsetX, offsetY } = convertDegreeToBoxShadowOffset(value, distance);
        splitString[4] = `${offsetX}px`;
        splitString[5] = `${offsetY}px`;
        const newBoxShadowString = splitString.join(" ");
        return newBoxShadowString;
      }
      return "";
    }
  };

  // src/utils/Score.ts
  var Score = class {
    constructor(scoreElement) {
      this.scoreElement = scoreElement;
      this.scoreElement.textContent = this.currentScore.toString();
    }
    currentScore = 0;
    updateScore(targetValue, userSelection, isCircular = false) {
      const points = this.calculateScore(targetValue, userSelection, isCircular);
      this.currentScore += points;
      this.scoreElement.textContent = this.currentScore.toString();
      return points;
    }
    calculateScore(targetValue, userSelection, isCircular = false) {
      let difference;
      let percentageDifference;
      if (isCircular) {
        difference = Math.abs(targetValue - userSelection);
        difference = Math.min(difference, 360 - difference);
        percentageDifference = difference / 360 * 100;
      } else {
        difference = Math.abs(targetValue - userSelection);
        percentageDifference = difference / targetValue * 100;
      }
      if (percentageDifference <= PERFECT_PERCENT) {
        return POINTS_FOR_PERFECT;
      }
      if (percentageDifference <= GOOD_PERCENT) {
        return POINTS_FOR_GOOD;
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
  var startGameButton = document.querySelector('[data-game="start-game"]' /* START_GAME_BUTTON */);
  var countdownEl = document.querySelector('[data-game="countdown"]' /* COUNTDOWN_ELEMENT */);
  var introEl = document.querySelector('[data-game="intro"]' /* INTRO_ELEMENT */);
  var gameEl = document.querySelector('[data-game="game"]' /* GAME_ELEMENT */);
  var endEl = document.querySelector('[data-game="end"]' /* END_ELEMENT */);
  var endTextEl = document.querySelector('[data-game="end-text"]' /* END_TEXT_ELEMENT */);
  var tryAgainButton = document.querySelector('[data-game="try-again"]' /* TRY_AGAIN_BUTTON */);
  var glowTopEmbed = document.querySelector('[data-game="glow-top-embed"]' /* GLOW_TOP_EMBED */);
  var penaltyOverlay = document.querySelector('[data-game="penalty-overlay"]' /* PENALTY_OVERLAY */);
  var gameWindow = document.querySelector('[data-game="game-window"]' /* GAME_WINDOW */);
  var currentLevel = 1;
  var levels = [];
  var numLevels = Object.keys(LEVEL_PROPERTIES_NAMES).length;
  if (!scoreEl || !roundEl || !messageEl || !timerEl || !countdownEl || !introEl || !gameEl || !endEl || !endTextEl || !tryAgainButton || !startGameButton || !glowTopEmbed || !penaltyOverlay || !gameWindow) {
    throw new Error("Error retrieving necessary game elements.");
  }
  var score = new Score(scoreEl);
  var stopwatch = new Stopwatch(0, timerEl);
  roundEl.textContent = currentLevel.toString().padStart(2, "0");
  hideNextShowSubmit();
  for (let i = 1; i <= numLevels; i++) {
    if (!messageEl || !timerEl) {
      throw new Error("Message and timer elements are required");
    }
    const level = new Level(
      i,
      // level number
      getRandomInt(parseInt(userSelectEls[i - 1].min, 10), parseInt(userSelectEls[i - 1].max, 10)),
      // target value
      parseInt(userSelectEls[i - 1].value, 10),
      // user selection
      displaySelectEls[i - 1],
      // element displaying user selection
      referenceEls[i - 1],
      // reference element
      LEVEL_PROPERTIES_NAMES[i],
      // target element property
      targetEls[i - 1],
      userSelectEls[i - 1],
      messageEl,
      score,
      i === 7 ? true : false
      // level 7 score is based ond degrees
    );
    levels.push(level);
  }
  function handleStartGameButtonClicked() {
    if (!introEl || !gameEl || !countdownEl) {
      throw new Error("Intro and game elements are required");
    }
    if (!countdownEl) {
      throw new Error("Countdown element is required");
    }
    introEl.style.setProperty("display", "none");
    gameEl.style.setProperty("display", "block");
    const countdown = setInterval(() => {
      const currentCountdown = parseInt(countdownEl.textContent || "3", 10);
      if (currentCountdown === 1) {
        clearInterval(countdown);
        simulateClick(tabLinks[currentLevel]);
        stopwatch.start();
        levels[currentLevel - 1].play();
      } else {
        countdownEl.textContent = (currentCountdown - 1).toString();
      }
    }, 1e3);
  }
  function resetGame() {
    if (!roundEl || !countdownEl || !score || !stopwatch) {
      throw new Error("Error resetting the game");
    }
    countdownEl.textContent = "3";
    score.reset();
    stopwatch.reset();
    currentLevel = 1;
    simulateClick(tabLinks[0]);
    roundEl.textContent = currentLevel.toString().padStart(2, "0");
  }
  function gameOver() {
    stopwatch.stop();
    if (!gameEl || !endEl || !endTextEl) {
      throw new Error("Game and end elements are required");
    }
    const timeDisplay = formatHumanReadableTime(stopwatch.getTime());
    endTextEl.textContent = `Congratulations! You finished the game in ${timeDisplay}.`;
    gameEl.style.setProperty("display", "none");
    endEl.style.setProperty("display", "block");
  }
  function handleAnswer(isCorrect) {
    if (!messageEl || !glowTopEmbed || !penaltyOverlay || !gameWindow)
      return;
    if (isCorrect) {
      glowTopEmbed.classList.add(CLASSNAMES.SUCCESS);
      messageEl.classList.add(CLASSNAMES.SUCCESS);
      messageEl.textContent = "Congratulations! You nailed it";
      hideSubmitShowNext();
    } else {
      let penaltyTime = (PENALTY_DURATION - 1) / 1e3;
      messageEl.textContent = `Incorrect! Try again in ${Math.round(penaltyTime)} ${penaltyTime === 1 ? "second" : "seconds"}.`;
      penaltyOverlay.classList.add(CLASSNAMES.ACTIVE);
      glowTopEmbed.classList.add(CLASSNAMES.ERROR);
      messageEl.classList.add(CLASSNAMES.ERROR);
      gameWindow.classList.add(CLASSNAMES.SHAKE);
      setTimeout(() => {
        gameWindow.classList.remove(CLASSNAMES.SHAKE);
      }, SHAKE_DURATION);
      const penaltyInterval = setInterval(() => {
        messageEl.textContent = `Incorrect! Try again in ${Math.round(penaltyTime)} ${penaltyTime === 1 ? "second" : "seconds"}.`;
        penaltyTime -= 1;
      }, 1e3);
      setTimeout(() => {
        clearInterval(penaltyInterval);
        penaltyOverlay.classList.remove(CLASSNAMES.ACTIVE);
        glowTopEmbed.classList.remove(CLASSNAMES.ERROR);
        messageEl.classList.remove(CLASSNAMES.ERROR);
      }, PENALTY_DURATION);
    }
  }
  startGameButton.addEventListener("click", () => {
    handleStartGameButtonClicked();
  });
  submitButtons.forEach((button) => {
    button.addEventListener("click", handleSubmitButtonClicked);
  });
  nextRoundButtons.forEach((button) => {
    button.addEventListener("click", handleNextRoundButtonClicked);
  });
  tryAgainButton.addEventListener("click", () => {
    resetGame();
    endEl.style.setProperty("display", "none");
    introEl.style.setProperty("display", "block");
  });
  function handleSubmitButtonClicked() {
    if (!messageEl || !glowTopEmbed)
      return;
    const isCorrect = levels[currentLevel - 1].checkAnswer();
    handleAnswer(isCorrect);
  }
  function handleNextRoundButtonClicked() {
    if (!roundEl) {
      throw new Error("Round element is required");
    }
    if (!glowTopEmbed || !messageEl)
      return;
    currentLevel += 1;
    glowTopEmbed.classList.remove(CLASSNAMES.SUCCESS);
    messageEl.classList.remove(CLASSNAMES.SUCCESS);
    if (currentLevel <= levels.length) {
      roundEl.textContent = currentLevel.toString().padStart(2, "0");
      simulateClick(tabLinks[currentLevel]);
      levels[currentLevel - 1].play();
      hideNextShowSubmit();
    } else {
      gameOver();
    }
  }
  function hideSubmitShowNext() {
    submitButtons.forEach((button) => {
      button.style.setProperty("display", "none");
    });
    nextRoundButtons.forEach((button) => {
      button.style.setProperty("display", "block");
    });
  }
  function hideNextShowSubmit() {
    submitButtons.forEach((button) => {
      button.style.setProperty("display", "block");
    });
    nextRoundButtons.forEach((button) => {
      button.style.setProperty("display", "none");
    });
  }
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function simulateClick(element) {
    const clickEvent = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: false
    });
    element.dispatchEvent(clickEvent);
  }
})();
//# sourceMappingURL=index.js.map
