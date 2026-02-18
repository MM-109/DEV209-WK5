import { useState } from "react";

export default function TodoView({ username, todos, onLogout, onCreate, onToggle, onEdit, onDelete }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  return (
    <>
      <div className="toolbar">
        <div>
          Signed in as: <strong id="whoami">{username || "user"}</strong>
        </div>
        <button id="logoutBtn" type="button" onClick={onLogout}>
          Logout
        </button>
      </div>

      <h2>Your Todos</h2>

      <form
        id="todoForm"
        className="todo-form"
        onSubmit={(e) => {
          e.preventDefault();
          const t = title.trim();
          const d = desc.trim();
          if (!t) return;
          onCreate(t, d);
          setTitle("");
          setDesc("");
        }}
      >
        <label>
          Title
          <input id="todoTitle" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label>
          Description (optional)
          <input id="todoDesc" value={desc} onChange={(e) => setDesc(e.target.value)} />
        </label>

        <button type="submit">Add</button>
      </form>

      <ul id="todoList" className="todo-list">
        {!Array.isArray(todos) || todos.length === 0 ? (
          <li className="todo-item">No todos yet. Add one above.</li>
        ) : (
          todos.map((t) => {
            const id = t.id;
            const title = t.title ?? "(Untitled)";
            const description = t.description ?? "";
            const completed = Boolean(t.completed);

            return (
              <li key={id} className="todo-item">
                <div className="todo-top">
                  <div>
                    <div className="todo-title">{title}</div>
                    {description ? <div className="todo-desc">{description}</div> : null}
                  </div>
                  <div>
                    <span className="badge">{completed ? "Completed" : "Active"}</span>
                  </div>
                </div>

                <div className="actions">
                  <button type="button" className="btn-ghost" onClick={() => onToggle(id, completed)}>
                    {completed ? "Mark Active" : "Mark Complete"}
                  </button>

                  <button type="button" className="btn-secondary" onClick={() => onEdit(id, title, description)}>
                    Edit
                  </button>

                  <button type="button" className="btn-danger" onClick={() => onDelete(id)}>
                    Delete
                  </button>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </>
  );
}

