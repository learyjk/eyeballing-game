"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

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
    constructor(levelNumber, targetValue, userSelection, displayUserSelectionElement, referenceEl, targetElProperty, targetEl, userSelectEl, messageEl2) {
      this.levelNumber = levelNumber;
      this.targetValue = targetValue;
      this.userSelection = userSelection;
      this.displayUserSelectionElement = displayUserSelectionElement;
      this.referenceEl = referenceEl;
      this.targetElProperty = targetElProperty;
      this.targetEl = targetEl;
      this.userSelectEl = userSelectEl;
      this.messageEl = messageEl2;
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
      this.messageEl.textContent = `user selected: ${this.userSelection} and target is: ${this.targetValue}`;
      return this.targetValue === this.userSelection;
    }
    formatPropertyValueToStringForLevel(level, value) {
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
        console.log({ newBoxShadowString });
        return newBoxShadowString;
      }
      return "";
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
  console.log({
    referenceEls,
    targetEls,
    userSelectEls,
    submitButtons,
    messageEl,
    nextRoundButtons,
    displaySelectEls,
    tabLinks
  });
  var currentLevel = 1;
  var levels = [];
  var LEVEL_PROPERTIES_NAMES = {
    1: "-webkit-text-stroke-width",
    2: "font-variation-settings",
    3: "font-variation-settings",
    4: "border-radius",
    5: "opacity",
    6: "box-shadow"
  };
  for (let i = 0; i < 6; i++) {
    let level = new Level(
      i + 1,
      // level number
      getRandomInt(parseInt(userSelectEls[i].min, 10), parseInt(userSelectEls[i].max)),
      // target value 1-10
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
      messageEl
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
