# Final Project – Full-Stack Application

## Overview

In groups of 3 or 4, you will build a complete, containerized full-stack application and present it on the last day of the course: **Friday 8 January 2027**.

### Here are the groups:

- group 1: Madde, Snezana, Elin, Dante
- group 2: Laetitia, Fu, Jakob, Lexi
- group 3: Daniel, Emil, Binh, Lucian
- group 4: Shanthi, Zhuoxuan, Achini
- group 5: Joseph, Isak, Bianca

This is your chance to show everything you have learned in the course: a typed REST API with a database, a React frontend, authentication, automated tests and Docker. Pick a project you think is fun!!! The goal is an app you are proud to show in your portfolio and to future employers.

A smaller app that works well, is tested and is easy to run beats a big app that is half finished. Start small, get it working, then add features.

There are no grades for this project. The goal is to finish it, present it, and be proud of what your group has built.

## Tech stack

Every group uses the same core stack, so you can help each other and so the project shows the skills from the course.

| Part           | Tools                                                   |
| -------------- | ------------------------------------------------------- |
| Backend        | Node.js, Express, TypeScript, Sequelize, Zod            |
| Database       | PostgreSQL                                              |
| Frontend       | Recommended:                                            |
|                | React with Vite, axios, useState, useEffect             |
| Authentication | Suggestion: Firebase Authentication or Auth0 (OAuth)    |
| Testing        | Vitest (unit), Supertest (API), Playwright (end-to-end) |
| Containers     | Docker, Docker Compose                                  |
| Teamwork       | Git, GitHub, GitHub Issues, GitHub Projects             |

You may add extra libraries (for example React Router or a UI library), but write in your README why you chose them. You may use AI tools to help you, but every person in the group must be able to explain the code.

**Struggling with the frontend?** You may build a command-line app instead of a React app, using the npm package `@inquirer/prompts` (or a similar package). The CLI shows menus and questions in the terminal and talks to your own API with axios. Your backend, tests and Docker requirements stay the same.

## Project ideas

Choose one idea below, or pitch your own idea to your teacher before you start. Every level can become an app you are proud of. A challenging idea gives you more to show, and an easy idea gives you more time to make it polished.

| Level       | Idea                                   | What it is about                                                                                                       |
| ----------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Easy        | Recipe book                            | Add, edit and delete recipes with ingredients and cooking time. Filter by category (breakfast, dinner, dessert).       |
| Easy        | Watchlist                              | Save movies or books, mark them as watched or read, give a rating from 1 to 5, and sort by rating.                     |
| Easy        | School lost and found                  | Post found items with description, place and date. Search by keyword and mark items as returned.                       |
| Medium      | Library loan system                    | Books, members and loans with due dates. Show available books, who borrowed what, and overdue loans.                   |
| Medium      | Workout tracker                        | Log workouts with exercises, sets, reps and weight. Show history and progress, such as the heaviest lift per exercise. |
| Medium      | Café ordering system                   | A menu with categories, a cart and orders. Staff change the order status: received, preparing, ready.                  |
| Challenging | Project board (like Trello)            | Boards, columns and cards. Invite members and move cards between columns. Drag-and-drop is a bonus.                    |
| Challenging | Booking system                         | Book a padel court, study room or hairdresser. Stop double bookings. An admin manages resources and opening hours.     |
| Challenging | Second-hand marketplace (like Blocket) | Listings with price, category and condition. Search, filter, favourites, and messages between buyer and seller.        |

Your own idea should include the same building blocks: at least three models, at least one relation, login, and full CRUD on at least one resource.

## Core requirements

These are the building blocks every project should have. Together they show the skills from the course.

**Backend**

- REST API with Express and TypeScript
- Sequelize with PostgreSQL, with at least 3 models and at least 1 relation
- Full CRUD (create, read, update, delete) on at least one resource
- Zod validation on all data sent to the API (body and params)
- Correct HTTP status codes (200, 201, 400, 401, 404, 500) and clear error messages
- Secrets (database URL, API keys) in a `.env` file that is not pushed to GitHub, plus a `.env.example`
  **Suggested Frontend**

