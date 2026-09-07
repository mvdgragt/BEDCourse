const greet = (firstName: string, callback: () => void) => {
  console.log(`Hello ${firstName}!`);
  callback();
};

greet("Michiel", () => {
  console.log("Have a great day!");
});

const sum = (a: number, b: number, callback: (result: number) => void) => {
  const result = a + b;
  callback(result);
};

sum(3, 5, (result: number): void => {
  console.log(`The sum is ${result}.`);
});

type DelayedMessage = () => void;

const delayedMessage = (
  callback: DelayedMessage,
  delay: number,
  message: string,
): void => {
  setTimeout(() => {
    console.log(message);
    callback();
  }, delay);
};

delayedMessage(
  () => {
    console.log("The delay is over!");
  },
  2000,
  "This message appears after 2 seconds",
);

const numbers: number[] = [1, 2, 3, 4, 5];

type ProcessArrayType = (e: number) => void;

const processArray = (arr: number[], callback: ProcessArrayType) => {
  arr.forEach((e: number) => {
    callback(e);
  });
};

processArray(numbers, (number: number) => {
  console.log(number * 2);
});

type SumType = (a: number, b: number) => number;

const calculator = (a: number, b: number, callback: SumType) => {
  return callback(a, b);
};

const sum2 = calculator(5, 3, (a: number, b: number): number => {
  return a + b;
});

const product = calculator(5, 3, (a: number, b: number): number => {
  return a * b;
});

console.log(sum2);
console.log(product);
