export default function TodoView() {
  return (
    <section className="hidden">
      <div className="toolbar">
        <div>
          Signed in as: <strong>—</strong>
        </div>
        <button type="button">Logout</button>
      </div>

      <h2>Your Todos</h2>

      <form className="todo-form">
        <label>
          Title
          <input required />
        </label>

        <label>
          Description (optional)
          <input />
        </label>

        <button type="submit">Add Todo</button>
      </form>

      <ul className="todo-list"></ul>
    </section>
  );
}
