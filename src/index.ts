import {
  CLASSNAMES,
  LEVEL_PROPERTIES_NAMES,
  PENALTY_DURATION,
  SHAKE_DURATION,
} from '$utils/constants';
import { formatHumanReadableTime } from '$utils/helpers';
import { Stopwatch } from '$utils/Stopwatch';

import { Level } from './utils/Level';
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
  START_GAME_BUTTON = '[data-game="start-game"]',
  COUNTDOWN_ELEMENT = '[data-game="countdown"]',
  INTRO_ELEMENT = '[data-game="intro"]',
  GAME_ELEMENT = '[data-game="game"]',
  END_ELEMENT = '[data-game="end"]',
  END_TEXT_ELEMENT = '[data-game="end-text"]',
  TRY_AGAIN_BUTTON = '[data-game="try-again"]',
  GLOW_TOP_EMBED = '[data-game="glow-top-embed"]',
  PENALTY_OVERLAY = '[data-game="penalty-overlay"]',
  GAME_WINDOW = '[data-game="game-window"]',
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
const startGameButton = document.querySelector<HTMLAnchorElement>(SELECTORS.START_GAME_BUTTON);
const countdownEl = document.querySelector<HTMLDivElement>(SELECTORS.COUNTDOWN_ELEMENT);
const introEl = document.querySelector<HTMLDivElement>(SELECTORS.INTRO_ELEMENT);
const gameEl = document.querySelector<HTMLDivElement>(SELECTORS.GAME_ELEMENT);
const endEl = document.querySelector<HTMLDivElement>(SELECTORS.END_ELEMENT);
const endTextEl = document.querySelector<HTMLDivElement>(SELECTORS.END_TEXT_ELEMENT);
const tryAgainButton = document.querySelector<HTMLAnchorElement>(SELECTORS.TRY_AGAIN_BUTTON);
const glowTopEmbed = document.querySelector<HTMLDivElement>(SELECTORS.GLOW_TOP_EMBED);
const penaltyOverlay = document.querySelector<HTMLDivElement>(SELECTORS.PENALTY_OVERLAY);
const gameWindow = document.querySelector<HTMLDivElement>(SELECTORS.GAME_WINDOW);

// LOG THEM JUST FOR DEBUGGING
// console.log({
//   referenceEls,
//   targetEls,
//   userSelectEls,
//   submitButtons,
//   messageEl,
//   nextRoundButtons,
//   displaySelectEls,
//   tabLinks,
//   timerEl,
//   scoreEl,
//   roundEl,
//   startGameButton,
// });

// STATE VARIABLES
let currentLevel = 1;

// CREATE LEVELS
const levels: Level[] = [];

const numLevels = Object.keys(LEVEL_PROPERTIES_NAMES).length;
if (
  !scoreEl ||
  !roundEl ||
  !messageEl ||
  !timerEl ||
  !countdownEl ||
  !introEl ||
  !gameEl ||
  !endEl ||
  !endTextEl ||
  !tryAgainButton ||
  !startGameButton ||
  !glowTopEmbed ||
  !penaltyOverlay ||
  !gameWindow
) {
  throw new Error('Error retrieving necessary game elements.');
}
const score = new Score(scoreEl);
const stopwatch = new Stopwatch(0, timerEl);
roundEl.textContent = currentLevel.toString().padStart(2, '0');
hideNextShowSubmit();

for (let i = 1; i <= numLevels; i++) {
  if (!messageEl || !timerEl) {
    throw new Error('Message and timer elements are required');
  }

  const level = new Level(
    i, // level number
    getRandomInt(parseInt(userSelectEls[i - 1].min, 10), parseInt(userSelectEls[i - 1].max, 10)), // target value
    parseInt(userSelectEls[i - 1].value, 10), // user selection
    displaySelectEls[i - 1], // element displaying user selection
    referenceEls[i - 1], // reference element
    LEVEL_PROPERTIES_NAMES[i], // target element property
    targetEls[i - 1],
    userSelectEls[i - 1],
    messageEl,
    score,
    i === 7 ? true : false // level 7 score is based on degrees
  );
  levels.push(level);
}

function handleStartGameButtonClicked() {
  if (!introEl || !gameEl || !countdownEl) {
    throw new Error('Intro and game elements are required');
  }
  if (!countdownEl) {
    throw new Error('Countdown element is required');
  }
  introEl.style.setProperty('display', 'none');
  gameEl.style.setProperty('display', 'block');

  const countdown = setInterval(() => {
    const currentCountdown = parseInt(countdownEl.textContent || '3', 10);
    if (currentCountdown === 1) {
      clearInterval(countdown);
      simulateClick(tabLinks[currentLevel]);
      // start playing first level
      stopwatch.start();
      levels[currentLevel - 1].play();
    } else {
      countdownEl.textContent = (currentCountdown - 1).toString();
    }
  }, 1000);
}

