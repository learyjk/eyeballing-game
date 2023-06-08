export class Timer {
  private countdown: any; // holds the setInterval
  private timeRemaining: number; // holds the current remaining time

  constructor(private timeLimit: number, private timeElement: HTMLElement) {
    this.timeRemaining = this.timeLimit;
    console.log({ timeElement });
    this.timeElement.textContent = this.formatTime(this.timeRemaining); // update timer display
  }

  start() {
    this.countdown = setInterval(() => {
      console.log(`timeRemaining: ${this.timeRemaining}`);
      this.timeRemaining--;
      if (this.timeRemaining < 0) {
        this.stop();
      } else {
        this.timeElement.textContent = this.formatTime(this.timeRemaining); // update timer display
      }
    }, 1000); // countdown every second
  }

  stop() {
    clearInterval(this.countdown); // stop the countdown
  }

  reset() {
    this.stop();
    this.timeRemaining = this.timeLimit; // reset time remaining to the initial time limit
    this.timeElement.textContent = this.formatTime(this.timeRemaining); // update timer display
  }

  getTime() {
    return this.timeRemaining; // get the remaining time
  }

  private formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`; // format time to MM:SS
  }
}
