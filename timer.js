class Timer {
    constructor(seconds, callback) {
        this.duration = seconds * 1000; // Convert seconds to milliseconds
        this.callback = callback;
        this.timerId = null;
        this.remainingTime = this.duration;
        this.isPaused = false;
    }

    // Start or restart the timer, resetting the remaining time
    start() {
        if (this.timerId !== null) {
            this.stop(); // Clear any existing timer
        }
        this.remainingTime = this.duration;
        this.runTimer();
    }

    // Start the timer only if it’s not already running
    startIfNotRunning() {
        if (this.timerId === null) {
            this.runTimer();
        }
    }

    // Internal method to handle timer running
    runTimer() {
        this.timerId = setTimeout(() => {
            this.callback();
            this.timerId = null; // Clear the timer ID once the callback is executed
        }, this.remainingTime);
    }

    // Stop the timer
    stop() {
        if (this.timerId !== null) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
        this.remainingTime = this.duration;
    }

    // Pause the timer
    pause() {
        if (this.timerId !== null) {
            clearTimeout(this.timerId);
            this.remainingTime -= Date.now() - (this.duration - this.remainingTime);
            this.timerId = null;
            this.isPaused = true;
        }
    }

    // Unpause the timer
    unpause() {
        if (this.isPaused) {
            this.runTimer();
            this.isPaused = false;
        }
    }

    // Check if the timer is running
    isRunning() {
        return this.timerId !== null;
    }

    // Check how much time is left on the timer
    getTimeLeft() {
        if (this.timerId !== null) {
            return this.remainingTime - (Date.now() - (this.duration - this.remainingTime));
        } else {
            return this.remainingTime;
        }
    }
}

export default Timer;