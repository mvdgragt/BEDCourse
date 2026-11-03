# Week 10 – Unit Tests, Integration Tests and Zod

**Video:** [Integration Testing with the Pizza Shop](https://www.youtube.com/watch?v=Ydlo-f1Mdl4)

**Code from the lesson:** [github.com/mvdgragt/BEDCourse – week10/TDD](https://github.com/mvdgragt/BEDCourse/tree/week10/TDD)

In Cyber Dojo you tested **one function at a time**. In the pizza shop video you saw that this isn't always enough: `createPizza`, `sendOrder` and `chargeCustomer` each worked on their own, but `orderPizza` still broke when they were put together. That's what **integration tests** are for.

In the lesson code, **Zod** checks every value that goes into a function. If something is wrong, `parse()` throws an error straight away, instead of letting a bad value travel through the whole chain.

In this lesson you'll learn both and do both. You start with the pizza shop from the lesson, then you build a small **library loan system**, the same domain as your library project, with Zod and tests from the start.

---

## Learning goals

After this assignment you can:

- Explain the difference between a unit test and an integration test
- Use the red → green → refactor loop with Vitest
- Write Zod schemas with `z.enum`, `z.object` and `z.number()`, and use `z.infer` to get TypeScript types from them
- Test that a function throws when it gets bad input
- Test functions that use random values
- Find a bug that only shows up when functions work together

---

## Before you start

1. Create a new branch: `week10`
2. Copy `pizzashop.ts`, `pizzashop.test.ts` and `pizzashop.integration.test.ts` from the [lesson repository](https://github.com/mvdgragt/BEDCourse/tree/week10/TDD) into your project
3. Install the packages:

   ```bash
   npm install zod
   npm install -D vitest typescript
   ```

4. Add these scripts to `package.json`:

   ```json
   "scripts": {
     "test": "vitest",
     "test:run": "vitest run"
   }
   ```

   `npm test` starts **watch mode**: Vitest reruns your tests every time you save. Keep it open while you work.

5. Run `npm run test:run`. All the tests from the lesson should be green before you change anything.

### How to work

- **Test first.** For every new behaviour, write the test, see it fail (red), write just enough code to make it pass (green), then clean up (refactor).
- **Commit every step.** Use messages like `red: createPizza accepts vegetarian` and `green: createPizza accepts vegetarian`. Your commit history shows that you wrote the test first.
- **Keep unit and integration tests apart.** Unit tests go in `*.test.ts`, integration tests in `*.integration.test.ts`, the same way as in the lesson.
- **Answer the questions** marked 💬 in `ANSWERS.md`, in full sentences.

### Two things to know about Zod errors

- When `parse()` fails, Zod throws a `ZodError` with a long message. For those cases, `expect(() => ...).toThrow()` without a message is enough.
- When **your own code** throws, with `throw new Error("...")`, check the exact message: `toThrow("No copies available")`.

---

## 🟢 Easy

### Exercise 1: A new pizza on the menu

The pizza shop wants to sell a **vegetarian** pizza for **110** kronor.

1. **Red:** in `pizzashop.test.ts`, write a test that `createPizza("vegetarian")` returns `{ type: "vegetarian", price: 110 }`. Run it and see it fail.
2. **Green:** add `"vegetarian"` to `PizzaTypeSchema`. Run the test again. **Don't add it to the menu yet.**
3. 💬 The test is still red. Read the error. Which schema stopped it, and why? Your editor probably shows a red line under `menu[pizzaType]`, yet Vitest still ran the code. What does that tell you about TypeScript types versus Zod checks?
4. Now add `vegetarian: 110` to the menu. Green!
5. Write one more test: `orderPizza("vegetarian")` returns `true`. Which file does it belong in, and why?

### Exercise 2: Testing `chargeCustomer`

The lesson has no unit tests for `chargeCustomer` yet. Write them in `pizzashop.test.ts`:

- [ ] It returns `true` for a valid order ID and amount, for example `chargeCustomer(42, 100)`
- [ ] It throws `"Cannot charge the customer without a valid order ID!"` when the order ID is `undefined`
- [ ] It throws when the order ID is negative (`-1`)
- [ ] It throws when the order ID isn't a whole number (`12.5`)
- [ ] It throws when the amount is `0`

One of these tests will fail even though the code "works". Find out why, fix the code, and get it green.

💬 This bug would never have been found without a test. What was it, and what does that tell you about testing error messages?

### Exercise 3: Testing the schemas themselves

Schemas are code too, so they can be tested on their own. Create `schemas.test.ts` and test the schemas from `pizzashop.ts` directly:

- [ ] `PizzaTypeSchema.parse("margherita")` returns `"margherita"`
- [ ] `PizzaTypeSchema.parse("Margherita")` (capital M) throws
- [ ] `PizzaSchema.parse({ type: "pepperoni", price: 120 })` returns an equal object (use `toEqual`)
- [ ] `PizzaSchema.parse({ type: "pepperoni" })` throws, because the price is missing
- [ ] `AmountSchema.parse("100")` throws. A string is not a number, even if it looks like one
- [ ] `OrderIdSchema.parse(0)` does **not** throw. Check that it returns `0`

💬 Why use `toEqual` and not `toBe` when you compare objects?

---

## 🟡 Medium

From here on, you build a **library loan system** in a new file, `library.ts`. It follows the same pattern as the pizza shop: small functions, each validated with Zod, and one function that combines them.

### Exercise 4: `findBook`

The library has this catalogue:

```ts
const catalogue = {
  dune: { title: "dune", copiesAvailable: 3 },
  neuromancer: { title: "neuromancer", copiesAvailable: 1 },
  foundation: { title: "foundation", copiesAvailable: 0 },
};
```

Create these schemas, and export each one:

- `BookTitleSchema`: one of `"dune"`, `"neuromancer"` or `"foundation"`
- `BookSchema`: an object with `title` (a `BookTitleSchema`) and `copiesAvailable` (a whole number, 0 or more)
- `type Book = z.infer<typeof BookSchema>`

Then build `findBook(title: unknown): Book` **test first**, in `library.test.ts`:

- [ ] `findBook("dune")` returns `{ title: "dune", copiesAvailable: 3 }`
- [ ] `findBook("foundation")` returns the book, even though it has 0 copies. Finding a book and borrowing it are two different things
- [ ] `findBook("harry potter")` throws
- [ ] `findBook(42)` throws

> **Hint:** look at how `createPizza` uses `PizzaTypeSchema.parse()` and the menu. `findBook` works the same way.

### Exercise 5: `checkOutBook`

`checkOutBook(book: unknown): number` checks out one copy and returns a **loan ID**.

Rules:

- The input must be a valid `Book` (use `BookSchema.parse`)
- If `copiesAvailable` is `0`, throw `"No copies available"`
- Otherwise, return a random whole number between **1000 and 9999** (inclusive)

Tests, written first:

- [ ] It returns a number
- [ ] The number is a whole number
- [ ] The number is between 1000 and 9999
- [ ] It throws `"No copies available"` for `{ title: "foundation", copiesAvailable: 0 }`
- [ ] It throws for an object without `copiesAvailable`

> **Hint:** `Math.floor(Math.random() * 9000) + 1000` gives a whole number from 1000 to 9999.
>
> Notice that the unit tests pass a book object straight into `checkOutBook`. They don't call `findBook`. That's what makes them **unit** tests.

💬 Your "between 1000 and 9999" test uses a random number. Could it pass by luck even if the code were wrong? What could you do to make it more trustworthy?

### Exercise 6: `registerLoan` and `borrowBook`

Create a `LoanSchema`: an object with `loanId` (a positive whole number), `title` (a `BookTitleSchema`) and `memberId` (a positive whole number). Export `type Loan = z.infer<typeof LoanSchema>`.

**Unit tests first**, for `registerLoan(loanId: unknown, title: unknown, memberId: unknown): Loan`:

- [ ] `registerLoan(1234, "dune", 7)` returns `{ loanId: 1234, title: "dune", memberId: 7 }`
- [ ] It throws when `memberId` is `0`
- [ ] It throws when the title isn't in the catalogue

Now combine everything. `borrowBook(title: unknown, memberId: unknown): Loan` calls `findBook`, then `checkOutBook`, then `registerLoan`, just like `orderPizza` does.

**Integration tests**, in `library.integration.test.ts`:

- [ ] `borrowBook("dune", 7)` returns a loan with title `"dune"` and member ID `7`
- [ ] The `loanId` in that loan is a number between 1000 and 9999
- [ ] `borrowBook("foundation", 7)` throws `"No copies available"`
- [ ] `borrowBook("dune", -1)` throws

💬 In the `"foundation"` test, the error comes from `checkOutBook`, but you only called `borrowBook`. What does that show you about how errors travel through a chain of functions?

---

## 🔴 Challenging

### Exercise 7: Borrowing limits

Members have a membership level, and the level decides how many books they may have at home:

| Membership | Maximum books on loan |
| ---------- | --------------------- |
| `basic`    | 2                     |
| `premium`  | 5                     |

Create a `MemberSchema` with:

- `id`: a positive whole number
- `name`: a string that isn't empty
- `membership`: `"basic"` or `"premium"`
- `booksOnLoan`: a whole number, 0 or more

> **Hint:** for the name, use `z.string().min(1)`. It works like `z.number().positive()`: a type, plus a rule.

**Step 1:** build `canBorrow(member: unknown): boolean`, test first. It returns `true` if the member is still under their limit.

Test the **boundaries**, like you tested 15 in FizzBuzz:

- [ ] A basic member with 1 book can borrow
- [ ] A basic member with 2 books can't borrow
- [ ] A premium member with 4 books can borrow
- [ ] A premium member with 5 books can't borrow
- [ ] A member with an empty name throws

**Step 2:** build `borrowWithLimit(title: unknown, member: unknown): Loan`. If `canBorrow` returns `false`, it throws `"Borrowing limit reached"`. Otherwise it calls `borrowBook` with the title and the member's ID.

Integration tests:

- [ ] A basic member with 0 books can borrow `"dune"`. The loan has their member ID
- [ ] A basic member with 2 books gets `"Borrowing limit reached"`
- [ ] A premium member with 2 books trying to borrow `"foundation"` gets `"No copies available"`

💬 In the last test, the member is fine, but the book isn't. Which function decides which error the member sees first? Would you want it the other way round?

### Exercise 8: Find the integration bug

A colleague wrote the code for returning books. Create `returns.ts` with this code:

```ts
import { z } from "zod";

export const LoanSchema = z.object({
  loanId: z.number().int().positive(),
  title: z.string().min(1),
  memberId: z.number().int().positive(),
});

export type Loan = z.infer<typeof LoanSchema>;

const activeLoans: Loan[] = [
  { loanId: 1001, title: "dune", memberId: 7 },
  { loanId: 1002, title: "neuromancer", memberId: 3 },
];

export const findLoan = (loanId: unknown) => {
  const id = z.number().int().positive().parse(loanId);
  const loan = activeLoans.find((l) => l.loanId === id);

  if (!loan) {
    throw new Error("Loan not found");
  }

  return { id: loan.loanId, title: loan.title, memberId: loan.memberId };
};

export const markReturned = (loan: unknown) => {
  const validLoan = LoanSchema.parse(loan);
  return { ...validLoan, returned: true };
};

export const returnBook = (loanId: unknown) => {
  const loan = findLoan(loanId);
  return markReturned(loan);
};
```

And `returns.test.ts` with their unit tests:

```ts
import { describe, test, expect } from "vitest";
import { findLoan, markReturned } from "./returns";

describe("Returns Unit Tests", () => {
  test("findLoan finds the loan's title and member", () => {
    const loan = findLoan(1001);

    expect(loan.title).toBe("dune");
    expect(loan.memberId).toBe(7);
  });

  test("findLoan throws for an unknown loan", () => {
    expect(() => findLoan(9999)).toThrow("Loan not found");
  });

  test("markReturned marks a loan as returned", () => {
    const result = markReturned({ loanId: 1001, title: "dune", memberId: 7 });

    expect(result.returned).toBe(true);
  });
});
```

Your tasks:

1. Run the unit tests. They're all green.
2. **Red:** write an integration test in `returns.integration.test.ts`: `returnBook(1001)` returns a loan with `returned: true` and `title: "dune"`. It fails.
3. Read the Zod error carefully. It tells you exactly which field is the problem. Find the bug.
4. **Green:** fix the bug.
5. **Refactor:** give `findLoan` a return type, `(loanId: unknown): Loan => { ... }`. 💬 What does your editor say now if you put the bug back? Which tool would have caught this bug first: TypeScript, Zod, or your tests?

💬 Every unit test was green, but the code was broken. Why didn't the unit tests catch it? Look at where each unit test gets its input from.

### Exercise 9: Borrowing several books at once

Members want to borrow up to **3 books in one visit**. Build `borrowBooks(titles: unknown, member: unknown): Loan[]`.

Rules:

- `titles` must be an array of valid book titles, with **at least 1** and **at most 3** titles
- The member's `booksOnLoan` **plus** the number of titles must not go over their limit from Exercise 7. Otherwise, throw `"Borrowing limit reached"`
- Each title is borrowed with `borrowBook`, and the function returns all the loans

> **Hint:** Zod can check arrays too: `z.array(BookTitleSchema).min(1).max(3)`. `.min()` and `.max()` work on arrays the same way `.min(1)` worked on the name string.
>
> To borrow every title, you can use `titles.map(...)`.

**Refactor first:** both `canBorrow` and `borrowBooks` need the limit for a membership level. Move it into its own function, `borrowLimit(membership)`, and use it in `canBorrow`. All your Exercise 7 tests must stay green. That's your safety net doing its job.

Then write the tests, red first:

**Unit tests**

- [ ] `borrowLimit("basic")` returns 2, and `borrowLimit("premium")` returns 5

**Integration tests**

- [ ] A premium member with 0 books borrows `["dune", "neuromancer"]`. The result has 2 loans
- [ ] The first loan has title `"dune"`, the second `"neuromancer"`
- [ ] An empty array throws
- [ ] Four titles throws
- [ ] A basic member with 1 book borrowing 2 titles gets `"Borrowing limit reached"`

💬 When you refactored `canBorrow`, how did you know you hadn't broken anything?

---

## Additional reading

### Watch and read first

- [Integration Testing with the Pizza Shop](https://www.youtube.com/watch?v=Ydlo-f1Mdl4): this week's video.
- [Lesson code on GitHub](https://github.com/mvdgragt/BEDCourse/tree/week10/TDD): the pizza shop and its tests.
- [Zod: Basic usage](https://zod.dev/basics): defining a schema, `parse()`, what happens when it fails, and `z.infer`.

### Zod

- [Zod: Defining schemas](https://zod.dev/api): all the schema types. Look at the sections on numbers, strings, enums, objects and arrays for this week.

### Vitest

- [Vitest: Getting Started](https://vitest.dev/guide/): installing and running Vitest.
- [Vitest: expect](https://vitest.dev/api/expect): all the matchers, like `toBe`, `toEqual`, `toThrow`, `toBeGreaterThanOrEqual` and `toHaveLength`.

### Background

- [The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html) (Martin Fowler's website): why you need both unit tests and integration tests. The first sections are enough.
- [Write tests. Not too many. Mostly integration.](https://kentcdodds.com/blog/write-tests) (Kent C. Dodds): a short article on why integration tests often give you the most confidence. Good to read after Exercise 8.

---

## What to hand in

Push your `week10` branch with:

- [ ] `pizzashop.ts` with the vegetarian pizza and the bug fix from Exercise 2
- [ ] `pizzashop.test.ts`, `pizzashop.integration.test.ts` and `schemas.test.ts`
- [ ] `library.ts` with `library.test.ts` and `library.integration.test.ts`
- [ ] `returns.ts` with the bug fixed, plus `returns.test.ts` and `returns.integration.test.ts`
- [ ] `ANSWERS.md` with all the 💬 questions answered
- [ ] A screenshot of `npm run test:run` with all tests green
- [ ] A commit history that shows your red and green steps

If you get stuck, write down what you tried and where it broke. A test that's still red, with an honest explanation of why, is worth more than a copied solution.
