import { useState } from "react";

export default function RegisterForm({ onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      id="registerForm"
      onSubmit={(e) => {
        e.preventDefault();
        const u = username.trim();
        if (!u || !password) return;
        onRegister(u, password);
        setPassword("");
      }}
    >
      <h2>Register</h2>

      <label>
        Username
        <input id="regUsername" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>

      <label>
        Password
        <input id="regPassword" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>

      <button type="submit">Create Account</button>
    </form>
  );
}
