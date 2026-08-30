# TypeScript Homework

### Practice Based on Class Code

Complete each task in a `.ts` file (create a repo and branch it to: "week2 and branch again to typescript).
Choose at least one assignment per skill.

## Resources

- Video Tutorial: https://youtu.be/fD62mYdGQOY
- Sample Code: https://gist.github.com/mvdgragt/b43af564938855cab873b11ad7a52adc
- Useful Websites:
- https://nodejs.org/learn/typescript/introduction
- https://www.w3schools.com/typescript/index.php
- https://typescript-exercises.github.io/

---

## Skill 1: Typed Variables & Functions

### Student Profile

Declare three variables to represent a student profile: `name` (string), `age` (number), and `isEnrolled` (boolean). Then write an arrow function called `describeStudent` that takes a name and age and returns a string like:
`"Michiel is 47 years old."`

Log the result to the console.

### Greeting with Options

Write an arrow function called `formatGreeting` that:

- Takes a `name: string` parameter
- Takes an optional `formal?: boolean` parameter
- Returns `"Good day, <name>."` if `formal` is true, otherwise `"Hi <name>!"`

Call the function twice: once with `formal` set to `true`, and once without providing it at all.

---

## Skill 2: Arrays & Array Methods (`map` / `filter`)

### Doubling Ages

Create a typed array `ages: number[]` with at least 5 values. Use `.map()` to create a new array called `agesInFiveYears` where every value is increased by 5. Log both arrays.

### Filtering Names

Create a typed array `names: string[]` with at least 6 names. Use `.filter()` to create a new array `shortNames` containing only names with 4 or fewer letters. Log the result.

### Challenge (optional) Combined Transformation

Create a typed array `scores: number[]` with at least 8 values between 0 and 100. Using `.filter()` and `.map()` together:

1. Keep only scores that are 50 or above (passing scores)
2. Convert each passing score into a letter grade string (`"A"`, `"B"`, `"C"`, etc. and you decide the cutoffs)

Log the final array of letter grades. Bonus: also log how many students failed, using `.filter()` and `.length`.

---

## Skill 3: Interfaces

### Book Interface

Define an interface called `Book` with properties: `title: string`, `author: string`, and `pages: number`. Create one object that and log its `title`.

### Nested & Optional Properties

Define an interface `Address` with `city: string` and an optional `postalCode?: string`. Define an interface `Person` that has `name: string`, `age: number`, and `address: Address`. Create two `Person` objects, one with a `postalCode` and one without. Log the city of each person.

### Challenge (optional) Interface with a Typed Function

Define an interface `Movie` with `id: number`, `title: string`, `rating: number`, and `genres: string[]`. Create an array `movies: Movie[]` with at least 4 movies. Write a typed function `getMoviesByGenre(movies: Movie[], genre: string): Movie[]` that returns only the movies containing that genre in their `genres` array. Call the function and log the titles of the matching movies.

---

## Skill 4: Chaining Array Methods on Interface Data

### Filter Only

Using the `Product` interface style from class (`id`, `name`, `price`, `tags`), create an array of at least 5 products. Use `.filter()` to find all products priced under 1000. Log the result.

### Filter + Map

Using the same `Product` array, chain `.filter()` and `.map()` to produce a list of just the **names** of all products tagged `"work"`. Log the result.

### Challenge (optional) Filter + Map + Join

Using the same `Product` array, write a single chained expression (like the `expensiveProducts` example from class) that:

1. Filters products with more than one tag
2. Maps them to a string in the format `"<name> ($<price>)"`
3. Joins the results into one comma-separated string

Log the final string with a descriptive label, e.g. `"Multi-tag

### How to submit

Submit the link to your github repo and the correct branch.

- example: https://github.com/mvdgragt/BEDCourse/tree/week2/typescript
