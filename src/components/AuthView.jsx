import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";

export default function AuthView() {
  return (
    <section>
      <div className="two-col">
        <RegisterForm />
        <LoginForm />
      </div>
    </section>
  );
}
