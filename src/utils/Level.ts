export class Level {
  targetValue: number;
  userSelection: number;
  targetEl: HTMLElement;
  targetElProperty: string;
  userSelectEl: HTMLInputElement;
  levelNumber: number;
  messageEl: HTMLDivElement;

  constructor(
    levelNumber: number,
    targetValue: number,
    userSelection: number,
    targetElProperty: string,
    targetEl: HTMLElement,
    userSelectEl: HTMLInputElement,
    messageEl: HTMLDivElement
  ) {
    this.levelNumber = levelNumber;
    this.targetValue = targetValue;
    this.userSelection = userSelection;
    this.targetElProperty = targetElProperty;
    this.targetEl = targetEl;
    this.userSelectEl = userSelectEl;
    this.messageEl = messageEl;
  }

  play(): void {
    console.log(`level ${this.levelNumber} started`);
    this.userSelectEl.addEventListener('input', (e) => {
      this.userSelection = parseInt((e.target as HTMLInputElement).value);
      this.updateGameUI();
      console.log(`user selected: ${this.userSelection}`);
    });
  }

  updateGameUI(): void {
    if (this.levelNumber === 1) {
      // columnGap
      this.targetEl.style.setProperty(this.targetElProperty, `${this.userSelection}px`);
    } else if (this.levelNumber === 2) {
      // variableFontWeight
      this.targetEl.style.setProperty(this.targetElProperty, `"wght" ${this.userSelection}`);
    }
    console.log(`update target ${this.targetElProperty} to ${this.userSelection}`);
  }

  checkAnswer(): boolean {
    //console.log(`user selected: ${this.userSelection} and target is: ${this.targetValue}`);
    this.messageEl.textContent = `user selected: ${this.userSelection} and target is: ${this.targetValue}`;
    return this.targetValue === this.userSelection;
  }
}