- React app built with Vite
- Fetches data from your own API with axios inside useEffect
- Uses useState to show data, loading and errors
- The user can create, edit and delete data through forms
  _Alternative:_ a command-line app built with `@inquirer/prompts` (or similar) that calls your API with axios, lets the user create, view, edit and delete data, and shows clear error messages.

**Suggested Authentication**

- Users log in with Firebase Authentication or Auth0
- At least one API route is protected: it checks the token and returns 401 without a valid token
  **Testing**

- At least 3 unit tests with Vitest (for example Zod schemas or helper functions)
- At least 3 API tests with Supertest (for example one success case and one error case)
- All tests run with one command: `npm test`
  **Docker**

- A Dockerfile for the backend
- A `docker-compose.yml` that starts the API and the database together
- The app starts with `docker compose up`, following the steps in your README
  **Teamwork and documentation**

- GitHub repository with commits from every group member
- Features planned as GitHub Issues
- README with: project description, how to install and run, how to run tests, API endpoints, and who did what

## Stretch goals

Finished the core requirements and want to go further? Pick any of these. Each one is something extra to show off in your presentation.

- **Roles or ownership:** users only change their own data, or there are roles (for example admin and user) with different permissions, checked in the backend.
- **End-to-end tests:** at least 2 Playwright tests that test a full user flow in the browser (for example log in, create an item, see it in the list).
- **Fuller test coverage:** Supertest tests cover protected routes (with and without a token) and validation errors.
- **Full Docker setup:** frontend, backend and database all run with `docker compose up`, with an optimized Dockerfile (for example a small base image, `.dockerignore`, and a multi-stage build).
- **CI with GitHub Actions:** the tests run automatically on every push or pull request.
- **Good teamwork in GitHub:** feature branches, pull requests with code review, and issues linked to pull requests.
- **Deployment:** the app is deployed to a cloud service (for example Vercel, Firebase Hosting, Render or AWS), with the link in the README.
- **Reflection:** a short text in the README (about half a page per person) about what you learned, what was hard, and what you would do differently.

## Optional: AI features

Your group may add AI to your app using what you learned about AI skills, MCP (Model Context Protocol) and AI agents. This is optional. The AI feature is an extra on top of the core requirements, never a replacement for them.

**Three ways to add AI**

| Level                     | What you build                                                                                      | Example                                                         |
| ------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| 1. AI call in the backend | One endpoint that sends a prompt to an AI model and returns the answer                              | "Suggest a recipe from the ingredients I have"                  |
| 2. MCP server             | An MCP server that exposes your API as tools, so an AI assistant (like Claude) can use your app     | Tools like `search_books` and `create_loan` for the library app |
| 3. AI agent               | An agent that uses tools in several steps to reach a goal, and asks the user before it changes data | "Find a free padel court on Friday evening and book it"         |

You can also write an **AI skill** (a `SKILL.md` file) for your project. It teaches an AI agent how to use your API or follow your group's code conventions. Put it in the repository and explain it in the README.

**AI ideas for each project**

| Project              | AI idea                                                         |
| -------------------- | --------------------------------------------------------------- |
| Recipe book          | Suggest recipes from ingredients, or create a shopping list     |
| Watchlist            | Recommend what to watch next based on ratings                   |
| Lost and found       | Suggest a category and tags from the item description           |
| Library loan system  | MCP server so an assistant can search books and check loans     |
| Workout tracker      | Summarize progress and suggest next week's workout              |
| Café ordering system | Order by chat: "two lattes and a cinnamon bun" becomes an order |
| Project board        | Split a big task into smaller cards                             |
| Booking system       | Agent that finds free times and books after the user confirms   |
| Marketplace          | Write a listing description from a few keywords                 |

**Rules for AI features**

- **Keys stay in the backend.** The AI API key lives in `.env` on the server. The frontend never calls the AI service directly.
- **Validate AI output with Zod.** Ask the model for JSON and check it with a Zod schema before you save or use it.
- **The user confirms changes.** An agent may read data freely, but it must ask the user before it creates, changes or deletes anything.
- **Mock AI in tests.** Vitest and Supertest tests use a fake AI response, so tests are fast, free, and work in GitHub Actions without a key.
- **Run it in Docker.** An MCP server or agent service is its own service in `docker-compose.yml`.
- **Explain it.** The README describes the AI feature, which model or service you used, what data is sent to it, and its limits.
  **Tip:** get your core app working first, then add AI. A small AI feature that works and follows the rules above is more impressive than a big one that breaks.

