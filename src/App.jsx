import { useState } from "react";
import AuthView from "./components/AuthView";
import TodoView from "./components/TodoView";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <main className="page">
      <section className="card">
        <h1>Todo App</h1>

        {!isLoggedIn && <AuthView />}
        {isLoggedIn && <TodoView />}

        <p className="status" aria-live="polite"></p>
      </section>
    </main>
  );
}
