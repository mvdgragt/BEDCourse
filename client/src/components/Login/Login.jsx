import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import app from "../../firebase/firebase.init";
import { useState } from "react";

const Login = () => {
  const [user, setUser] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loggedInUser = result.user;
      console.log("User:", loggedInUser);

      // Retrieve the token
      const token = await loggedInUser.getIdToken(true);
      console.log("Token:", token);

      // Save token to localStorage (or secure storage)
      localStorage.setItem("token", token);

      // Set the user in your application state
      setUser(loggedInUser);
    } catch (error) {
      console.error("Error during sign-in:", error.message);
    }
  };

  const handleGithubSignIn = () => {
    signInWithPopup(auth, githubProvider)
      .then((result) => {
        const loggedInUser = result.user;
        console.log(loggedInUser);
        setUser(loggedInUser);
      })
      .catch((error) => {
        console.log("error", error.message);
      });
  };

  const doLogin = async (email, password) => {
    // setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = result.user;
      const token = await loggedInUser.getIdToken();
      localStorage.setItem("token", token);
      setUser(loggedInUser);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEmailPasswordLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      console.log("Please provide both email and password.");
      return;
    }

    await doLogin(email, password);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User Signed out successfully!");
      setUser(null);
    } catch (error) {
      console.log("error", error.message);
    }
    signOut(auth)
      .then((result) => {
        console.log(result);
        setUser(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchSecureData = async () => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.log("No user is signed in.");
        return;
      }

      const token = await currentUser.getIdToken(true);

      localStorage.setItem("token", token);

      const response = await fetch("http://localhost:5001/secure-data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Secure data:", data);
      } else {
        console.log("Failed to fetch secure data:", response.status);
      }
    } catch (error) {
      console.log("Error fetching secure data:", error.message);
    }
  };

  return (
    <div>
      {user ? (
        <>
          <button onClick={handleSignOut}>Sign Out</button>
          <button onClick={fetchSecureData}>Fetch Secure Data</button>
        </>
      ) : (
        <div>
          <button onClick={handleGoogleSignIn}>Google Login</button>
          <button onClick={handleGithubSignIn}>Github Login</button>
          <form onSubmit={handleEmailPasswordLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button type="submit">Email and Password Login</button>
          </form>
        </div>
      )}
      {user && (
        <div>
          <h3>User: {user.displayName}</h3>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
};

export default Login;
