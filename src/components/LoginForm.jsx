export default function LoginForm() {
  return (
    <div>
      <h2>Login</h2>
      <form>
        <label>
          Username
          <input required autoComplete="username" />
        </label>

        <label>
          Password
          <input type="password" required autoComplete="current-password" />
        </label>

        <button type="submit">Log In</button>
      </form>
    </div>
  );
}
