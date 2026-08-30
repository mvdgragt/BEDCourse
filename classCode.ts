type PasswordFieldType = number | string;

const password = (code: PasswordFieldType) => {
  console.log("password: " + code);
};

password("123");

type Direction = "left" | "right";
const move = (dir: Direction) => {
  console.log("moving: " + dir);
};

move("left");

type Payment = "cash" | "card";

const pay = (method: Payment) => {
  console.log("Payment method: " + method);
};
pay("card");

interface Person {
  firstName: string;
  age: number;
}

interface Customer {
  customerNumber: number;
  email: string;
}

type Client = Person & Customer;

const clientData = (client: Client) => {
  console.log(`Name: ${client.firstName} email: ${client.email}`);
};
clientData({
  firstName: "Michiel",
  age: 47,
  customerNumber: 1,
  email: "michiel.vandergragt@sundsgarden.se",
});

//Enums

enum LoginError {
  Unauthorized = "unauthorized",
  MissingCredentials = "missingcredentials",
  InternalError = "internalerror",
}

const printErrorMessage = (error: LoginError) => {
  if (error === LoginError.Unauthorized) {
    console.log("You are not authorized");
  } else if (error === LoginError.MissingCredentials) {
    console.log("You are missing some credentials");
  }
};

// npx tsx classCode.ts

printErrorMessage(LoginError.Unauthorized);

enum TrafficLight {
  Red,
  Yellow,
  Green,
}

const LightAction = (light: TrafficLight) => {
  if (light === TrafficLight.Red) {
    console.log("Stop!");
  } else if (light === TrafficLight.Yellow) {
    console.log("Get ready....");
  } else if (light === TrafficLight.Green) {
    console.log("Go!");
  }
};
LightAction(TrafficLight.Red);

enum Day {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

const planDay = (day: Day) => {
  if (day === Day.Saturday || day === Day.Sunday) {
    console.log("It's weekend!");
  } else {
    console.log("It's a work day.");
  }
};

planDay(Day.Saturday);

const convertToArray = <T>(input1: T, input2: T): T[] => {
  return [input1, input2];
};

console.log(convertToArray(10, 20));

const getIndex = <T>(array: T[], value: T): number => {
  return array.findIndex((item) => item === value);
};

console.log(getIndex([10, 20, 40], 20));
