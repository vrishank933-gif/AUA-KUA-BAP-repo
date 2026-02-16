import { useState } from "react";
import { 
  validateName, 
  validateEmail, 
  validatePassword,
  validateMobile 
} from "../utils/validators";
import "../styles/register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;

    const mobileError = validateMobile(formData.mobile);
    if (mobileError) newErrors.mobile = mobileError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccessMessage("");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            mobile: formData.mobile.trim(),
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrors({ email: data.message });
        setSuccessMessage("");
        return;
      }

      setErrors({});
      setSuccessMessage(data.message);

      console.log("Registered User:", data);

    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ email: "Server error. Try again later." });
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2>User Registration</h2>

        <form onSubmit={handleSubmit} noValidate>

          {/* Full Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && (
            <p className="error-text">{errors.name}</p>
          )}

          {/* Mobile Number */}
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            maxLength="10"
          />
          {errors.mobile && (
            <p className="error-text">{errors.mobile}</p>
          )}

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email ID"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="error-text">{errors.email}</p>
          )}

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p className="error-text">{errors.password}</p>
          )}

          <button type="submit">Register</button>

          {successMessage && (
            <p className="success-text">{successMessage}</p>
          )}

        </form>
      </div>
    </div>
  );
};

export default Register;
