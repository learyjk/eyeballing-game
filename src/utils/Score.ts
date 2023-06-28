import { GOOD_PERCENT, PERFECT_PERCENT, POINTS_FOR_GOOD, POINTS_FOR_PERFECT } from './constants';

export class Score {
  private currentScore = 0;

  constructor(private scoreElement: HTMLElement) {
    this.scoreElement.textContent = this.currentScore.toString(); // initialize the score display
  }

  updateScore(targetValue: number, userSelection: number, isCircular = false) {
    const points = this.calculateScore(targetValue, userSelection, isCircular);
    this.currentScore += points; // update score
    this.scoreElement.textContent = this.currentScore.toString(); // update score display
    return points;
  }

  calculateScore(targetValue: number, userSelection: number, isCircular = false) {
    let difference;
    let percentageDifference;

    if (isCircular) {
      difference = Math.abs(targetValue - userSelection);
      // Adjust difference for angle wrap-around
      difference = Math.min(difference, 360 - difference);

      // calculate percentage
      percentageDifference = (difference / 360) * 100;
    } else {
      difference = Math.abs(targetValue - userSelection);
      percentageDifference = (difference / targetValue) * 100;
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
    this.currentScore = 0; // reset score
    this.scoreElement.textContent = this.currentScore.toString(); // reset score display
  }

  getScore() {
    return this.currentScore; // get the current score
  }
}
