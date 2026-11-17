# Week 12 – Continuous Integration with GitHub Actions

**Video:** [Run Your Tests Automatically with GitHub Actions](https://youtu.be/Id1_28Wbmog)

Your Week 10 tests only help if someone runs them. This week GitHub Actions runs `npm test` for you on every pull request. The video is a little older and used Jest but now we use Vitest, but the steps are the same.

**Before you start:** create the branch `week12/ci` from `week10/TDD`, so they have the same content. Check that `npm test` is green, that it runs `vitest run`, and that `package-lock.json` is committed to github.

In this assignment `week12/ci` plays the role of `main`: your workflow runs on it, and every pull request goes into it.

Answer every **Question:** in `ANSWERS.md`, and put screenshots in `screenshots/`.

## Easy

**Exercise 1: Your first workflow.** In the **Actions** tab, open the **Node.js** template and copy its content, but don't commit from the browser, unlike what I showed in the video. Save it locally as `.github/workflows/ci.yml` and rename it to `CI`. Remove the `npm run build --if-present` line if you like. In the on section, change both [ "main" ] to [ "week12/ci" ]. Push the branch and watch the run in the Actions tab.

**Question:** What do `on`, `runs-on`, `strategy.matrix` and `steps` do? Why did nothing happen when you only pushed the branch?

**Exercise 2: Read the report.** Click **Details** on the checks. How many jobs ran, and why? Find your pizza and library test names in the `npm test` step. Take a screenshot of the green checks.

**Question:** Why can a test pass on your laptop but fail in CI? Think of why the video's first run failed.

**Exercise 3: Red on purpose.** Create the branch `week12/red` from `week12/ci`, add a failing test, commit `red: failing test on purpose`, push, and open a pull request into `week12/ci`. Find the _expected_ and _received_ line in the log and take a screenshot. Fix it, push, merge, and check which event starts the new run on `week12/ci`.

**Question:** Why is a red cross on the pull request better than one after merging?

## Medium

From now on, make one branch from `week12/ci` per exercise and merge it through a pull request in `week12/ci`.

**Exercise 4: Check types in CI.** Vitest only runs your code; it doesn't check types. That's why the red line under `menu[pizzaType]` in Week 10, Exercise 1 didn't stop your tests. Let CI check the types too:

1. Add the script `"typecheck": "tsc --noEmit"` to `package.json`. Run `npm run typecheck` on your own machine and fix any errors it finds.
2. In `ci.yml`, add the step `- run: npm run typecheck` between `npm ci` and `npm test`.
3. Test it: add `const copies: number = "three";` to `library.ts` and push. CI goes red at the type check step. Take a screenshot, remove the line and push again.

**Question:** Would this step have caught the _possibly null_ bug from Week 11, Exercise 9?

**Exercise 5: Pick your Node versions.** The video tested on Node 18, 20 and 22. Check the [Node.js release schedule](https://nodejs.org/en/about/previous-releases) and change the matrix to the LTS versions that are supported today. Add an `engines` field to `package.json` with the lowest one.

**Question:** What's the difference between `npm ci` and `npm install`, and why does CI use `npm ci`?

**Exercise 6: Protect `week12/ci`.** In **Settings → Branches**, require a pull request and passing CI checks before merging into `week12/ci`. Open a pull request with a failing test and take a screenshot of the blocked merge button. Add a status badge to `README.md`. On a free account, a private repository may not enforce the rule; if so, write down what you saw.

**Question:** What does branch protection do that CI alone can't?

## Challenging (optional)

**Exercise 7: Fix the broken workflow.** Save this as `.github/workflows/broken.yml`. It has four bugs, and one of them makes it green while it's lying. Use only the logs, fix one bug per commit, then delete the file.

```yaml
name: Broken CI
on:
  pull_request:
    branches: ["master"]
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.x, 22.x]
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm test
```

**Question:** Which bug was the most dangerous, and why?

**Exercise 8: Coverage in CI.** Set an 80% threshold in `vitest.config.ts` (`test.coverage.thresholds`), run `npm run test:coverage` in CI, and upload the `coverage/` folder with `actions/upload-artifact` from one Node version only. Delete a test for an error path and check that CI goes red.

**Question:** Would a 100% threshold be a good idea? Use your Week 10 coverage answer.

**Exercise 9: CI for your Sentry API.** In your Week 11 API, create the branch `week12/api-ci`. Move the _is this a ZodError?_ check into `shouldReport(error)`, and unit test it. Test `reportError` too, with `vi.mock("@sentry/node")` so nothing reaches the real Sentry. Add the same workflow with `env: NODE_ENV: test`. Remember: CI has no `.env` and no database.

**Question:** What does Sentry do without a DSN? If CI did need the DSN, where would it go?

## Additional reading

- [Understanding GitHub Actions](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions) and [Building and testing Node.js](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs): the basics behind Exercises 1–3.
- [Events that trigger workflows](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows) and [Using a matrix](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs): Exercises 1, 5 and 7.
- [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches): Exercise 6.
- [Vitest: Coverage](https://vitest.dev/guide/coverage) and [Vitest: Mocking](https://vitest.dev/guide/mocking): Exercises 8 and 9.
- [Using secrets in GitHub Actions](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions): Exercise 9.
- [Continuous Integration](https://martinfowler.com/articles/continuousIntegration.html) (Martin Fowler): why CI exists. The first sections are enough.

## What to hand in

Push your work, merged into `week12/ci` through pull requests, with `ci.yml` (type check and updated Node versions included), a status badge, `ANSWERS.md`, the `screenshots/` folder and a commit history that shows at least one red run before green. If you get stuck, write down what you tried and where it broke.
