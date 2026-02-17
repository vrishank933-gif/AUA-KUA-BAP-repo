import { useState } from "react";
import { validateEmail, validatePassword } from "../utils/validators";
import "../styles/login.css";
 
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showPasswordHint, setShowPasswordHint] = useState(false);
 
  const handleSubmit = (e) => {
    e.preventDefault();
 
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
 
    setErrors({});
    setSuccessMessage("Login successful");
 
    console.log("Login successful for:", email.trim());
  };
 
  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>AUA / KUA Onboarding Portal</h2>
 
        <form onSubmit={handleSubmit} noValidate>
          {/* Email Field */}
          <input
            type="email"
            placeholder="Registered Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
 
          {/* Password Field */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setShowPasswordHint(true)}
            onBlur={() => setShowPasswordHint(false)}
          />
 
          {/* Password Rules (shown only on focus) */}
          {showPasswordHint && (
            <p className="password-hint">
              Use 8+ characters with uppercase, lowercase, number, and special
              character.
            </p>
          )}
 
          {errors.password && (
            <p className="error-text">{errors.password}</p>
          )}
 
          <button type="submit">Login</button>
 
          {/* Success Message */}
          {successMessage && (
            <p className="success-text">{successMessage}</p>
          )}
        </form>
 
        <div className="login-links">
          <a href="#">Forgot Password?</a>
          <span> | </span>
          <a href="#">Help</a>
        </div>
      </div>
    </div>
  );
};
export default Login;