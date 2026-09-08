// --- Temperture Converter ---

type ConvertCallback = (celcius: number) => number;

const convertTemperature = (
  celcius: number,
  callback: ConvertCallback,
): number => {
  return callback(celcius);
};

const fahrenheit = convertTemperature(21, (celsius) => celsius * 1.8 + 32);
console.log(`Fahrenheit: ${fahrenheit}`);

const kelvin = convertTemperature(21, (celsius) => celsius + 273.15);
console.log(`Kelvin: ${kelvin}`);

// --- Array Processor with a Return Value

type ReduceCallback = (accumulator: number, current: number) => number;

const processNumbers = (arr: number[], callback: ReduceCallback): number => {
  let total = 0;
  for (const current of arr) {
    total = callback(total, current);
  }
  return total;
};

const total = processNumbers(
  [1, 2, 4, 6, 8],
  (accumulator, current) => accumulator + current,
);
console.log(total);

// -- Challenge (optional): Naming Collision, On Purpose
type Volume = (side: number) => number;

const Volume = (side: number) => {
  return side ** 3;
};

const applyToCube = (callback: Volume) => {
  return callback(3);
};

console.log(applyToCube(Volume));

// TypeScript keeps types and values in two separate namespaces. (see Volumes above)
// Avoid it because it can cause human confusion
