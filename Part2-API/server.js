const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
const PORT = 3000;

app.use(cors({ origin: "http://localhost:5175" }));
app.use(express.json());

const users = new Map();
const sessions = new Map();
const todosByUser = new Map();

function makeId() {
  return crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex");
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });
  const username = sessions.get(token);
  if (!username) return res.status(401).json({ error: "Invalid token" });
  req.username = username;
  req.token = token;
  next();
}

app.post("/register", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "Bad request" });
  if (users.has(username)) return res.status(409).json({ error: "User exists" });
  users.set(username, password);
  todosByUser.set(username, []);
  res.json({ ok: true });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "Bad request" });
  if (users.get(username) !== password) return res.status(401).json({ error: "Invalid credentials" });
  const token = makeId();
  sessions.set(token, username);
  res.json({ token });
});

app.post("/logout", authMiddleware, (req, res) => {
  sessions.delete(req.token);
  res.json({ ok: true });
});

app.get("/todos", authMiddleware, (req, res) => {
  res.json(todosByUser.get(req.username) || []);
});

app.post("/todos", authMiddleware, (req, res) => {
  const { title, description } = req.body || {};
  if (!title) return res.status(400).json({ error: "Title required" });
  const list = todosByUser.get(req.username);
  const todo = {
    id: makeId(),
    title: title.trim(),
    description: (description || "").trim(),
    completed: false,
  };
  list.push(todo);
  res.status(201).json(todo);
});

app.put("/todos/:id", authMiddleware, (req, res) => {
  const list = todosByUser.get(req.username);
  const todo = list.find((t) => t.id === req.params.id);
  if (!todo) return res.status(404).json({ error: "Not found" });
  if (typeof req.body.title === "string") todo.title = req.body.title.trim();
  if (typeof req.body.description === "string") todo.description = req.body.description.trim();
  if (typeof req.body.completed === "boolean") todo.completed = req.body.completed;
  res.json(todo);
});

app.delete("/todos/:id", authMiddleware, (req, res) => {
  const list = todosByUser.get(req.username);
  todosByUser.set(req.username, list.filter((t) => t.id !== req.params.id));
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
