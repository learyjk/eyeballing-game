import { convertDegreeToBoxShadowOffset } from './helpers';
import { Timer } from './Timer';
import { Score } from './Score';

export class Level {
  targetValue: number;
  userSelection: number;
  displayUserSelectionElement: HTMLElement;
  referenceEl: HTMLElement;
  targetEl: HTMLElement;
  targetElProperty: string;
  userSelectEl: HTMLInputElement;
  levelNumber: number;
  messageEl: HTMLDivElement;
  timer: Timer;
  score: Score;

  constructor(
    levelNumber: number,
    targetValue: number,
    userSelection: number,
    displayUserSelectionElement: HTMLElement,
    referenceEl: HTMLElement,
    targetElProperty: string,
    targetEl: HTMLElement,
    userSelectEl: HTMLInputElement,
    messageEl: HTMLDivElement,
    timer: Timer,
    score: Score
  ) {
    this.levelNumber = levelNumber;
    this.targetValue = targetValue;
    this.userSelection = userSelection;
    this.displayUserSelectionElement = displayUserSelectionElement;
    this.referenceEl = referenceEl;
    this.targetElProperty = targetElProperty;
    this.targetEl = targetEl;
    this.userSelectEl = userSelectEl;
    this.messageEl = messageEl;
    this.timer = timer;
    this.score = score;
  }

  play(): void {
    console.log(`level ${this.levelNumber} started`);

    // update the reference element
    console.log(`update reference ${this.targetElProperty} to ${this.targetValue}`);
    this.referenceEl.style.setProperty(
      this.targetElProperty,
      this.formatPropertyValueToStringForLevel(this.levelNumber, this.targetValue)
    );

    this.userSelectEl.addEventListener('input', (e) => {
      this.userSelection = parseInt((e.target as HTMLInputElement).value);
      this.updateGameUI();
      console.log(`user selected: ${this.userSelection}`);
    });

    this.timer.start();
  }

  updateGameUI(): void {
    // update the element that displays user selection
    this.displayUserSelectionElement.textContent = `${this.userSelection}`;

    this.targetEl.style.setProperty(
      this.targetElProperty,
      this.formatPropertyValueToStringForLevel(this.levelNumber, this.userSelection)
    );

    console.log(`update target ${this.targetElProperty} to ${this.userSelection}`);
  }

  checkAnswer(): boolean {
    this.timer.stop();
    let points = this.score.updateScore(this.targetValue, this.userSelection);

    //console.log(`user selected: ${this.userSelection} and target is: ${this.targetValue}`);
    this.messageEl.textContent = `user selected: ${this.userSelection} and target is: ${this.targetValue}! +${points} points`;
    return this.targetValue === this.userSelection;
  }

  formatPropertyValueToStringForLevel(level: number, value: number): string {
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
      // opacity
      return `${value}%`;
    } else if (level === 6) {
      // box shadow
      let boxShadowString = getComputedStyle(this.referenceEl).boxShadow;
      let splitString = boxShadowString.split(' ');
      // Update the value at the position of the vertical offset in the shadow (4th value, index 3)
      splitString[4] = `${value}px`;
      let newBoxShadowString = splitString.join(' ');
      return newBoxShadowString;
    } else if (level === 7) {
      // get reference box shadow value
      let boxShadowString = getComputedStyle(this.referenceEl).boxShadow;
      // 'rgba(0, 0px 0px 0.5) -14px 14px 10px 0px inset'
      let splitString = boxShadowString.split(' ');

      // split into components
      let horizontalOffset = parseInt(splitString[4], 10);
      let verticalOffset = parseInt(splitString[5], 10);
      let distance = Math.sqrt(
        horizontalOffset * horizontalOffset + verticalOffset * verticalOffset
      );

      let { offsetX, offsetY } = convertDegreeToBoxShadowOffset(value, distance);

      // Update the value at the position of the vertical offset in the shadow (4th value, index 3)
      splitString[4] = `${offsetX}px`;
      splitString[5] = `${offsetY}px`;
      let newBoxShadowString = splitString.join(' ');
      return newBoxShadowString;
    }
    return '';
  }
}
