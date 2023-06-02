import { Level } from './utils/Level';

enum SELECTORS {
  TARGET_ELEMENTS = '[data-game="target-el"]',
  USER_SELECT_ELEMENTS = '[data-game="user-select-el"]',
  SUBMIT_BUTTONS = '[data-game="submit-button"]',
  MESSAGE_ELEMENTS = '[data-game="message-el"]',
  NEXT_ROUND_BUTTONS = '[data-game="next-button"]',
  TAB_LINKS = '.w-tab-link',
}

// GET ELEMENTS
const targetEls = document.querySelectorAll<HTMLElement>(SELECTORS.TARGET_ELEMENTS);
const userSelectEls = document.querySelectorAll<HTMLInputElement>(SELECTORS.USER_SELECT_ELEMENTS);
const submitButtons = document.querySelectorAll<HTMLAnchorElement>(SELECTORS.SUBMIT_BUTTONS);
const messageEls = document.querySelectorAll<HTMLDivElement>(SELECTORS.MESSAGE_ELEMENTS);
const nextRoundButtons = document.querySelectorAll<HTMLAnchorElement>(SELECTORS.NEXT_ROUND_BUTTONS);
const tabLinks = document.querySelectorAll<HTMLAnchorElement>(SELECTORS.TAB_LINKS);

// LOG THEM JUST FOR DEBUGGING
console.log({ targetEls, userSelectEls, submitButtons, messageEls, nextRoundButtons });

// STATE VARIABLES
let currentLevel = 1;

// CREATE LEVELS
const levels: Level[] = [];

let levelOne = new Level(
  1, // level number
  Math.floor(Math.random() * 100), // target value 0 to 100
  0, // user selection
  'column-gap', // target element property
  targetEls[0],
  userSelectEls[0],
  messageEls[0]
);

let levelTwo = new Level(
  2, // level number
  Math.floor(Math.random() * 800 + 100), // target value 100-900
  0, // user selection
  'font-variation-settings', // target element property
  targetEls[1],
  userSelectEls[1],
  messageEls[1]
);

// add levels to levels array
levels.push(levelOne);
levels.push(levelTwo);

// start playing first level
levels[currentLevel - 1].play();

// EVENT LISTENERS
submitButtons.forEach((button) => {
  button.addEventListener('click', handleSubmitButtonClicked);
});

nextRoundButtons.forEach((button) => {
  button.addEventListener('click', handleNextRoundButtonClicked);
});

// HANDLERS
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

// HELPERS
function hideSubmitShowNext() {
  submitButtons.forEach((button) => {
    button.style.setProperty('visibility', 'hidden');
  });
  nextRoundButtons.forEach((button) => {
    button.style.setProperty('visibility', 'visible');
  });
}

function hideNextShowSubmit() {
  submitButtons.forEach((button) => {
    button.style.setProperty('visibility', 'visible');
  });
  nextRoundButtons.forEach((button) => {
    button.style.setProperty('visibility', 'hidden');
  });
}

// need to simulate click to trigger tab change
// using click() causes scroll issues in Safari
function simulateClick(element: HTMLAnchorElement) {
  let clickEvent = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: false,
  });
  element.dispatchEvent(clickEvent);
}
