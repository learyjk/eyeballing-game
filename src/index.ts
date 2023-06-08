import { selectInputElement } from '@finsweet/ts-utils';
import { Level } from './utils/Level';
import { Timer } from './utils/Timer';
import { Score } from './utils/Score';

enum SELECTORS {
  REFERENCE_ELEMENTS = '[data-game="reference-el"]', // element displaying target value
  TARGET_ELEMENTS = '[data-game="target-el"]', // element displaying user selection
  DISPLAY_SELECT = '[data-game="display-user-selection"]', // element displaying user selection
  USER_SELECT_ELEMENTS = '[data-game="user-select-el"]', // element user uses to select
  MESSAGE_ELEMENT = '[data-game="message-el"]', // element to display message
  SUBMIT_BUTTONS = '[data-game="submit-button"]', // button to submit answer
  NEXT_ROUND_BUTTONS = '[data-game="next-button"]', // button to go to next round
  TAB_LINKS = '.w-tab-link', // tab links to control navigation
  TIMER_ELEMENT = '[data-game="time-remaining"]',
  SCORE_ELEMENT = '[data-game="score"]',
  ROUND_ELEMENT = '[data-game="round-number"]',
}

// GET ELEMENTS
const referenceEls = document.querySelectorAll<HTMLElement>(SELECTORS.REFERENCE_ELEMENTS);
const targetEls = document.querySelectorAll<HTMLElement>(SELECTORS.TARGET_ELEMENTS);
const displaySelectEls = document.querySelectorAll<HTMLElement>(SELECTORS.DISPLAY_SELECT);
const userSelectEls = document.querySelectorAll<HTMLInputElement>(SELECTORS.USER_SELECT_ELEMENTS);
const submitButtons = document.querySelectorAll<HTMLAnchorElement>(SELECTORS.SUBMIT_BUTTONS);
const nextRoundButtons = document.querySelectorAll<HTMLAnchorElement>(SELECTORS.NEXT_ROUND_BUTTONS);
const messageEl = document.querySelector<HTMLDivElement>(SELECTORS.MESSAGE_ELEMENT);
const tabLinks = document.querySelectorAll<HTMLAnchorElement>(SELECTORS.TAB_LINKS);
const timerEl = document.querySelector<HTMLDivElement>(SELECTORS.TIMER_ELEMENT);
const scoreEl = document.querySelector<HTMLDivElement>(SELECTORS.SCORE_ELEMENT);
const roundEl = document.querySelector<HTMLDivElement>(SELECTORS.ROUND_ELEMENT);

// LOG THEM JUST FOR DEBUGGING
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
  roundEl,
});

// STATE VARIABLES
let currentLevel = 1;

// CREATE LEVELS
const levels: Level[] = [];

let LEVEL_PROPERTIES_NAMES: Record<number, string> = {
  1: '-webkit-text-stroke-width',
  2: 'font-variation-settings',
  3: 'font-variation-settings',
  4: 'border-radius',
  5: 'opacity',
  6: 'box-shadow',
  7: 'box-shadow',
};

let numLevels = Object.keys(LEVEL_PROPERTIES_NAMES).length;
let score = new Score(scoreEl!);
roundEl!.textContent = currentLevel.toString().padStart(2, '0');
hideNextShowSubmit();

for (let i = 0; i < numLevels; i++) {
  let level = new Level(
    i + 1, // level number
    getRandomInt(parseInt(userSelectEls[i].min, 10), parseInt(userSelectEls[i].max, 10)), // target value
    parseInt(userSelectEls[i].value, 10), // user selection
    displaySelectEls[i], // element displaying user selection
    referenceEls[i], // reference element
    LEVEL_PROPERTIES_NAMES[i + 1], // target element property
    targetEls[i],
    userSelectEls[i],
    messageEl!,
    new Timer(90, timerEl!),
    score!
  );
  levels.push(level);
}

/*
// variable font weight game
let levelOne = new Level(
  1, // level number
  getRandomInt(parseInt(userSelectEls[0].min, 10), parseInt(userSelectEls[0].max)), // target value 1-10
  parseInt(userSelectEls[0].value, 10), // user selection
  displaySelectEls[0], // element displaying user selection
  referenceEls[0], // reference element
  LEVEL_PROPERTIES_NAMES[i], // target element property
  targetEls[0],
  userSelectEls[0],
  messageEl!
);

// variable font width game
let levelTwo = new Level(
  2, // level number
  getRandomInt(parseInt(userSelectEls[1].min, 10), parseInt(userSelectEls[1].max)),
  parseInt(userSelectEls[1].value, 10), // user selection
  displaySelectEls[1], // element displaying user selection
  referenceEls[1], // reference element
  'font-variation-settings', // target element property
  targetEls[1],
  userSelectEls[1],
  messageEl!
);

// variable font weight game
let levelThree = new Level(
  3, // level number
  getRandomInt(parseInt(userSelectEls[2].min, 10), parseInt(userSelectEls[2].max)),
  parseInt(userSelectEls[2].value, 20), // user selection
  displaySelectEls[2], // element displaying user selection
  referenceEls[2], // reference element
  'font-variation-settings', // target element property
  targetEls[2],
  userSelectEls[2],
  messageEl!
);


// button border radius
const levelNumber = 4;
let levelFour = new Level(
  levelNumber, // level number
  getRandomInt(
    parseInt(userSelectEls[levelNumber - 1].min, 10),
    parseInt(userSelectEls[levelNumber - 1].max)
  ),
  parseInt(userSelectEls[levelNumber - 1].value, 10), // user selection
  displaySelectEls[levelNumber - 1], // element displaying user selection
  referenceEls[levelNumber - 1], // reference element
  'border-radius', // target element property
  targetEls[levelNumber - 1],
  userSelectEls[levelNumber - 1],
  messageEl!
);

// add levels to levels array
levels.push(levelOne);
levels.push(levelTwo);
levels.push(levelThree);
*/

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
  roundEl!.textContent = currentLevel.toString().padStart(2, '0');
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

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
