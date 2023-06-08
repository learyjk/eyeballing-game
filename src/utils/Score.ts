export class Score {
  private currentScore: number = 0;

  constructor(private scoreElement: HTMLElement) {
    this.scoreElement.textContent = this.currentScore.toString(); // initialize the score display
  }

  updateScore(targetValue: number, userSelection: number) {
    let points = this.calculateScore(targetValue, userSelection);
    this.currentScore += points; // update score
    this.scoreElement.textContent = this.currentScore.toString(); // update score display
    return points;
  }

  calculateScore(targetValue: number, userSelection: number) {
    const percentageDifference = Math.abs((targetValue - userSelection) / targetValue) * 100;

    if (percentageDifference <= 10) {
      return 2;
    } else if (percentageDifference <= 20) {
      return 1;
    }
    return 0;
  }

  reset() {
    this.currentScore = 0; // reset score
    this.scoreElement.textContent = this.currentScore.toString(); // reset score display
  }

  getScore() {
    return this.currentScore; // get the current score
  }
}
