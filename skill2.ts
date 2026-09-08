/* --- Countdown Timer ---

1. "Before countdown"
2. "After countdown"
3. "Time's up!"
4. "Countdown finished."

This happens because the setTimeout schedule the callback to run later on the event loop so 
that the synchronous code run immediately and completes first.
*/

const countdown = (seconds: number, callback: () => void) => {
  setTimeout(() => {
    console.log("Time's up!");
    callback();
  }, seconds * 1000);
};

console.log("message before the countdown call");
countdown(3, () => console.log("Countdown finished."));
console.log("message after the countdown call");

// --- Delayed Greeting --
type DelayedGreeting = () => void;

const delayedGreeting = (
  name: string,
  delay: number,
  callback: DelayedGreeting,
): void => {
  setTimeout(() => {
    console.log(`Hi ${name}, thanks for waiting!`);
    callback();
  }, delay);
};

delayedGreeting("Michiel", 1000, () => {
  console.log("Callback executed!");
});

// --- Challenge (optional): Two Timers, One Order ---
type DelayedCallback = () => void;

const delayedMessages = (
  message: string,
  delay: number,
  callback: DelayedCallback,
): void => {
  setTimeout(() => {
    console.log(message);
    callback();
  }, delay);
};

// Prediction: "Message 2" (1000ms) will print before "Message 1" (3000ms),
// because it has a shorter delay and both timers start at roughly the same time.

delayedMessages("Message 1", 3000, () => console.log("First delay is over!"));
delayedMessages("Message 2", 1000, () => console.log("Second delay is over!"));

/*
Actual result:
Message 2
Second timer done
Message 1
First timer done

This happens because both setTimeout calls start their timers immediately (almost simultaneously)
when the script runs, but setTimeout only guarantees a *minimum* wait time — so the 1000ms timer's
callback gets queued and executed first, well before the 3000ms timer's callback fires.
*/