## Progress checklist

Use this table to track your progress: finish the core column first, then pick stretch goals if you have time.

| Area                           | Core                                                                                                                                                                  | Stretch goals                                                                                           |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Backend and database           | REST API with 3+ models, 1+ relation, CRUD, Zod validation, correct status codes                                                                                      | Clean structure (routes, controllers, services), roles or ownership checked in the backend              |
| Frontend                       | React app that shows, creates, edits and deletes data with axios, useState and useEffect, or a CLI built with `@inquirer/prompts` that does the same through your API | Clear and responsive UI, good loading and error handling, easy to use                                   |
| Authentication and security    | Login with Firebase or Auth0, at least one protected route, secrets in `.env`                                                                                         | Roles or ownership, all write routes protected, no secrets in the repository                            |
| Testing                        | 3+ Vitest unit tests and 3+ Supertest API tests, run with `npm test`                                                                                                  | Plus 2+ Playwright end-to-end tests, tests for protected routes and errors, tests run in GitHub Actions |
| Docker                         | Dockerfile for the API, Docker Compose with API and database                                                                                                          | Frontend, backend and database in Compose, optimized Dockerfile, deployed app is a bonus                |
| Teamwork and Git               | Issues for features, commits from everyone                                                                                                                            | Branches, pull requests with review, issues linked to pull requests                                     |
| Documentation and presentation | README with setup, endpoints and roles in the group, working demo                                                                                                     | Personal reflection, clear explanation of technical choices, everyone answers questions about the code  |

## How to plan your project

Plan backwards from 8 January: decide what must be finished, then split it into small features.

**Use GitHub Issues as features**

1. Write your feature list first, for example "User can log in" or "User can create a booking".
2. Create one GitHub Issue per feature. Each issue should be small enough to finish in 1–2 days.
3. Put all issues on a GitHub Projects board with the columns To do, In progress and Done.
4. Give every issue an owner and a label (backend, frontend, test, docker).
5. Mark the core features as "must have". Do these first. Extra features come last.
   **Suggested timeline**

_Week 48 (23–29 November): plan and start_

- [ ] Choose your idea and write a short description
- [ ] Draw your data model (models and relations)
- [ ] Create the repository, the project board and the issues
- [ ] Set up the backend with Sequelize and the first model
      _Week 49 (30 November–6 December): backend and Docker_

- [ ] CRUD endpoints with Zod validation
- [ ] Dockerfile and Docker Compose with API and database
- [ ] First Vitest and Supertest tests
      _Week 50 (7–13 December): frontend and login_

- [ ] React pages connected to the API with axios
- [ ] Login with Firebase or Auth0 and protected routes
      _Week 51 (14–20 December): tests and feature freeze_

- [ ] All core requirements are done and tested
- [ ] Playwright tests and GitHub Actions (stretch goals)
- [ ] No new features after this week, only fixes
      _Christmas break (21 December–3 January)_

- [ ] Optional: polish, deployment, extra features

_Week 1 (4–8 January): finish and present_

- [ ] Test the whole app from a fresh `git clone` with `docker compose up`
- [ ] Finish the README and the reflections
- [ ] Prepare the presentation
      Tip: have a short meeting at the start of every lesson. Each person says what they did, what they will do next, and if they are stuck.

## Submission and presentation

Share the link to your GitHub repository by **Friday 8 January 2027**. Then it's time to show what you built.

**Presentation (about 15 minutes per group)**

- Live demo of the app, started with `docker compose up`
- Show the data model and one or two parts of the code you are proud of
- Run the tests and show that they pass
- Every group member presents a part and answers questions about the code
  **Before you present, check that:**

- [ ] The app starts from a fresh `git clone` by following the README
- [ ] `npm test` passes
- [ ] No `.env` file or secrets are in the repository
- [ ] All core requirements are done
