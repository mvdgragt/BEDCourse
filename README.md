# Week 11 – Code Quality with SonarQube

**Video:** [Setting up SonarQube for a TypeScript project](https://youtu.be/VTl0PDGb214)

Over the last weeks you have built a whole safety system around your code:

- **Tests** check that your code does what it should
- **Zod** checks every value that comes in
- **Sentry** tells you when something breaks in a running app

But some problems don't break anything, at least not yet: a secret in the wrong file, code that's hard to read, a promise chain that hides an error, a function nobody tests. **SonarQube** finds these by _reading_ your code, without running it. That's called **static code analysis**.

This week you run SonarQube in Docker, scan your own Express API, and work through the issues it finds, the same way you worked through Sentry issues last week.

---

## Learning goals

After this assignment you can:

- Explain what static code analysis is, and how it differs from testing and from error monitoring
- Run SonarQube in Docker with Docker Compose
- Scan a TypeScript project and read the results
- Keep tokens out of your code and your `package.json`
- Fix issues one at a time, with your tests as a safety net
- Show your Vitest test coverage in SonarQube
- Explain what a quality gate is, and make your project pass one

---

## Before you start

1. Create a new branch: `week11/sonarqube`
2. Make sure your Express API from the Sentry week runs, and that `npm test` is green
3. Start **Docker Desktop**

### How to work

- **One issue, one fix, one commit.** Use the issue's rule as the commit message, for example `fix: prefer top-level await over promise chain`.
- **Run your tests after every fix.** SonarQube tells you what to change. Your tests tell you whether you broke something while changing it.
- **Answer every question** marked **Question:** in `ANSWERS.md`, in full sentences.
- **Take screenshots** of the SonarQube dashboard where the exercise asks for them, and put them in a `screenshots/` folder.

---

## Easy

### Exercise 1: SonarQube in Docker

1. Create `compose.yml` in your project:

   ```yaml
   services:
     sonarqube:
       image: sonarqube
       container_name: my-sonarqube
       ports:
         - "9000:9000"
       volumes:
         - sonarqube_data:/opt/sonarqube/data

   volumes:
     sonarqube_data:
   ```

   The `volumes` part is new compared to the video. It stores SonarQube's data outside the container, so your projects and your new password survive when the container is removed and started again. You'll be working on this for several days, so you'll want that.

2. Start it in the background:

   ```bash
   docker compose up -d
   ```

   `-d` means **detached**: the container runs in the background, and your terminal stays free.

3. Check that it runs with `docker ps`.
4. Open [http://localhost:9000](http://localhost:9000). SonarQube takes a minute or two to start the first time.
5. Log in with `admin` / `admin` and choose a new, strong password. Store it in a password manager, **not** in your project.

**Question:** What does `docker ps` show you? Which columns tell you that SonarQube is running, and on which port?

**Question:** Why run SonarQube in Docker instead of installing it directly on your computer?

### Exercise 2: Your first scan

1. In SonarQube, choose **Create a local project**. Give it a name and a project key, for example `items-project`. Keep the default settings for new code.
2. Choose **Locally** as the way to analyse it, and generate a token. Copy the token somewhere safe for now.
3. Choose **JavaScript, TypeScript** as the project type, and run the scan from your project folder:

   ```bash
   npx @sonar/scan -Dsonar.host.url=http://localhost:9000 -Dsonar.token=YOUR_TOKEN -Dsonar.projectKey=items-project
   ```

4. Open your project in SonarQube. Take a screenshot of the **Overview** page.

> This command has your token in it. That's fine for one quick test in your terminal, but **never** put it in a file you commit. You'll fix that properly in Exercise 4.

**Question:** Did your project pass or fail the quality gate? How many issues did SonarQube find?

### Exercise 3: Read before you fix

Open the **Issues** tab. Don't fix anything yet. First, learn to read what SonarQube tells you.

Choose **three different issues**, and for each one, write in `ANSWERS.md`:

- the rule name and the file and line where it was found
- what is wrong, in your own words (use the **Why is this an issue?** tab)
- what the compliant code would look like
- whether you agree that it's a problem, and why

**Question:** Depending on the version, SonarQube groups issues either by the quality they affect (**Security**, **Reliability**, **Maintainability**) or by type (**Vulnerability**, **Bug**, **Code Smell**). Explain each of the three groups your SonarQube uses, with an example.

**Question:** SonarQube, your tests and Sentry all help you find problems. What does each one find that the others can't?

---

## Medium

### Exercise 4: Get the token out of your code

In the video, the quality gate **failed** because the token was written in `package.json`. SonarQube spotted the secret, just like it would spot a database password.

1. Install the scanner and `dotenv-cli` as dev dependencies:

   ```bash
   npm install -D @sonar/scan dotenv-cli
   ```

2. Add your token and the SonarQube address to `.env`:

   ```bash
   SONAR_TOKEN=your-token-here
   SONAR_HOST_URL=http://localhost:9000
   ```

   The scanner reads `SONAR_TOKEN` and `SONAR_HOST_URL` from the environment by itself, so you don't need to put them in the command.

3. Add both variables, **without values**, to `.env.example`.
4. Create `sonar-project.properties` in the root of your project:

   ```properties
   sonar.projectKey=items-project
   sonar.projectName=Items Project
   sonar.sources=src
   ```

   Change `src` if your code lives in a different folder.

5. Add a script to `package.json`:

   ```json
   "sonar": "dotenv -- sonar"
   ```

   `dotenv --` loads your `.env` file first, then runs the scanner.

6. Run `npm run sonar` and check that a new analysis appears in SonarQube.
7. Search your whole project for the token, for example with your editor's search. It should only appear in `.env`.

**Question:** Your `package.json` goes to GitHub. What could someone do with your SonarQube token if they found it there? What about a database password or a Sentry DSN?

**Question:** Why is it better to put settings like the project key in `sonar-project.properties` than in a long command?

### Exercise 5: Scan only your own code

SonarQube should judge **your** code, not code that was generated or downloaded. Otherwise the real problems drown in noise, just like the Zod errors would have in Sentry.

1. Look at the **Code** tab in SonarQube. Which folders and files were scanned?
2. Add exclusions to `sonar-project.properties` for anything that isn't your own code, for example:

   ```properties
   sonar.exclusions=node_modules/**,dist/**,coverage/**
   ```

   Also check for generated code, like a generated Prisma client, and exclude it if it's in your source folder.

3. Tell SonarQube which files are tests, so they aren't judged as normal code:

   ```properties
   sonar.tests=src
   sonar.test.inclusions=**/*.test.ts
   ```

4. Run `npm run sonar` again. Compare the number of lines of code and the number of issues with your first scan.

**Question:** What changed in the numbers, and why? Why is it a problem when a tool reports issues in code you didn't write?

### Exercise 6: Fix, test, repeat

1. **Fix the promise chain**, like in the video. If your app connects to the database with `.then().catch()`, move the connection into its own file, for example `db.ts`, and use `async`/`await` with a `try/catch`.
2. Run `npm test`. Is everything still green?
3. Run `npm run sonar`. Check that the issue is gone.
4. Now fix **at least three more** issues of your own choice, one at a time. After each fix: run the tests, run the scan, and commit.

Keep a small table in `ANSWERS.md`:

| Rule                                      | File       | What I changed                                              | Tests still green? |
| ----------------------------------------- | ---------- | ----------------------------------------------------------- | ------------------ |
| Prefer top-level await over promise chain | `index.ts` | Moved the database connection into `db.ts` with async/await | Yes                |

**Question:** Why run your tests after every fix, even when the change looks small?

**Question:** Choose one of your fixes. Is the code easier to read now? Explain why or why not.

---

## Challenging

### Exercise 7: Test coverage in SonarQube

You already measure coverage with `npm run test:coverage`. Now you'll show it in SonarQube too. SonarQube doesn't run your tests itself. It reads the coverage report that Vitest writes.

1. Make Vitest write a coverage report in the **LCOV** format, which SonarQube can read. In `vitest.config.ts`:

   ```ts
   import { defineConfig } from "vitest/config";

   export default defineConfig({
     test: {
       coverage: {
         provider: "v8",
         reporter: ["text", "lcov"],
       },
     },
   });
   ```

   If you already have a `vitest.config.ts`, add the `coverage` part to it.

2. Run `npm run test:coverage`. Check that the file `coverage/lcov.info` was created.
3. Tell SonarQube where to find it, in `sonar-project.properties`:

   ```properties
   sonar.javascript.lcov.reportPaths=coverage/lcov.info
   ```

4. Change your `sonar` script so the tests always run first:

   ```json
   "sonar": "npm run test:coverage && dotenv -- sonar"
   ```

5. Run `npm run sonar`. Open the **Coverage** view and find a file with low coverage. Take a screenshot.
6. Write one test that covers some of the red lines, and scan again.

**Question:** Compare the coverage percentage in SonarQube with the table Vitest prints. Are they the same? If not, why might they differ?

**Question:** Why does the script use `&&` between the two commands? What happens if a test fails?

### Exercise 8: Make the quality gate fail, then pass

A **quality gate** is a set of conditions your code must meet. SonarQube's default gate, **Sonar way**, looks mostly at **new code**: for example, new code must have at least 80% test coverage and very little duplication.

1. Open **Quality Gates** in the top menu, and read the conditions of the **Sonar way** gate.
2. Make the gate fail **on purpose**. In a new file, add code that SonarQube will dislike, for example:
   - a hard-coded password: `const dbPassword = "secret123";`
   - a variable you never use
   - a function with no tests at all
3. Run `npm run sonar`. Check that the gate fails. Take a screenshot, and note which conditions failed.
4. Fix it properly: remove the secret, remove the unused code, and add tests. Scan again until the gate **passes**. Take a screenshot.

**Question:** Why does the quality gate focus on **new code**, and not on all the code in the project? Think about a big, old project with thousands of issues.

**Question:** In a team, what could you use a failing quality gate for? (Hint: think about what happens before code is merged.)

### Exercise 9: Security review and your final report

Not everything SonarQube flags is a real problem. Part of using the tool well is deciding what to fix, and explaining your decisions.

1. Open the **Security Hotspots** tab. A hotspot isn't necessarily a bug: it's code that a human should look at. For each hotspot:
   - read why SonarQube flagged it
   - decide whether it's safe or needs fixing
   - fix it, or mark it as **Safe** with a comment that explains why
2. Find one issue that you think is **not** worth fixing in your project. Mark it as **Accept** (or **Won't fix** in older versions) or **False positive**, and write a comment in SonarQube that explains why.
3. Write a short **quality report** in `ANSWERS.md`:

   |                             | First scan | Final scan |
   | --------------------------- | ---------- | ---------- |
   | Quality gate                |            |            |
   | Lines of code               |            |            |
   | Issues                      |            |            |
   | Security hotspots to review |            |            |
   | Coverage                    |            |            |

   Below the table, answer in a few sentences:
   - **What changed the most**, and what caused it?
   - **Which fix are you proudest of**, and why?
   - **What's left**, and would you fix it next, or leave it? Why?

**Question:** You marked an issue as Accept or False positive. What could go wrong if a team does that too often?

**Question:** Over the last weeks you used tests, Zod, Sentry and SonarQube. If you could only keep two of them on a real project, which would you choose, and why?

---

## Additional reading

### Watch and read first

- [Setting up SonarQube for a TypeScript project](https://youtu.be/VTl0PDGb214): this week's video.
- [SonarQube on Docker Hub](https://hub.docker.com/_/sonarqube): the official image, and how to run it with Docker and Docker Compose.

### Read for the exercises

- [@sonar/scan on npm](https://www.npmjs.com/package/@sonar/scan): the scanner for npm projects, and the different ways to start it. Useful for Exercises 2 and 4.
- [dotenv-cli on npm](https://www.npmjs.com/package/dotenv-cli): how `dotenv --` loads your `.env` file before running a command. Useful for Exercise 4.
- [JavaScript/TypeScript test coverage](https://docs.sonarsource.com/sonarqube-server/analyzing-source-code/test-coverage/javascript-typescript-test-coverage): how SonarQube reads LCOV coverage reports. Useful for Exercise 7.
- [Vitest: Coverage](https://vitest.dev/guide/coverage): coverage providers and reporters, including `lcov`. Useful for Exercise 7.

### Background

- [SonarQube Server documentation](https://docs.sonarsource.com/sonarqube-server/): the official documentation. Search for "quality gates", "new code" and "security hotspots" for Exercises 8 and 9.
- [Docker Compose overview](https://docs.docker.com/compose/): a refresher on `docker compose up`, `stop` and `down`.

---

## What to hand in

Hand in by **Monday 16 November**. Push your `week11/sonarqube` branch with:

- [ ] `compose.yml` for SonarQube
- [ ] `sonar-project.properties` with your exclusions, test settings and coverage path
- [ ] The `sonar` script in `package.json`, with **no** token anywhere in the repository
- [ ] `.env.example` with `SONAR_TOKEN=` and `SONAR_HOST_URL=`
- [ ] Your fixes from Exercises 6 and 8, each in its own commit, with `npm test` still green
- [ ] `ANSWERS.md` with every **Question:** answered, the fix table and the quality report
- [ ] A `screenshots/` folder with the screenshots from Exercises 2, 7 and 8
- [ ] A commit history with small, clear steps

If you get stuck, write down what you tried and where it broke. An honest "I got stuck here" is worth more than a copied solution.
