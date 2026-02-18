import { useState } from "react";

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      id="loginForm"
      onSubmit={(e) => {
        e.preventDefault();
        const u = username.trim();
        if (!u || !password) return;
        onLogin(u, password);
        setPassword("");
      }}
    >
      <h2>Login</h2>

      <label>
        Username
        <input id="loginUsername" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>

      <label>
        Password
        <input id="loginPassword" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>

      <button type="submit">Log In</button>
    </form>
  );
}

