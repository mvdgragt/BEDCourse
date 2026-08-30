// --- Skill 1: Typed variables and Functions ---

//Student Profile
const firstName: string = "Michiel";
const age: number = 47;
const isEnrolled = true;

const describeStudent = (firstName: string, age: number): string => {
  return `${firstName} is ${age} years old.`;
};

console.log(describeStudent(firstName, age));

//Greeting with Options

const formatGreeting = (name: string, formal?: boolean) => {
  return formal ? `Good day ${name}.` : `Hi ${name}!`;
};

console.log(formatGreeting("Michiel", true));
console.log(formatGreeting("Michiel", false));
