import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authenticateToken from "../Middleware/authMiddleware.js";

const router = Router();
const users = []; // Temporary storage for users
const SECRET_KEY = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Please provide an email and password");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword });
  res.status(201).send("User registered successfully");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(400).send("User not found");
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).send("Invalid password");
  }
  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
  res.status(200).send({ token });
});

router.get("/protected", authenticateToken, (req, res) => {
  res.status(200).json({ message: "You are authorized", user: req.user });
});

export default router;
