/*
const checkStock = new Promise((resolve, reject) => {
  console.log("1. This executor function starts immediately!");

  const inStock = true;

  if (inStock) {
    resolve("Your item is in stock!");
  } else {
    reject("Sorry, we are out of stock!");
  }
});

console.log("2. Promise created, continuing with the rest of the script");

checkStock
  .then((message) => {
    console.log(message);
  })
  .catch((error) => {
    console.log(error);
  });

/*
Order of appearance:
1. "This executor function starts immediately!"
2. "Promise created, continuing with the rest of the script"
3. "Your item is in stock!"

The executor passed to `new Promise(...)` runs synchronously the instant the Promise is
constructed, so both logs inside it appear before the script even reaches the next line.
*/
/*
const myPromise2 = new Promise((resolve, reject) => {
  console.log("1. This executor function starts immediately!");
  const success = true;

  if (success) {
    console.log("2. Operation was successful!");
    resolve("Resolved operation successfully!");
  } else {
    console.log("3. Operation failed!");
    reject("Resolved operation rejected!");
  }
  console.log("4. executor function has finished");
});

myPromise2
  .then((message) => {
    console.log(message);
  })
  .catch((error) => {
    console.log(error);
  });
console.log("This appears before");

/*
"This appears before" prints first because it's synchronous code that runs immediately,
while .then()'s callback is always queued, even though resolve() happens instantly, .then() never runs 
until all synchronous code has finished running.
*/

// --- Challenge (optional): Forcing a Rejection

const myPromise3 = new Promise((resolve, reject) => {
  console.log("1. This executor function starts immediately!");
  const success = false;

  if (success) {
    console.log("2. Operation was successful!");
    resolve("Resolved operation successfully!");
  } else {
    console.log("3. Operation failed!");
    reject("ITEM_OUT_OF_STOCK");
  }
  console.log("4. executor function has finished");
});

myPromise3
  .then((message) => {
    console.log(message);
  })
  .catch((error) => {
    console.log("Sorry, something went wrong, please try again later.");
  });
console.log("This appears before");

/*
A Promise starts out "pending" (still working, no result yet), then settles exactly once.
Either "fulfilled" (resolve() was called, with its success value sent to .then()) or "rejected"
(reject() was called, with its failure reason being sent to .catch()) and can never change state after that.
*/
