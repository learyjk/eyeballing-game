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

  constructor(
    levelNumber: number,
    targetValue: number,
    userSelection: number,
    displayUserSelectionElement: HTMLElement,
    referenceEl: HTMLElement,
    targetElProperty: string,
    targetEl: HTMLElement,
    userSelectEl: HTMLInputElement,
    messageEl: HTMLDivElement
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
    //console.log(`user selected: ${this.userSelection} and target is: ${this.targetValue}`);
    this.messageEl.textContent = `user selected: ${this.userSelection} and target is: ${this.targetValue}`;
    return this.targetValue === this.userSelection;
  }

  formatPropertyValueToStringForLevel(level: number, value: number): string {
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
      console.log({ newBoxShadowString });
      return newBoxShadowString;
    }
    return '';
  }
}
