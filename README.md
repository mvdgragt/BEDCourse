# Async and Await Homework

### Practice Based on Class Code

Complete each task in a `.ts` file (create a repo and branch it to: "week4/asyncawait").

Your goal across all 9 tasks is the same: **take a promise-based function (using `.then()`/`.catch()`) and refactor it into an `async`/`await` function using `try`/`catch`.** The tasks get progressively harder — Tasks 1–3 are easy, 4–6 are medium, and 7–9 are challenging and optional.

## Resources

- Video Tutorial: https://www.youtube.com/watch?v=aXrzKfyLUdE
- Useful Websites:
  - https://www.typescriptlang.org/docs/handbook/2/functions.html
  - https://javascript.info/promise-basics
  - https://javascript.info/async-await
  - https://www.w3schools.com/JS/js_async_promises.asp
  - https://www.w3schools.com/jsref/api_fetch.asp
  - https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

### Key Concepts

```ts
/*
async   //before the function
await   //before the promise
try     //block of code that might fail
catch   //block of code that only runs if something goes wrong
Promise //a value we don't have yet

await only works inside an async function!
*/
```

## Easy (Tasks 1–3)

### Task 1: Coin Flip

Take a coin-flip promise like this one and refactor it so it's called using `async`/`await` with `try`/`catch`, instead of `.then()`/`.catch()`.

```ts
const flipCoin = () => {
  return new Promise((resolve, reject) => {
    const outcome = Math.random() > 0.5;
    outcome ? resolve("You win!") : reject("You lose!");
  });
};
```

### Task 2: Resolve or Reject

Take the class's `myPromise` example (a promise that resolves or rejects based on a boolean) and refactor the code that consumes it to use `async`/`await` instead of `.then()`/`.catch()`.

```ts
const myPromise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve("Resolved operation successfully!");
  } else {
    reject("Resolved operation rejected!");
  }
});
```

### Task 3: Delayed Message

Take a promise that resolves after a delay using `setTimeout` (like `delayedMessage` from class) and refactor the code that calls it to use `async`/`await`. Make sure you still `await` the delay before logging the result.

```ts
const delayedMessage = (message: string, delay: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(message);
    }, delay);
  });
};
```

## Medium (Tasks 4–6)

### Task 4: Fetching Advice

Take the class's `fetchAdvice` function (using `.then()`/`.catch()` to fetch from the Advice Slip API) and refactor it into an `async` arrow function using `try`/`catch`.

```ts
const fetchAdvice = () => {
  fetch("https://api.adviceslip.com/advice")
    .then((response) => response.json())
    .then((data) => console.log(data.slip.advice))
    .catch((error) => console.log("Error fetching advice:", error));
};
```

### Task 5: Checking the Response

Refactor a fetch function that checks `response.ok` and throws an error on a bad request into `async`/`await`. Make sure the thrown error is caught and logged with a clear, user-friendly message.

```ts
const fetchAdviceById = (id: number) => {
  fetch(`https://api.adviceslip.com/advice/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Fetching did not work");
      }
      return response.json();
    })
    .then((data) => console.log(`Advice ID: ${id}: ${data.slip.advice}`))
    .catch((error) => console.log("Error fetching advice:", error));
};
```

### Task 6: Two Fetches in a Row

Refactor a function that fetches two different advice IDs, one after the other, using `.then()` chains, into an `async` function where the second `fetch` only runs after the first one finishes, using `await` for both.

## Challenging — Optional (Tasks 7–9)

### Task 7: Combining a Promise and a Fetch

Refactor a function that flips a coin and — only if the result is a "win" — fetches advice from the API, all using `.then()` chains, into a single `async` function using `await` and `try`/`catch`. If the coin flip "loses," log an appropriate message instead of fetching.

### Task 8: Running Promises at the Same Time

Take two independent promises (for example, two different `fetch` calls to different advice IDs, or your own weather function alongside an advice fetch) that are currently run one after another with `.then()`, and refactor them to run **at the same time** using `Promise.all` inside an `async` function. Log both results once they've both resolved, and handle a failure from either one with `try`/`catch`.

### Task 9: Your Own Async Function

Write your own brand-new `async` function (not refactored from existing code) that fetches data from an API of your choice (for example a weather API like Open-Meteo), handles a bad request with a custom, user-friendly error message, and logs a specific field from the result.

## When You Finish

Push your updated project to the same GitHub repository you used.

Good luck, and remember that using `async`/`await` along with arrow functions will make your code cleaner and easier to read!
