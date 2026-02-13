import { useState } from "react";
import "../styles/application.css";
import {
  validateRequired,
  validateGSTN,
  validateTAN,
  validateFile,
} from "../utils/validators";

const ApplicationForm = () => {
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    applicantName: "",
    regNumber: "",
    licenseNumber: "",
    registeredAddress: "",
    correspondenceAddress: "",
    gstn: "",
    tan: "",

    // ✅ UPDATED AUTH FIELDS
    auaAuth: "",
    auaKuaAuth: "",

    aadhaarProvisions: [],
    applicantCategory: "",

    registrationDocument: null,
    licenseDocument: null,
    boardResolutionDocument: null,
    aadhaarNotificationDocument: null,
  });

  const provisionOptions = [
    { value: "section7", label: "Section 7" },
    { value: "section4_pmla", label: "Section 4(4)(b)(i) read with PMLA, 2002" },
    { value: "section4_other", label: "Section 4(4)(b)(i) read with other Central Act" },
    { value: "section4_b_ii", label: "Section 4(4)(b)(ii)" },
    { value: "section4_7", label: "Section 4(7)" },
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleProvisionChange = (value) => {
    const updated = formData.aadhaarProvisions.includes(value)
      ? formData.aadhaarProvisions.filter((item) => item !== value)
      : [...formData.aadhaarProvisions, value];

    setFormData({ ...formData, aadhaarProvisions: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    newErrors.applicantName = validateRequired(
      formData.applicantName,
      "Applicant Name"
    );

    newErrors.regNumber = validateRequired(
      formData.regNumber,
      "Registration Number"
    );

    newErrors.licenseNumber = validateRequired(
      formData.licenseNumber,
      "License Number"
    );

    newErrors.registeredAddress = validateRequired(
      formData.registeredAddress,
      "Registered Address"
    );

    newErrors.correspondenceAddress = validateRequired(
      formData.correspondenceAddress,
      "Correspondence Address"
    );

    newErrors.gstn = validateGSTN(formData.gstn);
    newErrors.tan = validateTAN(formData.tan);

    // ✅ NEW VALIDATION
    if (!formData.auaAuth) {
      newErrors.auaAuth = "Please select Yes or No for AUA";
    }

    if (!formData.auaKuaAuth) {
      newErrors.auaKuaAuth = "Please select Yes or No for AUA & KUA";
    }

    if (formData.aadhaarProvisions.length === 0) {
      newErrors.aadhaarProvisions = "Select at least one provision";
    }

    newErrors.boardResolutionDocument = validateFile(
      formData.boardResolutionDocument,
      "Board Resolution Document"
    );

    Object.keys(newErrors).forEach(
      (key) => !newErrors[key] && delete newErrors[key]
    );

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form Submitted:", formData);
    }
  };

  return (
    <div className="application-wrapper">
      <div className="application-card">
        <h2>AUA / KUA Application Form</h2>
        <h3 className="step-title">Step 1: Applicant Details</h3>

        <form onSubmit={handleSubmit} noValidate>

          {/* SECTION A */}
          <div className="section-box">
            <h4>Entity Information</h4>

            <div className="form-grid">
              <div>
                <label>Applicant Name *</label>
                <input type="text" name="applicantName" onChange={handleChange} />
                {errors.applicantName && (
                  <p className="error-text">{errors.applicantName}</p>
                )}
              </div>

              <div>
                <label>Registration / Incorporation No *</label>
                <input type="text" name="regNumber" onChange={handleChange} />
                {errors.regNumber && (
                  <p className="error-text">{errors.regNumber}</p>
                )}
              </div>

              <div>
                <label>License No *</label>
                <input type="text" name="licenseNumber" onChange={handleChange} />
              </div>

              <div>
                <label>GSTN *</label>
                <input type="text" name="gstn" onChange={handleChange} />
              </div>

              <div>
                <label>Registered Address *</label>
                <input type="text" name="registeredAddress" onChange={handleChange} />
              </div>

              <div>
                <label>Correspondence Address *</label>
                <input type="text" name="correspondenceAddress" onChange={handleChange} />
              </div>

              <div>
                <label>TAN *</label>
                <input type="text" name="tan" onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* SECTION B */}
          <div className="section-box">
            <h4>Authorisation Documents</h4>

            <div className="form-grid">
              <div>
                <label>Registration Certificate</label>
                <input type="file" name="registrationDocument" onChange={handleChange} />
              </div>

              <div>
                <label>License Certificate</label>
                <input type="file" name="licenseDocument" onChange={handleChange} />
              </div>

              <div className="full-width">
                <label>Board Resolution / Authorisation Letter *</label>
                <input type="file" name="boardResolutionDocument" onChange={handleChange} />
                {errors.boardResolutionDocument && (
                  <p className="error-text">{errors.boardResolutionDocument}</p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION C - UPDATED */}
          <div className="section-box">
            <h4>Type of Aadhaar Authentication Facility *</h4>

            {/* AUA */}
            <div className="auth-row">
              <p className="auth-label">
                AUA – Authentication Facility
              </p>

              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="auaAuth"
                    value="yes"
                    onChange={handleChange}
                  />
                  Yes
                </label>

                <label>
                  <input
                    type="radio"
                    name="auaAuth"
                    value="no"
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>

              {errors.auaAuth && (
                <p className="error-text">{errors.auaAuth}</p>
              )}
            </div>

            {/* AUA & KUA */}
            <div className="auth-row">
              <p className="auth-label">
                AUA & KUA – Authentication + e-KYC Facility
              </p>

              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="auaKuaAuth"
                    value="yes"
                    onChange={handleChange}
                  />
                  Yes
                </label>

                <label>
                  <input
                    type="radio"
                    name="auaKuaAuth"
                    value="no"
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>

              {errors.auaKuaAuth && (
                <p className="error-text">{errors.auaKuaAuth}</p>
              )}
            </div>
          </div>

          {/* SECTION D */}
          <div className="section-box">
            <h4>Aadhaar Act Provision for Authentication *</h4>

            {provisionOptions.map((option) => (
              <label key={option.value} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={formData.aadhaarProvisions.includes(option.value)}
                  onChange={() => handleProvisionChange(option.value)}
                />
                {option.label}
              </label>
            ))}

            {errors.aadhaarProvisions && (
              <p className="error-text">{errors.aadhaarProvisions}</p>
            )}

            {formData.aadhaarProvisions.length > 0 && (
              <div className="upload-box">
                <label>Upload Relevant Official Gazette Notification(s)</label>
                <input
                  type="file"
                  name="aadhaarNotificationDocument"
                  multiple
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          <div className="button-center">
            <button type="submit">Next</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