function resetGame() {
  if (!roundEl || !countdownEl || !score || !stopwatch) {
    throw new Error('Error resetting the game');
  }
  countdownEl.textContent = '3';
  score.reset();
  stopwatch.reset();
  currentLevel = 1;
  simulateClick(tabLinks[0]);
  roundEl.textContent = currentLevel.toString().padStart(2, '0');
}

function gameOver() {
  stopwatch.stop();
  if (!gameEl || !endEl || !endTextEl) {
    throw new Error('Game and end elements are required');
  }
  const timeDisplay = formatHumanReadableTime(stopwatch.getTime());
  //const finalScore = score.getScore();

  endTextEl.textContent = `Congratulations! You finished the game in ${timeDisplay}.`;

  gameEl.style.setProperty('display', 'none');
  endEl.style.setProperty('display', 'block');
}

function handleAnswer(isCorrect: boolean) {
  if (!messageEl || !glowTopEmbed || !penaltyOverlay || !gameWindow) return;
  if (isCorrect) {
    glowTopEmbed.classList.add(CLASSNAMES.SUCCESS);
    messageEl.classList.add(CLASSNAMES.SUCCESS);
    messageEl.textContent = 'Congratulations! You nailed it';
    hideSubmitShowNext();
  } else {
    // time penalty
    let penaltyTime = (PENALTY_DURATION - 1) / 1000;
    messageEl.textContent = `Incorrect! Try again in ${Math.round(penaltyTime)} ${
      penaltyTime === 1 ? 'second' : 'seconds'
    }.`;

    penaltyOverlay.classList.add(CLASSNAMES.ACTIVE);
    glowTopEmbed.classList.add(CLASSNAMES.ERROR);
    messageEl.classList.add(CLASSNAMES.ERROR);
    gameWindow.classList.add(CLASSNAMES.SHAKE);

    setTimeout(() => {
      gameWindow.classList.remove(CLASSNAMES.SHAKE);
    }, SHAKE_DURATION);

    // This interval will run every second to update the messageEl text content
    const penaltyInterval = setInterval(() => {
      messageEl.textContent = `Incorrect! Try again in ${Math.round(penaltyTime)} ${
        penaltyTime === 1 ? 'second' : 'seconds'
      }.`;
      penaltyTime -= 1;
    }, 1000);

    setTimeout(() => {
      clearInterval(penaltyInterval); // Clear the interval after PENALTY_DURATION
      penaltyOverlay.classList.remove(CLASSNAMES.ACTIVE);
      glowTopEmbed.classList.remove(CLASSNAMES.ERROR);
      messageEl.classList.remove(CLASSNAMES.ERROR);
    }, PENALTY_DURATION);
  }
}

// EVENT LISTENERS
startGameButton.addEventListener('click', () => {
  handleStartGameButtonClicked();
});

submitButtons.forEach((button) => {
  button.addEventListener('click', handleSubmitButtonClicked);
});

nextRoundButtons.forEach((button) => {
  button.addEventListener('click', handleNextRoundButtonClicked);
});

tryAgainButton.addEventListener('click', () => {
  resetGame();
  endEl.style.setProperty('display', 'none');
  introEl.style.setProperty('display', 'block');
});

// HANDLERS
function handleSubmitButtonClicked() {
  if (!messageEl || !glowTopEmbed) return;
  const isCorrect = levels[currentLevel - 1].checkAnswer();
  handleAnswer(isCorrect);
}

function handleNextRoundButtonClicked() {
  if (!roundEl) {
    throw new Error('Round element is required');
  }
  if (!glowTopEmbed || !messageEl) return;
  currentLevel += 1;

  // ui updates
  glowTopEmbed.classList.remove(CLASSNAMES.SUCCESS);
  messageEl.classList.remove(CLASSNAMES.SUCCESS);

  if (currentLevel <= levels.length) {
    roundEl.textContent = currentLevel.toString().padStart(2, '0');
    simulateClick(tabLinks[currentLevel]);
    levels[currentLevel - 1].play();
    hideNextShowSubmit();
  } else {
    // last level completed
    gameOver();
  }
}

// HELPERS
function hideSubmitShowNext() {
  submitButtons.forEach((button) => {
    button.style.setProperty('display', 'none');
  });
  nextRoundButtons.forEach((button) => {
    button.style.setProperty('display', 'block');
  });
}

function hideNextShowSubmit() {
  submitButtons.forEach((button) => {
    button.style.setProperty('display', 'block');
  });
  nextRoundButtons.forEach((button) => {
    button.style.setProperty('display', 'none');
  });
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// need to simulate click to trigger tab change
// using click() causes scroll issues in Safari
function simulateClick(element: HTMLAnchorElement) {
  const clickEvent = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: false,
  });
  element.dispatchEvent(clickEvent);
}
