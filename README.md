# Callbacks Homework

Complete each task in a `.ts` file (create a repo and branch it to: "week3/callbacks").
Assignments 1–5 are foundational, 6–10 are more challenging and optional.

## Resources

- Video Tutorial: https://youtu.be/cs3LG-UzZk8
- Sample Code: https://github.com/mvdgragt/BEDCourse/blob/week3/callbacks/classCode.ts
- Useful Websites:
  - https://nodejs.org/learn/typescript/introduction
  - https://www.w3schools.com/typescript/index.php
  - https://typescript-exercises.github.io/
  - https://www.codewars.com/
  - https://exercism.org/

---

## Ground rules (applies to every assignment)

Follow the same pattern used in class for every task below:

1. **Define a type alias for the callback signature** before you use it, e.g.:

   ```typescript
   type showFileFunction = (fileContent: string) => void;
   ```

2. **Write the main function as an arrow function** (`const myFunc = (...) => { ... }`), typed to accept the callback type you defined — never type a callback as `any`.
3. **Simulate any delay or async behavior with `setTimeout`.**
4. **Actually call the callback** inside the function once the result is ready. A function that computes a value but never passes it to the callback does not satisfy the assignment.
5. Write the callback itself as a separate named arrow function, then pass it in by reference (don't inline it), e.g.:

   ```typescript
   const showFile = (fileContent: string) => {
     console.log(fileContent);
   };

   downloadFile(url, showFile);
   ```

Assignments that don't involve a delay (e.g. #4, #9) can skip `setTimeout`, but still need the type alias, the arrow function, and an actual call to the callback.

---

## Foundational Assignments

### 1. Hello Callback

Define a callback type `helloFunction = (message: string) => void`. Write an arrow function that takes a callback of this type and calls it with `'Hello from callback!'`.

### 2. Delayed Greeting

Define a callback type for a greeting message. Make an arrow function called `sayHelloLater` that uses `setTimeout` to wait 2 seconds, then calls the callback with `'Hi, I am late!'`.

### 3. Math Callback

Define a callback type that accepts a `number`. Create an arrow function that takes two numbers and a callback of that type. The function should add the numbers and pass the result to the callback (don't forget to actually call it!).

### 4. Uppercase Callback

Define a callback type that accepts a `string`. Write an arrow function that takes a string and a callback of that type, converts the string to uppercase, and passes the result to the callback.

### 5. Pizza Order

Define an `orderStatusFunction` callback type. Simulate ordering pizza: the arrow function should use `setTimeout` to wait 3 seconds and then call the callback with `'Your pizza is ready!'`.

---

## More Challenging Assignments

### 6. Multiple Messages

Define a callback type for a single string message. Make an arrow function that takes a callback of this type and calls it three times with three different messages.

### 7. Download Simulation

Define a `downloadFunction` callback type. Create an arrow function that takes a URL string and a callback of that type, waits 2 seconds via `setTimeout`, then calls the callback with `'Downloaded data from <URL>'`.

### 8. Success and Error Callback

Define two callback types, one for success, one for error. Make an arrow function that takes both as parameters and uses `Math.random()` to decide which one to call.

### 9. Math with Different Operations

Define a callback type that accepts a `number` result. Write one arrow function that can do addition, subtraction, multiplication, and division. It should take two numbers, an operation string, and a callback of that type, then call the callback with the computed result.

### 10. Chained Callbacks

Define a callback type for a "step done" signal. Make three arrow functions that each use `setTimeout` to wait 1 second and then call the next callback, printing `'Step 1 done'`, `'Step 2 done'`, `'Step 3 done'` in order.

---

## How to submit

Submit the link to your github repo and the correct branch.

- example: https://github.com/mvdgragt/BEDCourse/tree/week3/callbacks
