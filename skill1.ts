// --- Order Confirmation ---
type OrderCallback = () => void;

const placeOrder = (item: string, callback: OrderCallback) => {
  console.log(`Order placed for ${item}`);
  callback();
};

placeOrder("pizza", () => {
  console.log("Thanks for your order!");
});

// --- Sum with a Named Type ---
type SumCallback = (result: number) => void;

const sumNumbers = (a: number, b: number, callback: SumCallback) => {
  const sum = a + b;
  callback(sum);
};

sumNumbers(34, 65, (result) => {
  console.log(`Sum : ${result}`);
});

// --- Challenge (optional): Callback with multiple Parameters ---
type CompareCallback = (a: number, b: number) => string;

const compareNumbers = (
  a: number,
  b: number,
  callback: CompareCallback,
): string => {
  return callback(a, b);
};

// Call 1: bigger, smaller or equal to
const comparison = compareNumbers(5, 3, (a, b) => {
  return a > b ? "a is bigger" : b > a ? "b is bigger" : "equal";
});
console.log(comparison);

// Call 2: The difference as a string. Use .toString()
const difference = compareNumbers(5, 3, (a, b) => (a - b).toString());
console.log(difference);
