export default function RegisterForm() {
  return (
    <div>
      <h2>Register</h2>
      <form>
        <label>
          Username
          <input required autoComplete="username" />
        </label>

        <label>
          Password
          <input type="password" required autoComplete="new-password" />
        </label>

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}
