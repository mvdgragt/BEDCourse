# Homework: adding more login providers

**Firebase Authentication + Secure API — practical assignment**

- Repo: [github.com/mvdgragt/Firebase-Auth-Secure-API](https://github.com/mvdgragt/Firebase-Auth-Secure-API)
- Tutorial: [youtube.com/watch?v=YDtWWYu_xDo](https://www.youtube.com/watch?v=YDtWWYu_xDo)

---

Fork the repo above and **choose either Task A or Task B**, you only need to do one. Both follow the same pattern you saw in the tutorial. The goal is to read the Firebase docs, adapt the existing code, and understand *why* each piece is needed. Once your task is working, run the unit tests provided. The challenge at the end is **optional** but give it a go if you want to push further.

---

## Task A: Add a "Login with GitHub" button

*Beginner–intermediate · about 1–2 hours*

1. In your Firebase console go to **Authentication → Sign-in method** and enable the **GitHub** provider. You will need to create a GitHub OAuth App at [github.com/settings/developers](https://github.com/settings/developers) to obtain a Client ID and Secret.

2. In `login.jsx`, import `GithubAuthProvider` alongside the existing `GoogleAuthProvider`. Create a new provider instance and a new `handleGithubLogin` function using the same `signInWithPopup` pattern from the tutorial.

3. Add a "Login with GitHub" button to the JSX, next to the existing Google button. Both buttons should work independently.

4. Test that after logging in via GitHub the `displayName`, `email`, and token all appear correctly — and that the "Fetch secure data" button still works.

> **Hint:** The backend needs no changes. Firebase tokens from any provider are verified the same way by `firebase-admin`.

---

## Task B: Add a register & login form

*Beginner–intermediate · about 1–2 hours*

1. Enable the **Email/Password** provider in your Firebase console.

2. In `login.jsx`, add two input fields (email + password) and two buttons: "Register" and "Log in". Import `createUserWithEmailAndPassword` and `signInWithEmailAndPassword` from Firebase Auth.

3. Wire up the buttons: "Register" calls `createUserWithEmailAndPassword`, "Log in" calls `signInWithEmailAndPassword`. Both should use `getAuth(app)` for the auth instance.

4. Show a readable error message if login fails (e.g. wrong password). Firebase error codes like `auth/wrong-password` can be caught in your `catch` block.

> **Hint:** `createUserWithEmailAndPassword` also returns a `result.user`. You can reuse the same state-setting logic from the Google login.

---

## Optional challenge: Don't lose the user on page refresh

*Intermediate–advanced · about 2–3 hours · Only try this once your main task is working and tested.*

Right now, if you refresh the page after logging in, the user state disappears even though the Firebase session is still valid. Fix this.

1. Use Firebase's `onAuthStateChanged(auth, callback)` inside a `useEffect` to listen for the auth state. When a user is already signed in (e.g. after a refresh), this fires automatically and gives you the user object back.

2. Set the user state from this listener so the UI updates without requiring a new login.

3. Make sure to **unsubscribe** from the listener when the component unmounts. `onAuthStateChanged` returns an unsubscribe function you can return from the `useEffect`.

4. **Bonus:** Add a loading state so the UI shows a spinner (or nothing) while Firebase checks the auth status on first load, instead of briefly flashing the "not logged in" view.

> **Reflect:** Why does this matter in a real app? What user experience problem does it solve? Write 2–3 sentences in your submission.

---

## Unit tests

These tests check your UI logic, so no network calls and no Firebase account is needed. They work with the Vitest and Jest you already know.

Install the extra testing libraries first:

```bash
# @testing-library/react  — lets you render components in tests
# @testing-library/jest-dom — adds toBeInTheDocument() and similar matchers
# jsdom  — pretends to be a browser so render() has a DOM to work with
# (jest-dom and jsdom are used automatically — you won't import them directly)
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Copy this into `client/src/components/login/login.test.jsx` and run `npm test`. Read the comment above each test to understand what it is checking before you run it.

```jsx
// login.test.jsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// We are not testing Firebase here — just the UI.
// So we create a simple fake component that looks like
// your Login component but has no Firebase code inside.

// This fake version just shows the same buttons and text
// so we can check they appear on screen.
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

describe('Login UI', () => {

  // Test 1: check the login buttons show up before anyone is logged in
  it('shows login buttons when no user is logged in', () => {
    render(<FakeLogin user={null} />);
    expect(screen.getByText('Google login')).toBeInTheDocument();
    expect(screen.getByText('GitHub login')).toBeInTheDocument();
  });

  // Test 2: check the login buttons are GONE after login
  it('hides login buttons when a user is logged in', () => {
    const fakeUser = { displayName: 'Ada', email: 'ada@test.com' };
    render(<FakeLogin user={fakeUser} />);
    expect(screen.queryByText('Google login')).not.toBeInTheDocument();
    expect(screen.queryByText('GitHub login')).not.toBeInTheDocument();
  });

  // Test 3: check the user's name appears after login
  it('shows the user display name when logged in', () => {
    const fakeUser = { displayName: 'Ada', email: 'ada@test.com' };
    render(<FakeLogin user={fakeUser} />);
    expect(screen.getByText('Ada')).toBeInTheDocument();
  });

  // Test 4: check the sign-out button appears after login
  it('shows a sign-out button when logged in', () => {
    const fakeUser = { displayName: 'Ada', email: 'ada@test.com' };
    render(<FakeLogin user={fakeUser} />);
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  // Test 5: check the fetch button appears after login
  it('shows the fetch secure data button when logged in', () => {
    const fakeUser = { displayName: 'Ada', email: 'ada@test.com' };
    render(<FakeLogin user={fakeUser} />);
    expect(screen.getByText('Fetch secure data')).toBeInTheDocument();
  });

});
```

> **Why a fake component?** Real Firebase calls go to the internet and need an account. That makes tests slow and fragile. By testing a simplified fake version, you focus on one question at a time: *does the UI show the right thing?* This is standard practice — you will learn how to test real Firebase calls later in the course.

---

## Integration test

This test checks your **Express backend** directly. Does it block requests with no token, and does it let through requests with a valid one?

Unlike the unit tests above, this one starts your Express app on a real port and sends actual HTTP requests to it, so you can see exactly what a browser would get back.

No new libraries needed. Just make sure your `backend/package.json` has `"type": "module"` so Node treats the file as ES6:

```json
{
  "type": "module"
}
```

Copy this into `backend/index.test.js` and run `npx vitest`. Read the comments as they explain what each test is checking and why.

```js
// backend/index.test.js
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import { createServer } from 'node:http';

// We build a tiny version of your Express app right here in the test.
// This is the same verifyToken logic from your middleware/auth.js —
// copy it in exactly as it is in your file.

// Paste your verifyToken function here:
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    // In a real test this would call firebase-admin.
    // For now we accept one hard-coded 'test-token' so the
    // test can run without a real Firebase project.
    if (token !== 'test-token') throw new Error('bad token');
    req.user = { uid: 'user-123', email: 'test@test.com' };
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// A small test app — same route as your real backend
const app = express();
app.use(express.json());
app.get('/api/secure-data', verifyToken, (req, res) => {
  res.json({ message: 'This is protected data.' });
});

// beforeAll starts the server before any test runs
// afterAll shuts it down cleanly afterwards
let server;
let baseUrl;

beforeAll(() => {
  server = createServer(app);
  server.listen(0); // port 0 = pick any free port automatically
  const { port } = server.address();
  baseUrl = `http://localhost:${port}`;
});

afterAll(() => server.close());

// Tests
describe('GET /api/secure-data', () => {

  // Test 1: no token at all — should be blocked
  it('returns 401 when there is no token', async () => {
    const res = await fetch(`${baseUrl}/api/secure-data`);
    expect(res.status).toBe(401);
  });

  // Test 2: wrong token — should also be blocked
  it('returns 401 when the token is wrong', async () => {
    const res = await fetch(`${baseUrl}/api/secure-data`, {
      headers: { Authorization: 'Bearer wrong-token' },
    });
    expect(res.status).toBe(401);
  });

  // Test 3: correct token — should get the data
  it('returns 200 and data when the token is correct', async () => {
    const res = await fetch(`${baseUrl}/api/secure-data`, {
      headers: { Authorization: 'Bearer test-token' },
    });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.message).toMatch(/protected data/i);
  });

});
```

---

## What to submit

A link to your repo in the attached word document
