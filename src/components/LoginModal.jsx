import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../utils/validators";
import "../styles/login.css";

const LoginModal = ({ onClose, openRegister }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showPasswordHint, setShowPasswordHint] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setSuccessMessage("Login successful");

      setTimeout(() => {
        onClose();
        navigate("/application");
      }, 1000);

    } catch (error) {
      setErrors({ password: "Server error. Try again later." });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="login-card"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="close-btn" onClick={onClose}>
          ×
        </span>

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

          {errors.password && <p className="error-text">{errors.password}</p>}

          <button type="submit">Login</button>

          {successMessage && (
            <p className="success-text">{successMessage}</p>
          )}
        </form>

        <div className="login-links">
          <span style={{ cursor: "pointer" }}>
            Forgot Password?
          </span>
          <span> | </span>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              onClose();
              openRegister();
            }}
          >
            New User? Register
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
