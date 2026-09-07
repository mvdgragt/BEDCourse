type Operator = "+" | "-" | "*" | "/";
type Callback = (result: number) => void;

const calculation = (
  a: number,
  b: number,
  operator: Operator,
  callback: Callback,
) => {
  let result: number;
  switch (operator) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "*":
      result = a * b;
      break;
    case "/":
      result = a / b;
      break;
  }
  callback(result);
};

const callback = (result: number) => {
  console.log(result);
};

calculation(3, 7, "+", callback);
