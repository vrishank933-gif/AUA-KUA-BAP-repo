export const validateRequired = (value, fieldName) => {
  if (!value || String(value).trim() === "") {
    return `${fieldName} is required`;
  }
  return "";
};

// ================= EMAIL =================
export const validateEmail = (email) => {
  if (!email || email.trim() === "") return "Email is required";

  const trimmed = email.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regex.test(trimmed))
    return "Enter a valid email address";

  return "";
};

// ================= MOBILE =================
export const validateMobile = (mobile) => {
  if (!mobile || mobile.trim() === "")
    return "Mobile number is required";

  const trimmed = mobile.trim();
  const regex = /^\d{10}$/;

  if (!regex.test(trimmed))
    return "Enter valid 10-digit mobile number";

  return "";
};

// ================= REGISTRATION NUMBER =================
export const validateRegistrationNumber = (value) => {
  if (!value || value.trim() === "")
    return "Registration Number is required";

  const regex = /^[A-Za-z0-9\-\/]+$/;

  if (!regex.test(value.trim()))
    return "Invalid Registration Number format";

  return "";
};

// ================= LICENSE NUMBER =================
export const validateLicenseNumber = (value) => {
  if (!value || value.trim() === "")
    return "License Number is required";

  return "";
};

// ================= TAN =================
export const validateTAN = (tan) => {
  if (!tan || tan.trim() === "")
    return "TAN is required";

  const formatted = tan.trim().toUpperCase();
  const regex = /^[A-Z]{4}[0-9]{5}[A-Z]$/;

  if (!regex.test(formatted))
    return "Invalid TAN format (Example: ABCD12345E)";

  return "";
};

// ================= GSTN =================
export const validateGSTN = (gstn) => {
  if (!gstn || gstn.trim() === "")
    return "GSTN is required";

  const formatted = gstn.trim().toUpperCase();
  const regex =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][A-Z0-9]Z[A-Z0-9]$/;

  if (!regex.test(formatted))
    return "Invalid GSTN format";

  return "";
};

// ================= PASSWORD =================
export const validatePassword = (password) => {
  if (!password || password.trim() === "")
    return "Password is required";

  if (password.length < 8)
    return "Password must be at least 8 characters long";

  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter";

  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter";

  if (!/[0-9]/.test(password))
    return "Password must contain at least one number";

  if (!/[@$!%*?&#]/.test(password))
    return "Password must contain at least one special character";

  return "";
};


export const validateFile = (file, fieldName) => {
  if (!file) return `${fieldName} is required`;

  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png"
  ];

  if (!allowedTypes.includes(file.type)) {
    return "Only PDF, JPG or PNG files are allowed";
  }

  const maxSize = 2 * 1024 * 1024;

  if (file.size > maxSize) {
    return "File size must be less than 2MB";
  }

  return "";
};
export const validateName = (name) => {
  if (!name || name.trim() === "")
    return "Name is required";

  const trimmed = name.trim();

  const regex = /^[A-Za-z ]+$/;

  if (!regex.test(trimmed))
    return "Name can contain only letters";

  if (trimmed.length < 3)
    return "Name must be at least 3 characters";

  return "";
};
