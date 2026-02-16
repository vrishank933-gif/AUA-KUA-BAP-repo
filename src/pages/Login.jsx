import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail, validatePassword } from "../utils/validators";
import "../styles/login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showPasswordHint, setShowPasswordHint] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login button clicked");
    // Frontend validation
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      });
      setSuccessMessage("");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrors({ password: data.message });
        setSuccessMessage("");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setErrors({});
      setSuccessMessage("Login successful");

      setTimeout(() => {
        navigate("/application");
      }, 1000);

    } catch (error) {
      console.error("Login error:", error);
      setErrors({ password: "Server error. Try again later." });
      setSuccessMessage("");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>AUA / KUA Onboarding Portal</h2>

        <form onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            placeholder="Registered Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setShowPasswordHint(true)}
            onBlur={() => setShowPasswordHint(false)}
          />

          {showPasswordHint && (
            <p className="password-hint">
              Use 8+ characters with uppercase, lowercase, number, and special character.
            </p>
          )}

          {errors.password && (
            <p className="error-text">{errors.password}</p>
          )}

          <button type="submit">Login</button>

          {successMessage && (
            <p className="success-text">{successMessage}</p>
          )}
        </form>

        <div className="login-links">
          <Link to="/">Forgot Password?</Link>
          <span> | </span>
          <Link to="/register">New User? Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
