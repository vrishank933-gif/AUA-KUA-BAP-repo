import { useState, useEffect } from "react";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateMobile,
} from "../utils/validators";
import "../styles/register.css";

const Register = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= MODAL SIDE EFFECTS ================= */

  useEffect(() => {
    // Disable background scroll
    document.body.style.overflow = "hidden";

    // Close on ESC key
    const handleEsc = (e) => {
      if (e.key === "Escape" && typeof onClose === "function") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
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
      setLoading(true);

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
        setErrors({ email: data.message || "Registration failed" });
        setSuccessMessage("");
        return;
      }

      setErrors({});
      setSuccessMessage("Registration successful");

      // Reset form
      setFormData({
        name: "",
        mobile: "",
        email: "",
        password: "",
      });

      // Auto close modal
      setTimeout(() => {
        if (typeof onClose === "function") {
          onClose();
        }
      }, 3000);

    } catch (error) {
      setErrors({ email: "Server error. Try again later." });
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div
      className="modal-overlay"
      onClick={() => typeof onClose === "function" && onClose()}
    >
      <div
        className="registration-card"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className="close-btn"
          onClick={() => typeof onClose === "function" && onClose()}
        >
          ×
        </span>

        <h2>User Registration</h2>
        <p className="form-subtext">
          Create your account to access the portal
        </p>

        <form onSubmit={handleSubmit} noValidate>

          {/* FULL NAME */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}

          {/* MOBILE */}
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            maxLength="10"
          />
          {errors.mobile && <p className="error-text">{errors.mobile}</p>}

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email ID"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Register"}
          </button>

          {successMessage && (
            <p className="success-text">{successMessage}</p>
          )}

        </form>
      </div>
    </div>
  );
};

export default Register;
