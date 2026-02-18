import { useEffect, useState } from "react";
import AuthView from "./components/AuthView";
import TodoView from "./components/TodoView";
import "./App.css";

const BASE_URL = "http://localhost:3000";

const ROUTES = {
  register: "/register",
  login: "/login",
  logout: "/logout",
  todos: "/todos",
};

const TOKEN_COOKIE = "authToken";

function setCookie(name, value) {
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/`;
}

function getCookie(name) {
  const target = `${encodeURIComponent(name)}=`;
  const parts = document.cookie.split(";").map((s) => s.trim());
  for (const part of parts) {
    if (part.startsWith(target)) return decodeURIComponent(part.slice(target.length));
  }
  return null;
}

function deleteCookie(name) {
  document.cookie = `${encodeURIComponent(name)}=; Max-Age=0; path=/`;
}

function getToken() {
  return getCookie(TOKEN_COOKIE);
}

async function apiFetch(path, { method = "GET", body = null, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (!token) throw new Error("Missing auth token. Please log in again.");
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (res.status === 204) return null;

  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && (data.message || data.error)) ||
      (typeof data === "string" && data) ||
      `${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  return data;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(getToken()));
  const [username, setUsername] = useState("—");
  const [status, setStatus] = useState({ msg: "", kind: "" });
  const [todos, setTodos] = useState([]);

  function setStatusMsg(msg, kind = "") {
    const safeMsg =
      typeof msg === "string" && msg.includes("<!DOCTYPE")
        ? "Server returned an HTML error. Check your route/endpoint."
        : msg;
    setStatus({ msg: safeMsg || "", kind });
  }

  async function refreshTodos() {
    const data = await apiFetch(ROUTES.todos, { auth: true });
    setTodos(Array.isArray(data) ? data : []);
  }

  async function register(usernameValue, passwordValue) {
    setStatusMsg("Registering...");
    await apiFetch(ROUTES.register, { method: "POST", body: { username: usernameValue, password: passwordValue } });
    setStatusMsg("Registered! Now log in.", "ok");
  }

  async function login(usernameValue, passwordValue) {
    setStatusMsg("Logging in...");
    const data = await apiFetch(ROUTES.login, { method: "POST", body: { username: usernameValue, password: passwordValue } });

    const token = data?.authToken || data?.token;
    if (!token) throw new Error("Login response did not include token.");

    setCookie(TOKEN_COOKIE, token);
    setUsername(usernameValue);
    setIsLoggedIn(true);

    setStatusMsg("Logged in.", "ok");
    await refreshTodos();
  }

  async function logout() {
    try {
      const token = getToken();
      if (token) {
        await apiFetch(ROUTES.logout, { method: "POST", auth: true }).catch(() => {});
      }
    } finally {
      deleteCookie(TOKEN_COOKIE);
      setTodos([]);
      setIsLoggedIn(false);
      setUsername("—");
      setStatusMsg("Logged out.", "ok");
    }
  }

  async function createTodo(title, description) {
    setStatusMsg("Adding todo...");
    await apiFetch(ROUTES.todos, { method: "POST", auth: true, body: { title, description } });
    await refreshTodos();
    setStatusMsg("Added.", "ok");
  }

  async function updateTodo(id, patch) {
    setStatusMsg("Updating todo...");
    await apiFetch(`${ROUTES.todos}/${encodeURIComponent(id)}`, { method: "PUT", auth: true, body: patch });
    await refreshTodos();
    setStatusMsg("Updated.", "ok");
  }

  async function deleteTodo(id) {
    setStatusMsg("Deleting todo...");
    await apiFetch(`${ROUTES.todos}/${encodeURIComponent(id)}`, { method: "DELETE", auth: true });
    await refreshTodos();
    setStatusMsg("Deleted.", "ok");
  }

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    setIsLoggedIn(true);
    setUsername("user");

    refreshTodos().catch((err) => {
      deleteCookie(TOKEN_COOKIE);
      setIsLoggedIn(false);
      setUsername("—");
      setStatusMsg(`Session expired: ${err.message}`, "err");
    });
  }, []);

  return (
    <main className="page">
      <section className="card">
        <h1>Todo App</h1>

        {!isLoggedIn && (
          <div id="authView">
            <AuthView
              onRegister={async (u, p) => {
                try {
                  setStatusMsg("");
                  await register(u, p);
                } catch (err) {
                  setStatusMsg(err.message, "err");
                }
              }}
              onLogin={async (u, p) => {
                try {
                  setStatusMsg("");
                  await login(u, p);
                } catch (err) {
                  setStatusMsg(err.message, "err");
                }
              }}
            />
          </div>
        )}

        {isLoggedIn && (
          <div id="todoView">
            <TodoView
              username={username}
              todos={todos}
              onLogout={async () => {
                try {
                  await logout();
                } catch (err) {
                  setStatusMsg(err.message, "err");
                }
              }}
              onCreate={async (title, desc) => {
                try {
                  setStatusMsg("");
                  await createTodo(title, desc);
                } catch (err) {
                  setStatusMsg(err.message, "err");
                }
              }}
              onToggle={async (id, completed) => {
                try {
                  setStatusMsg("");
                  await updateTodo(id, { completed: !completed });
                } catch (err) {
                  setStatusMsg(err.message, "err");
                }
              }}
              onEdit={async (id, title, description) => {
                const newTitle = prompt("New title:", title ?? "");
                if (newTitle === null) return;

                const newDesc = prompt("New description (optional):", description ?? "");
                if (newDesc === null) return;

                try {
                  setStatusMsg("");
                  await updateTodo(id, { title: newTitle.trim(), description: newDesc.trim() });
                } catch (err) {
                  setStatusMsg(err.message, "err");
                }
              }}
              onDelete={async (id) => {
                if (!confirm("Delete this todo?")) return;
                try {
                  setStatusMsg("");
                  await deleteTodo(id);
                } catch (err) {
                  setStatusMsg(err.message, "err");
                }
              }}
            />
          </div>
        )}

        <p className={`status${status.kind ? " " + status.kind : ""}`} aria-live="polite">
          {status.msg}
        </p>
      </section>
    </main>
  );
}
