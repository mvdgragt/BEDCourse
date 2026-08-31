# TypeScript Homework

### Practice Based on Class Code

Complete each task in a `.ts` file (create a repo and branch it to: "week3/typescript").
Choose at least one assignment per skill.

## Resources

- Video Tutorial: (add link here)
- Sample Code: 
- Useful Websites:
- https://nodejs.org/learn/typescript/introduction
- https://www.w3schools.com/typescript/index.php
- https://typescript-exercises.github.io/

---

## Skill 1: Union Types (`|` means OR)

### ID Card

Create a type called `IDType` that can be either a `number` OR a `string`. Write an arrow function called `showID` that takes an `IDType` and returns a string like:
`"Your ID is: 12345"` or `"Your ID is: AB123"`

Call the function once with a number and once with a string. Log both results.

### Fruit Basket

Create a type `Fruit` that can only be `"apple"`, `"banana"`, or `"orange"`. Write an arrow function called `eatFruit` that takes a `Fruit` and returns a string like:
`"You ate an apple."`

Call the function with `"apple"` and `"orange"`. Log both results.

### Challenge (optional) Pass or Fail

Create a type `Result` that can be either `true` OR `false`. Write an arrow function called `printResult` that takes a `Result` and returns `"Pass"` if `true`, and `"Fail"` if `false`.

Call the function with both values and log the results.

---

## Skill 2: Interfaces & Type Aliases (`&` means AND)

### Book Interface

Define an interface called `Book` with properties `title: string` and `pages: number`. Create one `Book` object and write an arrow function called `describeBook` that returns a string like:
`"The book Dune has 412 pages."`

Log the result.

### Combining Interfaces

Create two interfaces:

- `Teacher` with `name: string` and `subject: string`
- `Employee` with `id: number` and `email: string`

Create a type alias `SchoolTeacher` that combines `Teacher` AND `Employee` using `&`. Create one `SchoolTeacher` object and write an arrow function called `printTeacherInfo` that logs all four properties in a readable sentence.

### Challenge (optional) Favorite Car

Define an interface `Car` with `brand: string` and `year: number`. Write an arrow function called `printCar` that takes a `Car` and returns a string like:
`"Brand: Toyota, Year: 2022"`

Call the function with your favorite car and log the result.

---

## Skill 3: Enums (fixed list of options)

### Color Picker

Create an enum `Color` with values `Red`, `Green`, `Blue`. Write an arrow function called `showColor` that takes a `Color` and returns a string like:
`"You chose Red"`

Call the function with each of the three colors and log the results.

### Pizza Order

Create an enum `PizzaSize` with values `Small`, `Medium`, `Large`. Write an arrow function called `orderPizza` that takes a `PizzaSize` and returns a string like:
`"You ordered a Medium pizza."`

Call the function with all three sizes and log the results.

### Challenge (optional) Role-Based Access

Create an enum `Role` with values `Admin`, `User`, `Guest`. Write an arrow function called `printRole` that takes a `Role` and, using a `switch` statement, returns:

- `Admin` → `"You have full access"`
- `User` → `"You have limited access"`
- `Guest` → `"You have guest access"`

Call the function with all three roles and log the results.

---

## Skill 4: Generics (`<T>` means reusable placeholder)

### Wrap It Up

Write a generic arrow function `wrapInArray<T>` that takes one item and returns it inside an array.
Example: `wrapInArray("cat")` → `["cat"]`

Call it with a string and with a number. Log both results.

### First in Line

Write a generic arrow function `firstItem<T>` that takes an array and returns its first item.

Test it with `[1, 2, 3]` and `["a", "b", "c"]`. Log both results.

### Challenge (optional) Swap Places

Write a generic arrow function `swap<T>` that takes two items and returns them in reverse order inside an array.
Example: `swap("hello", "world")` → `["world", "hello"]`

Call it with two strings and two numbers. Log both results.

---

## How to submit

Submit the link to your github repo and the correct branch.

- example: https://github.com/mvdgragt/BEDCourse/tree/week3/typescript
