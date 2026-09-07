type PrintResult = (result: number) => void;

const calculate = (a: number, b: number, printResult: PrintResult) => {
  const result = a + b;
  printResult(result);
};

const printResult = (result: number) => {
  console.log(result);
};
calculate(45, 23, printResult);
