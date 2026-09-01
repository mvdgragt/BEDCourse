// ---Skill 1: Union Types (| means OR)

//ID Card
type IDType = number | string;

const showID = (id: IDType): string => {
  const message = `Your ID is: ${id}`;
  console.log(message);
  return message;
};

showID(12345);
showID("AB123");

//Fruit Basket
type Fruit = "apple" | "banana" | "orange";

const eatFruit = (fruit: Fruit): string => {
  const message = `You ate an ${fruit}.`;
  console.log(message);
  return message;
};

eatFruit("apple");
eatFruit("orange");

//Challenge (optional) Pass or Fail

type Result = true | false;

const printResult = (result: Result) => {
  const message = result ? "Pass" : "Fail";
  console.log(message);
};

printResult(true);
printResult(false);
