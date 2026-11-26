# Adding More Login Providers with Firebase Authentication

**Video:** [Firebase Authentication + Secure API](https://www.youtube.com/watch?v=YDtWWYu_xDo)

**Starter repo:** [github.com/mvdgragt/Firebase-Auth-Secure-API](https://github.com/mvdgragt/Firebase-Auth-Secure-API)

In the video we added **Login with Google** to a React app, and we protected an Express API with Firebase tokens. But most real apps give users more than one way to log in. This week you add a second login method yourself. Then you write tests that check the UI and the API.

Think of a Firebase token as a **passport**. Google, GitHub and email/password are different passport offices. Your backend is the border guard: it doesn't care which office gave you the passport. It only checks that the passport is real. That's why the backend doesn't change this week.

---

## Learning goals

After this assignment you can:

- Turn on a new sign-in provider in the Firebase console
- Add a new login method to a React app by reading the Firebase docs
- Explain why the backend doesn't change when you add a new provider
- Catch Firebase error codes and show a readable message
- Write unit tests for a React component with Vitest and Testing Library
- Write an integration test for a protected Express route

---

## Before you start

1. **Fork** the starter repo and clone your fork.
2. Add your own Firebase config, like in the video.
3. Start the client and the backend. Check that **Login with Google** and **Fetch secure data** work before you change anything.

### How to work

- **Small steps.** Change one thing, test it in the browser, then take the next step.
- **Commit every step**, with clear messages like `add GitHub provider` or `add unit tests for login UI`.
- **Answer every question** marked **Question:** in `ANSWERS.md`, in full sentences.

---

## Easy

Choose **one** of these two exercises. You only need to do one. Both follow the same pattern as the video. The goal is to read the Firebase docs, change the code you already have, and understand _why_ each piece is needed.

### Exercise 1: Add a "Login with GitHub" button

1. Create a GitHub OAuth App at [github.com/settings/developers](https://github.com/settings/developers). This gives you a **Client ID** and a **Client Secret**.
2. In the Firebase console, go to **Authentication → Sign-in method** and turn on the **GitHub** provider. Paste in the Client ID and Secret.
3. Firebase shows you a **callback URL**. Copy it into the "Authorization callback URL" field of your GitHub OAuth App.
4. In `login.jsx`, import `GithubAuthProvider` next to the `GoogleAuthProvider` you already have. Create a new provider, and a new `handleGithubLogin` function. Use the same `signInWithPopup` pattern as in the video.
5. Add a **Login with GitHub** button next to the Google button. Both buttons should work on their own.
6. Log in with GitHub. Check that the `displayName`, the `email` and the token show up, and that **Fetch secure data** still works.

> **Hint:** The backend needs no changes. `firebase-admin` checks tokens from every provider in the same way.

**Question:** You added a new login method, but you didn't change the backend at all. Why does **Fetch secure data** still work?

### Exercise 2: Add a register and login form

1. In the Firebase console, turn on the **Email/Password** provider.
2. In `login.jsx`, add two input fields (email and password) and two buttons: **Register** and **Log in**.
3. Import `createUserWithEmailAndPassword` and `signInWithEmailAndPassword` from `firebase/auth`.
4. Connect the buttons. **Register** calls `createUserWithEmailAndPassword`, and **Log in** calls `signInWithEmailAndPassword`. Both use `getAuth(app)` for the auth instance.
5. Show a readable error message when something goes wrong. Catch the error in your `catch` block and look at `error.code`. Test at least these cases:
   - a wrong password
   - an email that is already registered (`auth/email-already-in-use`)
   - a password that is too short (`auth/weak-password`)

> **Hint:** `createUserWithEmailAndPassword` also returns a `result.user`. You can reuse the code that sets the user state after the Google login.

> **Good to know:** New Firebase projects have **email enumeration protection** turned on. Then a wrong password gives `auth/invalid-credential`, not `auth/wrong-password`. Log `error.code` to the console to see which one you get.

**Question:** Why does Firebase give the same error for "wrong password" and "this email doesn't exist"? How does that protect your users?

---

## Medium

### Exercise 3: Unit tests for the login UI

These tests check your UI logic only. There are no network calls, and you don't need a Firebase account.

1. In the `client` folder, install the testing libraries:

   ```bash
   npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
   ```

   - `@testing-library/react` lets you render components in a test
   - `@testing-library/jest-dom` adds matchers like `toBeInTheDocument()`
   - `jsdom` acts like a browser, so `render()` has a page to draw on

2. Add a `test` part to your existing `vite.config.js`:

   ```js
   export default defineConfig({
     plugins: [react()],
     test: {
       environment: "jsdom", // use the fake browser
       globals: true, // clean the page after every test
       setupFiles: "./src/setupTests.js",
     },
   });
   ```

3. Create `client/src/setupTests.js` with one line:

   ```js
   import "@testing-library/jest-dom/vitest";
   ```

4. Add a test script to `client/package.json`:

   ```json
   "scripts": {
     "test": "vitest"
   }
   ```

5. Copy this into `client/src/components/login/login.test.jsx`. Read the comment above each test before you run it. Then run `npm test`.

   ```jsx
   // login.test.jsx
   import { render, screen } from "@testing-library/react";
   import { describe, it, expect } from "vitest";

   // We are not testing Firebase here, only the UI.
   // So we make a simple fake component that looks like
   // your Login component, but has no Firebase code inside.
   const FakeLogin = ({ user }) => {
     if (user) {
       return (
         <div>
           <p>{user.displayName}</p>
           <p>{user.email}</p>
           <button>Sign out</button>
           <button>Fetch secure data</button>
         </div>
       );
     }
     return (
       <div>
         <button>Google login</button>
         <button>GitHub login</button>
       </div>
     );
   };

   describe("Login UI", () => {
     // Test 1: the login buttons show up before anyone is logged in
     it("shows login buttons when no user is logged in", () => {
       render(<FakeLogin user={null} />);
       expect(screen.getByText("Google login")).toBeInTheDocument();
       expect(screen.getByText("GitHub login")).toBeInTheDocument();
     });

     // Test 2: the login buttons are GONE after login
     it("hides login buttons when a user is logged in", () => {
       const fakeUser = { displayName: "Ada", email: "ada@test.com" };
       render(<FakeLogin user={fakeUser} />);
       expect(screen.queryByText("Google login")).not.toBeInTheDocument();
       expect(screen.queryByText("GitHub login")).not.toBeInTheDocument();
     });

     // Test 3: the user's name shows up after login
     it("shows the user display name when logged in", () => {
       const fakeUser = { displayName: "Ada", email: "ada@test.com" };
       render(<FakeLogin user={fakeUser} />);
       expect(screen.getByText("Ada")).toBeInTheDocument();
     });

     // Test 4: the sign-out button shows up after login
     it("shows a sign-out button when logged in", () => {
       const fakeUser = { displayName: "Ada", email: "ada@test.com" };
       render(<FakeLogin user={fakeUser} />);
       expect(screen.getByText("Sign out")).toBeInTheDocument();
     });

     // Test 5: the fetch button shows up after login
     it("shows the fetch secure data button when logged in", () => {
       const fakeUser = { displayName: "Ada", email: "ada@test.com" };
       render(<FakeLogin user={fakeUser} />);
       expect(screen.getByText("Fetch secure data")).toBeInTheDocument();
     });
   });
   ```

6. All 5 tests should pass. Then add **one test of your own**. Did you do Exercise 2? Then add the email and password fields to `FakeLogin`, and test that they show up before login.

> **Why a fake component?** Real Firebase calls go over the internet and need an account. That makes tests slow and fragile. With a simple fake version, you test one question at a time: _does the UI show the right thing?_ This is normal practice. Later in the course you learn how to test real Firebase calls.

**Question:** Test 2 uses `queryByText`, but the other tests use `getByText`. What is the difference, and why does Test 2 need `queryByText`?

### Exercise 4: Integration test for the secure API

This test checks your **Express backend**. Does it block requests with no token? Does it let through requests with a valid token?

The unit tests above only render a component. This test starts your Express app on a real port and sends real HTTP requests to it. So you see exactly what a browser would get back.

1. In the `backend` folder, install Vitest:

   ```bash
   npm install -D vitest
   ```

2. Make sure `backend/package.json` has `"type": "module"`, so Node reads the file as an ES module:

   ```json
   {
     "type": "module"
   }
   ```

3. Copy this into `backend/index.test.js` and run `npx vitest`. Read the comments. They explain what each test checks and why.

   ```js
   // backend/index.test.js
   import { describe, it, expect, beforeAll, afterAll } from "vitest";
   import express from "express";
   import { createServer } from "node:http";

   // We build a tiny version of your Express app here in the test.
   // This is the same verifyToken logic as in your middleware/auth.js.
   const verifyToken = async (req, res, next) => {
     const authHeader = req.headers["authorization"] || "";
     const token = authHeader.split(" ")[1];
     if (!token) {
       return res.status(401).json({ error: "No token provided" });
     }
     try {
       // In your real app this calls firebase-admin.
       // Here we accept one fixed 'test-token', so the test
       // can run without a real Firebase project.
       if (token !== "test-token") throw new Error("bad token");
       req.user = { uid: "user-123", email: "test@test.com" };
       next();
     } catch {
       res.status(401).json({ error: "Unauthorized" });
     }
   };

   // A small test app, with the same route as your real backend
   const app = express();
   app.use(express.json());
   app.get("/api/secure-data", verifyToken, (req, res) => {
     res.json({ message: "This is protected data." });
   });

   // beforeAll starts the server before the tests run.
   // afterAll shuts it down when the tests are done.
   let server;
   let baseUrl;

   beforeAll(async () => {
     server = createServer(app);
     // port 0 = pick any free port
     await new Promise((resolve) => server.listen(0, resolve));
     const { port } = server.address();
     baseUrl = `http://localhost:${port}`;
   });

   afterAll(() => server.close());

   describe("GET /api/secure-data", () => {
     // Test 1: no token at all, so it should be blocked
     it("returns 401 when there is no token", async () => {
       const res = await fetch(`${baseUrl}/api/secure-data`);
       expect(res.status).toBe(401);
     });

     // Test 2: a wrong token, so it should also be blocked
     it("returns 401 when the token is wrong", async () => {
       const res = await fetch(`${baseUrl}/api/secure-data`, {
         headers: { Authorization: "Bearer wrong-token" },
       });
       expect(res.status).toBe(401);
     });

     // Test 3: the correct token, so it should get the data
     it("returns 200 and data when the token is correct", async () => {
       const res = await fetch(`${baseUrl}/api/secure-data`, {
         headers: { Authorization: "Bearer test-token" },
       });
       const data = await res.json();
       expect(res.status).toBe(200);
       expect(data.message).toMatch(/protected data/i);
     });
   });
   ```

4. All 3 tests should pass. Then add **one test of your own**, for example a header with no `Bearer` part (`Authorization: test-token`). What do you expect? Does the test agree?

**Question:** Test 2 and Test 3 send the same request, but with a different token. Why do we need both tests? What bug could slip through if we only had Test 3?

---

## Challenging (optional)

Only try this when your Easy exercise works and your tests pass.

### Exercise 5: Don't lose the user on page refresh

Right now, the user state disappears when you refresh the page after logging in. But the Firebase session is still valid! Fix this.

1. Use Firebase's `onAuthStateChanged(auth, callback)` inside a `useEffect` to listen to the auth state. When a user is already logged in (for example after a refresh), it runs by itself and gives you the user object.
2. Set the user state from this listener. Now the UI updates without a new login.
3. **Unsubscribe** from the listener when the component unmounts. `onAuthStateChanged` returns an unsubscribe function. Return it from your `useEffect`.
4. **Bonus:** Add a loading state. While Firebase checks the auth status on first load, show a spinner (or nothing). Then the "not logged in" view doesn't flash for a moment.

> **Hint:** Your `useEffect` can look like this: `useEffect(() => { const unsubscribe = onAuthStateChanged(auth, (user) => { ... }); return unsubscribe; }, []);`

**Question:** Why does this matter in a real app? Which problem does it solve for the user? Answer in 2–3 sentences.

---

## Additional reading

### Watch and read first

- [Firebase Authentication + Secure API](https://www.youtube.com/watch?v=YDtWWYu_xDo): this week's video.
- [Verify ID tokens](https://firebase.google.com/docs/auth/admin/verify-id-tokens): how `firebase-admin` checks a token in the backend.

### Read for the exercises

- [Authenticate using GitHub](https://firebase.google.com/docs/auth/web/github-auth): setting up the GitHub provider. Useful for Exercise 1.
- [Password authentication](https://firebase.google.com/docs/auth/web/password-auth): register and log in with email. Useful for Exercise 2.
- [Email enumeration protection](https://cloud.google.com/identity-platform/docs/admin/email-enumeration-protection): why you get `auth/invalid-credential`. Useful for Exercise 2.
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/): `render`, `screen`, `getByText` and `queryByText`. Useful for Exercise 3.
- [Vitest: getting started](https://vitest.dev/guide/): running and configuring tests. Useful for Exercises 3 and 4.
- [Manage users](https://firebase.google.com/docs/auth/web/manage-users): `onAuthStateChanged` and the current user. Useful for Exercise 5.

---

## What to hand in

Push your fork with:

- [ ] **Exercise 1 or 2:** a second login method that works next to Google login
- [ ] `client/src/components/login/login.test.jsx` with the 5 tests plus one of your own, all passing
- [ ] `backend/index.test.js` with the 3 tests plus one of your own, all passing
- [ ] `ANSWERS.md` with every **Question:** answered
- [ ] Optional: Exercise 5, with the loading state if you did the bonus
- [ ] A commit history with small, clear steps

Put the link to your repo in the attached Word document.

If you get stuck, write down what you tried and where it broke. An honest "I got stuck here" is worth more than a copied solution.
