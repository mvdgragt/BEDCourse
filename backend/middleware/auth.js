import admin from "../firebaseAdmin.js";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach user info to request object
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};
