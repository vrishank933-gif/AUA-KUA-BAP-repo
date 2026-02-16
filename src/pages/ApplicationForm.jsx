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
    regSupportingDocument: null,
    gstnSupportingDocument: null,
    tanSupportingDocument: null,
    stateGovernmentName: "",
section4ActName: "",
pmlaEntityType: "",
pmlaSectionReference: "",
meityLetterNumber: "",
meityLetterDate: "",
authenticationAuthority: "",
authenticationReference: "",

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
    // Applicant Category Validation
if (!formData.applicantCategory) {
  newErrors.applicantCategory = "Please select applicant category";
}


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
{/* SECTION A */}
<div className="section-box">
  <h4>Entity Information</h4>

  <div className="form-grid">

    {/* Applicant Name */}
    <div>
      <label>Applicant Name *</label>
      <input
        type="text"
        name="applicantName"
        onChange={handleChange}
      />
    </div>

    {/* Registration */}
    <div>
      <label>Registration / Incorporation No *</label>
      <input
        type="text"
        name="regNumber"
        onChange={handleChange}
      />

      <div className="inline-upload">
        <label>Attach PDF (if applicable)</label>
        <input
          type="file"
          name="regSupportingDocument"
          accept=".pdf"
          onChange={handleChange}
        />
      </div>
    </div>

    {/* License */}
    <div>
      <label>License No *</label>
      <input
        type="text"
        name="licenseNumber"
        onChange={handleChange}
      />

      <div className="inline-upload">
        <label>Attach PDF (if applicable)</label>
        <input
          type="file"
          name="licenseDocument"
          accept=".pdf"
          onChange={handleChange}
        />
      </div>
    </div>

    {/* GSTN */}
    <div>
      <label>GSTN *</label>
      <input
        type="text"
        name="gstn"
        onChange={handleChange}
      />

      <div className="inline-upload">
        <label>Attach PDF (if applicable)</label>
        <input
          type="file"
          name="gstnSupportingDocument"
          accept=".pdf"
          onChange={handleChange}
        />
      </div>
    </div>

    {/* Registered Address */}
    <div>
      <label>Registered Address *</label>
      <input
        type="text"
        name="registeredAddress"
        onChange={handleChange}
      />
    </div>

    {/* Correspondence Address */}
    <div>
      <label>Correspondence Address *</label>
      <input
        type="text"
        name="correspondenceAddress"
        onChange={handleChange}
      />
    </div>

    {/* TAN */}
    <div>
      <label>TAN *</label>
      <input
        type="text"
        name="tan"
        onChange={handleChange}
      />

      <div className="inline-upload">
        <label>Attach PDF (if applicable)</label>
        <input
          type="file"
          name="tanSupportingDocument"
          accept=".pdf"
          onChange={handleChange}
        />
      </div>
    </div>

    {/* Mandatory Board Resolution */}
    <div>
      <label>Board Resolution / Authorisation Letter *</label>
      <input
        type="file"
        name="boardResolutionDocument"
        accept=".pdf"
        onChange={handleChange}
      />
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
          
          {/* SECTION E */}
{/* SECTION E */}
<div className="section-box">
  <h4>Category of the Applicant *</h4>

  <div className="category-block">

    {/* 1 Central Government */}
    <div className="category-option">
      <label>
        <input
          type="radio"
          name="applicantCategory"
          value="central_gov"
          onChange={handleChange}
        />
        A Ministry, Department, secretariat, office, or agency of the Central Government,
        which has required, in terms of the provisions of section 7 of the Act,
        that an individual undergo authentication for receipt of a subsidy,
        benefit or service for which the expenditure is incurred from,
        or the receipt therefrom forms part of the Consolidated Fund of India.
      </label>
    </div>

    {/* 2 State Government */}
    <div className="category-option">
      <label>
        <input
          type="radio"
          name="applicantCategory"
          value="state_gov"
          onChange={handleChange}
        />
        A Ministry, Department, secretariat, office or agency of the Government of{" "}
        <input
          type="text"
          name="stateGovernmentName"
          className="inline-blank"
          onChange={handleChange}
        />{" "}
        which requires, in terms of the provisions of section 7 of Act,
        that an individual undergo authentication for receipt of a subsidy,
        benefit or service for which the expenditure is incurred from,
        or the receipt therefrom forms part of the Consolidated Fund of State.
      </label>
    </div>

    {/* 3 Section 4(4)(b)(i) */}
    {/* Section 4(4)(b)(i) */}
<div className="category-option">
  <label>
    <input
      type="radio"
      name="applicantCategory"
      value="section4_i"
      onChange={handleChange}
    />
    An entity permitted under sub-clause (i) of clause (b) of sub-section (4)
    of section 4 of the Act to offer authentication services under of 
    <input
      type="text"
      name="section4ActName"
      className="inline-blank blank-medium"
      onChange={handleChange}
    />.
  </label>
</div>


    {/* 4 PMLA */}
    <div className="category-option">
      <label>
        <input
          type="radio"
          name="applicantCategory"
          value="pmla_entity"
          onChange={handleChange}
        />
        An entity permitted under sub-clause (i) of clause (b) of sub-section (4)
        of section 4 of the Act to offer authentication services under section 11A
        of the Prevention of Money-laundering Act, 2002, by virtue of being a reporting
        entity under the said Act as a{" "}
        <input
          type="text"
          name="pmlaEntityType"
          className="inline-blank"
          onChange={handleChange}
        />{" "}
        in terms of{" "}
        <input
          type="text"
          name="pmlaSectionReference"
          className="inline-blank"
          onChange={handleChange}
        />{" "}
        of sub-section (1) of section 2 of the said Act.
      </label>
    </div>

    {/* 5 MeitY */}
    <div className="category-option">
      <label>
        <input
          type="radio"
          name="applicantCategory"
          value="meity_authorised"
          onChange={handleChange}
        />
        An entity that has been allowed/authorised under sub-clause (ii)
        of clause (b) of sub-section (4) of section 4 of the Act,
        vide Ministry of Electronics and Information Technology’s letter no.{" "}
        <input
          type="text"
          name="meityLetterNumber"
          className="inline-blank"
          onChange={handleChange}
        />{" "}
        dated{" "}
        <input
          type="date"
          name="meityLetterDate"
          className="inline-blank small-date"
          onChange={handleChange}
        />.
      </label>
    </div>

    {/* 6 Section 4(7) */}
    <div className="category-option">
      <label>
        <input
          type="radio"
          name="applicantCategory"
          value="section4_7"
          onChange={handleChange}
        />
        An entity that is required, in terms of the provisions of sub-section (7)
        of section 4 of the Act, to perform mandatory authentication by{" "}
        <input
          type="text"
          name="authenticationAuthority"
          className="inline-blank"
          onChange={handleChange}
        />{" "}
        of{" "}
        <input
          type="text"
          name="authenticationReference"
          className="inline-blank"
          onChange={handleChange}
        />.
      </label>
    </div>

  </div>

  {errors.applicantCategory && (
    <p className="error-text">{errors.applicantCategory}</p>
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
