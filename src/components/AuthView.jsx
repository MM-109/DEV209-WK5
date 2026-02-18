import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";

export default function AuthView({ onRegister, onLogin }) {
  return (
    <div className="two-col">
      <RegisterForm onRegister={onRegister} />
      <LoginForm onLogin={onLogin} />
    </div>
  );
}

