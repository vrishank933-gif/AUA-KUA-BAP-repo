import { useState } from "react";
import { validateEmail, validatePassword } from "../utils/validators";
import "../styles/register.css";
 
const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    gender: "",
    mobile: "",
    password: "",
  });
 
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
 
    // Name validation
    if (!formData.name.trim())
      newErrors.name = "Name is required";
    else if (!/^[a-zA-Z ]+$/.test(formData.name))
      newErrors.name = "Name can contain only letters";
    else if (formData.name.length < 3)
      newErrors.name = "Name must be at least 3 characters";
 
    // Email validation
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
 
    // DOB validation
    if (!formData.dob)
      newErrors.dob = "Date of Birth is required";
    else if (new Date(formData.dob) > new Date())
      newErrors.dob = "Date of Birth cannot be in the future";
 
    // Gender validation
    if (!formData.gender)
      newErrors.gender = "Please select gender";
 
    // Mobile validation
    if (!/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = "Enter valid 10-digit mobile number";
 
    // Password validation
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
 
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
 
    setErrors({});
    setSuccessMessage("Registration successful. Please login to continue.");
 
    console.log("Registered User:", formData);
  };
 
  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2>User Registration</h2>
 
        <form onSubmit={handleSubmit} noValidate>
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
 
          <input
            type="email"
            name="email"
            placeholder="Email ID"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
 
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
          {errors.dob && <p className="error-text">{errors.dob}</p>}
 
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="error-text">{errors.gender}</p>}
 
          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
          />
          {errors.mobile && <p className="error-text">{errors.mobile}</p>}
 
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