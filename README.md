# Callbacks and Promises Homework

### Practice Based on Class Code

Complete each task in a `.ts` file (create a repo and branch it to: "week4/promises).
Choose at least one assignment per skill.

## Resources

- Video Tutorial: https://www.youtube.com/watch?v=YlvDxfwsNdU
- Useful Websites:
  - https://www.typescriptlang.org/docs/handbook/2/functions.html
  - https://javascript.info/callbacks
  - https://javascript.info/promise-basics
  - https://www.w3schools.com/JS/js_async_promises.asp
  - https://www.w3schools.com/jsref/api_fetch.asp
  - https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

---

## Skill 1: Callbacks & Function Types

### Order Confirmation

Write an arrow function called `placeOrder` that takes an `item: string` and a `callback: () => void`. Inside, log `"Order placed for <item>"`, then call the callback. Call `placeOrder` with an inline callback that logs `"Thanks for your order!"`.

Then, declare a named function type called `OrderCallback` for the callback's shape, and refactor `placeOrder` to use it instead of the inline type.

### Sum with a Named Type

Declare a function type `SumCallback` describing a function that takes a `result: number` and returns `void`. Write a function `sumNumbers` that takes `a: number`, `b: number`, and a `callback: SumCallback`, adds `a` and `b`, and passes the result to the callback. Call it with two different numbers and log the result inside the callback.

### Challenge (optional): Callback with Multiple Parameters

Write a function type `CompareCallback` that takes two numbers, `a` and `b`, and returns a `string`. Write a function `compareNumbers(a: number, b: number, callback: CompareCallback)` that calls the callback and returns its result. Call it twice: once with a callback that returns `"a is bigger"` / `"b is bigger"` / `"equal"` depending on the values, and once with a callback that just returns the difference as a string.

---

## Skill 2: Asynchronous Callbacks

### Countdown Timer

Write a function `countdown` that takes a `seconds: number` and a `callback: () => void`. Use `setTimeout` to wait `seconds * 1000` milliseconds, then log `"Time's up!"` and call the callback. Call `countdown(3, () => console.log("Countdown finished."))`.

Add one `console.log` **before** the `countdown` call and one **right after** it, in your script. Run it and, in a comment above your code, write down the actual order the three logs appear in, and explain in one sentence _why_ that order happens.

### Delayed Greeting

Reuse the class's `delayedMessage` pattern, but write your own version called `delayedGreeting` that takes a `name: string`, a `delay: number`, and a `callback: () => void`. After the delay, it should log `"Hi <name>, thanks for waiting!"` and then call the callback. Call it with a 1500ms delay and a callback that logs `"Callback executed!"`.

### Challenge (optional): Two Timers, One Order

Call `delayedMessage` (or your own version) **twice** in a row: once with a delay of `3000` and once with a delay of `1000`, each with a different message. Before running the code, write down in a comment which message you _predict_ will print first. Then run it, and write down what actually happened, and explain why.

---

## Skill 3: Callbacks That Return Values

### Temperature Converter

Declare a function type `ConvertCallback` describing a function that takes a `celsius: number` and returns a `number`. Write a function `convertTemperature(celsius: number, callback: ConvertCallback)` that calls the callback with `celsius` and returns whatever it returns. Call it twice: once with a callback that converts to Fahrenheit, and once with a callback that converts to Kelvin. Log both results.

### Array Processor with a Return Value

Write a function type `ReduceCallback` for a function that takes an `accumulator: number` and a `current: number`, and returns a `number`. Write a function `processNumbers(arr: number[], callback: ReduceCallback)` that loops through the array and uses the callback to combine each value into a running total, then returns the final total. (Hint: this is essentially rebuilding what `.reduce()` does, so don't use `.reduce()` itself, use a loop.) Call it with an array of at least 5 numbers and a callback that sums them.

### Challenge (optional): Naming Collision, On Purpose

Recreate the `areaOfSquare` naming pattern from class: declare a `type Volume` for a function that takes a `side: number` and returns a `number`, **and** a `const Volume` that actually computes it (`side ** 3`). Write a function `applyToCube(callback: Volume)` that calls the callback with a fixed side length. In a comment, explain why this compiles even though the type and the value share a name, and why it's still better practice to avoid doing this in real code.

---

## Skill 4: Promises

### Your Own Promise

Create a `Promise` called `checkStock` that simulates checking if an item is in stock. Use a boolean variable (`inStock`) to decide whether to `resolve` with a success message or `reject` with a failure message. Attach `.then()` and `.catch()` to handle both cases and log the result.

Add a `console.log` as the very first line inside your executor function, and one more `console.log` immediately after you create the Promise (outside of it, in the main script). Run the code and, in a comment, write down which one prints first and why.

### Tracing Execution Order

Take the class's `myPromise` example and add **one more `console.log`** of your own right after the `.then().catch()` chain (still inside the main script, not inside `.then()` or `.catch()`). Predict, in a comment, whether that new log will print before or after the message inside `.then()`. Run it and confirm whether your prediction was right.

### Challenge (optional): Forcing a Rejection

Copy the class's `myPromise` example, but change the logic so it rejects instead of resolves. Make sure your `.catch()` handles it and logs a clear, user-friendly error message (not just the raw rejection value). Add comments explaining, in your own words, the difference between a Promise that's `pending`, `fulfilled`, and `rejected`.

---

## Skill 5: Promises with `fetch`

### A Different Advice Slip

Using the class's `fetchAdviceById` function as a starting point, write your own version called `fetchAdviceAndLog` that fetches from `https://api.adviceslip.com/advice/<id>` for **three different IDs of your choice**, and logs each advice string with its ID. (You can call your function three times, or loop over an array of IDs; your choice.)

Keep the `AdviceSlipType` type from class, and make sure your `.then()` callbacks are typed correctly.

### Handling a Bad Request

Modify your `fetchAdviceAndLog` function to also fetch a **deliberately invalid ID** (e.g. `id: 99999999`) so the request fails or the response isn't `ok`. Confirm that your `.catch()` correctly logs an error instead of crashing. Add a `console.log` right before the `throw new Error(...)` line so you can see, in your output, exactly when that path gets triggered.

### Challenge (optional): A Second API Type

Find a different free public API (for example `https://api.chucknorris.io/jokes/random` or `https://catfact.ninja/fact`). Define your own type describing the shape of its JSON response, and write a function that fetches from it, checks `response.ok`, parses the JSON, and logs a specific field from the result. Handle errors with `.catch()`, typed as `unknown`.
