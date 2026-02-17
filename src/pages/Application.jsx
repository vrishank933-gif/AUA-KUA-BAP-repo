import { useState } from "react";
import "../styles/application.css";
import {
    validateRequired,
    validateGSTN,
    validateTAN,
    validateFile,
} from "../utils/validators";

const ApplicationForm = () => {
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        // ===== Step 1 =====
        applicantName: "",
        regNumber: "",
        licenseNumber: "",
        registeredAddress: "",
        correspondenceAddress: "",
        isSameAddress: false,
        gstn: "",
        tan: "",
        auaAuth: "",
        auaKuaAuth: "",
        aadhaarProvisions: [],
        registrationDocument: null,
        licenseDocument: null,
        boardResolutionDocument: null,
        aadhaarNotificationDocument: null,
        regSupportingDocument: null,
        gstnSupportingDocument: null,
        tanSupportingDocument: null,


        // ===== Step 2 – MPOC =====
        mpocName: "",
        mpocDesignation: "",
        mpocEmail: "",
        mpocMobile: "",
        mpocAltPhone: "",
        mpocOtherName: "",
        mpocOtherDesignation: "",
        mpocOtherEmail: "",
        mpocOtherMobile: "",
        mpocOtherAltPhone: "",

        // ===== Step 2 – TPOC =====
        tpocName: "",
        tpocDesignation: "",
        tpocEmail: "",
        tpocMobile: "",
        tpocAltPhone: "",
        tpocOtherName: "",
        tpocOtherDesignation: "",
        tpocOtherEmail: "",
        tpocOtherMobile: "",
        tpocOtherAltPhone: "",

        // ===== Step 2 – DC (Data Centre) =====
        dcName: "",
        dcEmail: "",
        dcPhone: "",
        dcAddress: "",
        dcDistrict: "",
        dcState: "",
        dcPin: "",

        // ===== Step 2 – DR (Data Recovery Centre) =====
        drName: "",
        drEmail: "",
        drPhone: "",
        drAddress: "",
        drDistrict: "",
        drState: "",
        drPin: "",

        // ===== Step 3 =====
        asaNames: [""],
        asaDeclarationAccepted: false,
        asaLetter: null,



        // ===== Step 4 =====
        wholeIndia: false,
        specificStates: false,
        stateNames: "",
        financialTxn: "",
        deviceTypes: [],
        authUsage: [],
        authModes: [],
        connectivity: [],
        connectivityOther: "",
        securityPolicyConfirmed: "",
        securityPolicyDocument: null,
        privacyPolicyConfirmed: "",


        // ===== Step 5 =====
        declarationAccepted: false,
        signName: "",
        signDesignation: "",
        signPlace: "",
        signDate: "",
    });

    const provisionOptions = [
        { value: "section7", label: "Section 7" },
        { value: "section4_pmla", label: "Section 4(4)(b)(i) read with PMLA, 2002" },
        { value: "section4_other", label: "Section 4(4)(b)(i) read with other Central Act" },
        { value: "section4_b_ii", label: "Section 4(4)(b)(ii)" },
        { value: "section4_7", label: "Section 4(7)" },
    ];

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "file") {
            setFormData({
                ...formData,
                [name]: files[0],
            });
        } else if (type === "checkbox") {
            setFormData({
                ...formData,
                [name]: checked,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        if (type === "checkbox") {
            // Multi select arrays
            if (["deviceTypes", "authModes", "authUsage", "connectivity"].includes(name)) {
                const updated = checked
                    ? [...formData[name], value]
                    : formData[name].filter((item) => item !== value);

                setFormData({ ...formData, [name]: updated });
            } else {
                setFormData({ ...formData, [name]: checked });
            }
        }
        else if (type === "file") {
            setFormData({ ...formData, [name]: files[0] });
        }
        else {
            setFormData({ ...formData, [name]: value });
        }
    };
    const handleProvisionChange = (value) => {
        const updated = formData.aadhaarProvisions.includes(value)
            ? formData.aadhaarProvisions.filter((item) => item !== value)
            : [...formData.aadhaarProvisions, value];

        setFormData({ ...formData, aadhaarProvisions: updated });
    }


    const handleRemoveFile = () => {
        setFormData({ ...formData, asaLetter: null });

        // Clear actual input value
        const fileInput = document.getElementById("asaLetterInput");
        if (fileInput) {
            fileInput.value = "";
        }
    };



    const validateStep = () => {
        let newErrors = {};

        if (step === 1) {
            if (!formData.applicantName)
                newErrors.applicantName = "Applicant Name required";

            if (!formData.regNumber)
                newErrors.regNumber = "Registration Number required";

            if (!formData.registeredAddress)
                newErrors.registeredAddress = "Registered Address required";

            if (!formData.correspondenceAddress)
                newErrors.correspondenceAddress = "Correspondence Address required";
        }

        if (step === 2) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const mobileRegex = /^\d{10}$/;
            const pinRegex = /^\d{6}$/;
            const urlRegex = /^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w\-.]*)*\/?$/;

            // ===== MPOC =====
            if (!formData.mpocName)
                newErrors.mpocName = "MPOC Name required";
            if (!formData.mpocDesignation)
                newErrors.mpocDesignation = "Full designation required";
            if (!emailRegex.test(formData.mpocEmail))
                newErrors.mpocEmail = "Valid official email required";
            if (!mobileRegex.test(formData.mpocMobile))
                newErrors.mpocMobile = "Valid 10-digit mobile required";
            if (formData.mpocAltPhone && !mobileRegex.test(formData.mpocAltPhone))
                newErrors.mpocAltPhone = "Invalid alternate phone";

            // ===== TPOC =====
            if (!formData.tpocName)
                newErrors.tpocName = "TPOC Name required";
            if (!formData.tpocDesignation)
                newErrors.tpocDesignation = "Full designation required";
            if (!emailRegex.test(formData.tpocEmail))
                newErrors.tpocEmail = "Valid official email required";
            if (!mobileRegex.test(formData.tpocMobile))
                newErrors.tpocMobile = "Valid 10-digit mobile required";
            if (formData.tpocAltPhone && !mobileRegex.test(formData.tpocAltPhone))
                newErrors.tpocAltPhone = "Invalid alternate phone";

            // ===== DC =====
            if (!formData.dcName)
                newErrors.dcName = "DC contact name required";
            if (!emailRegex.test(formData.dcEmail))
                newErrors.dcEmail = "Valid DC email required";
            if (!mobileRegex.test(formData.dcPhone))
                newErrors.dcPhone = "Valid DC phone required";
            if (!formData.dcAddress)
                newErrors.dcAddress = "DC address required";
            if (!formData.dcDistrict)
                newErrors.dcDistrict = "DC district required";
            if (!formData.dcState)
                newErrors.dcState = "DC state required";
            if (!pinRegex.test(formData.dcPin))
                newErrors.dcPin = "Valid 6-digit PIN required";

            // ===== DR =====
            if (!formData.drName)
                newErrors.drName = "DR contact name required";
            if (!emailRegex.test(formData.drEmail))
                newErrors.drEmail = "Valid DR email required";
            if (!mobileRegex.test(formData.drPhone))
                newErrors.drPhone = "Valid DR phone required";
            if (!formData.drAddress)
                newErrors.drAddress = "DR address required";
            if (!formData.drDistrict)
                newErrors.drDistrict = "DR district required";
            if (!formData.drState)
                newErrors.drState = "DR state required";
            if (!pinRegex.test(formData.drPin))
                newErrors.drPin = "Valid 6-digit PIN required";

            // ===== Grievance =====
            if (!urlRegex.test(formData.grievanceWebsite))
                newErrors.grievanceWebsite = "Valid website URL required";
            if (!emailRegex.test(formData.grievanceEmail))
                newErrors.grievanceEmail = "Valid grievance email required";
            if (!mobileRegex.test(formData.grievanceHelpdesk))
                newErrors.grievanceHelpdesk = "Valid 10-digit helpdesk required";
        }

        if (step === 3) {
            const hasAtLeastOneASA = formData.asaNames.some(
                (name) => name.trim() !== ""
            );

            if (!hasAtLeastOneASA)
                newErrors.asaNames = "At least one ASA name is required";

            if (!formData.asaDeclarationAccepted)
                newErrors.asaDeclarationAccepted = "ASA declaration is required";

            if (!formData.asaLetter)
                newErrors.asaLetter = "ASA letter attachment is required";
        }


        if (step === 4) {
            if (!formData.territory)
                newErrors.territory = "Territory required";
            if (!formData.financialTxn)
                newErrors.financialTxn = "Select Yes/No";
            if (formData.deviceTypes.length === 0)
                newErrors.deviceTypes = "Select at least one device type";
            if (formData.authModes.length === 0)
                newErrors.authModes = "Select at least one auth mode";
            if (!formData.connectivity)
                newErrors.connectivity = "Select connectivity type";
            if (formData.securityPolicyConfirmed !== "yes")
                newErrors.securityPolicyConfirmed = "Confirm Security Policy";
            if (formData.privacyPolicyConfirmed !== "yes")
                newErrors.privacyPolicyConfirmed = "Confirm Privacy Policy";
        }

        if (step === 5) {
            if (!formData.declarationAccepted)
                newErrors.declarationAccepted = "Declaration required";
            if (!formData.signName)
                newErrors.signName = "Signature Name required";
            if (!formData.signDesignation)
                newErrors.signDesignation = "Designation required";
            if (!formData.signPlace)
                newErrors.signPlace = "Place required";
            if (!formData.signDate)
                newErrors.signDate = "Date required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep()) setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateStep()) {
            alert("Application Submitted Successfully!");
            console.log(formData);
        }
    };
    const addAsaField = () => {
        setFormData({
            ...formData,
            asaNames: [...formData.asaNames, ""],
        });
    };
    const removeAsaField = (index) => {
        const updated = formData.asaNames.filter((_, i) => i !== index);

        setFormData({
            ...formData,
            asaNames: updated.length ? updated : [""], // keep at least 1 field
        });
    };


    const handleAsaNameChange = (index, value) => {
        const updated = [...formData.asaNames];
        updated[index] = value;
        setFormData({
            ...formData,
            asaNames: updated,
        });

        setErrors({
            ...errors,
            asaNames: "",
        });
    };



    return (

        <div className="app-wrapper">
            <div className="app-card">

                {/* LEFT PANEL */}
                <div className="left-panel">


                    {/* ===== MAIN NAVIGATION ===== */}
                    <div className="sidebar-nav">
                        <h3 className="sidebar-title">Navigation</h3>

                        <div className="nav-item">Dashboard</div>

                        <div className="nav-item nav-active">
                            Applications
                        </div>
                        <div className="sidebar-progress">

                            {/* <h4 className="progress-title">Application Progress</h4> */}

                            {[1, 2, 3, 4, 5].map((num, index) => {
                                const isCompleted = step > num;
                                const isActive = step === num;

                                return (
                                    <div key={num} className="progress-step-wrapper">

                                        <div
                                            className={`progress-step-item 
          ${isActive ? "active" : ""} 
          ${isCompleted ? "completed" : ""}`}
                                        >
                                            <div className="progress-circle">
                                                {isCompleted ? "✓" : num}
                                            </div>

                                            <span>
                                                {num === 1 && "Basic Details"}
                                                {num === 2 && "Contact Details"}
                                                {num === 3 && "ASA Details"}
                                                {num === 4 && "Authentication"}
                                                {num === 5 && "Declaration"}
                                            </span>
                                        </div>

                                        {index !== 4 && (
                                            <div
                                                className={`progress-line ${step > num ? "completed" : ""}`}
                                            ></div>
                                        )}
                                    </div>
                                );
                            })}

                        </div>


                        <div className="nav-item">Settings</div>
                    </div>

                    {/* ===== PROGRESS SECTION (ONLY SHOW IN APPLICATION) ===== */}


                    {/* <h3>Step {step}</h3>
                            <p>Complete your application process</p>

                            <div className={`step-item ${step === 1 ? "active" : ""}`}>
                                <div className="step-circle">1</div>
                                <span>Basic Details</span>
                            </div>

                            <div className={`step-item ${step === 2 ? "active" : ""}`}>
                                <div className="step-circle">2</div>
                                <span>Contact Details</span>
                            </div>

                            <div className={`step-item ${step === 3 ? "active" : ""}`}>
                                <div className="step-circle">3</div>
                                <span>ASA Details</span>
                            </div>

                            <div className={`step-item ${step === 4 ? "active" : ""}`}>
                                <div className="step-circle">4</div>
                                <span>Authentication</span>
                            </div>

                            <div className={`step-item ${step === 5 ? "active" : ""}`}>
                                <div className="step-circle">5</div>
                                <span>Declaration</span>
                            </div>
                        </div> */}

                </div>

                {/* RIGHT PANEL */}
                <div className="right-panel">

                    {step === 1 && (
                        <>
                            <h2>Create Application</h2>
                            <h3>Step 1: Applicant Details</h3>

                            <div className="section-box">
                                <div className="grid">

                                    <div>
                                        <label>Applicant Name *</label>
                                        <input
                                            name="applicantName"
                                            value={formData.applicantName}
                                            onChange={handleChange}
                                        />
                                        {errors.applicantName && <p className="error">{errors.applicantName}</p>}
                                    </div>

                                    <div>
                                        <label>Registration Number *</label>
                                        <input
                                            name="regNumber"
                                            value={formData.regNumber}
                                            onChange={handleChange}
                                        />
                                        {errors.regNumber && <p className="error">{errors.regNumber}</p>}
                                    </div>

                                    <div>
                                        <label>Registered Address *</label>
                                        <input
                                            name="registeredAddress"
                                            value={formData.registeredAddress}
                                            onChange={handleChange}
                                        />
                                        {errors.registeredAddress && <p className="error">{errors.registeredAddress}</p>}
                                    </div>

                                    <div>
                                        <label>Correspondence Address *</label>
                                        <input
                                            name="correspondenceAddress"
                                            value={formData.correspondenceAddress}
                                            onChange={handleChange}
                                        />
                                        {errors.correspondenceAddress && <p className="error">{errors.correspondenceAddress}</p>}
                                    </div>

                                </div>
                            </div>

                            <div className="step-buttons">
                                <button type="button" onClick={nextStep}>Next</button>
                            </div>
                        </>
                    )}




                    {step === 2 && (

                        <>
                            <h3 >Step 2: Contact Details</h3>
                            <div className="form-card">


                                {/* ===== MPOC ===== */}

                                <h4 className="section-title">Management Point of Contact (MPOC)</h4>
                                <h5>Authorised Person (Board Resolution / Authorisation Letter)</h5>

                                <div className="form-grid">
                                    <div>
                                        <label>MPOC Name <span>*</span></label>
                                        <input name="mpocName" placeholder="Name"
                                            value={formData.mpocName}
                                            onChange={handleChange} />
                                        {errors.mpocName && <p className="error">{errors.mpocName}</p>}
                                    </div>

                                    <div>
                                        <label>MPOC Full designation <span>*</span></label>
                                        <input name="mpocDesignation" placeholder="Full Designation"
                                            value={formData.mpocDesignation}
                                            onChange={handleChange} />
                                        {errors.mpocDesignation && <p className="error">{errors.mpocDesignation}</p>}
                                    </div>

                                    <div>
                                        <label>MPOC official email address<span>*</span></label>
                                        <input name="mpocEmail" placeholder="Official Email Address"
                                            value={formData.mpocEmail}
                                            onChange={handleChange} />
                                        {errors.mpocEmail && <p className="error">{errors.mpocEmail}</p>}
                                    </div>

                                    <div>
                                        <label>MPOC Mobile Number <span>*</span></label>
                                        <input name="mpocMobile" placeholder="Mobile Number"
                                            value={formData.mpocMobile}
                                            onChange={handleChange} />
                                        {errors.mpocMobile && <p className="error">{errors.mpocMobile}</p>}
                                    </div>

                                    <div>
                                        <label>MPOC Alternate Office/Telephone Number<span>*</span></label>
                                        <input name="mpocAltPhone" placeholder="Alternate Office/Telephone Number"
                                            value={formData.mpocAltPhone}
                                            onChange={handleChange} />
                                        {errors.mpocAltPhone && <p className="error">{errors.mpocAltPhone}</p>}
                                    </div>
                                </div>

                                <h5>Other Key Personnel (If Any)</h5>
                                <div className="grid">
                                    <div>
                                        <label>Personnel Name<span>*</span></label>
                                        <input name="mpocOtherName" placeholder="Name" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label>Personnel Full designation<span>*</span></label>
                                        <input name="mpocOtherDesignation" placeholder="Full Designation" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label>Personnel Official Email Address <span>*</span></label>
                                        <input name="mpocOtherEmail" placeholder="Official Email Address" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label>Personnel Mobile Number <span>*</span></label>
                                        <input name="mpocOtherMobile" placeholder="Mobile Number" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label>Personnel Alternate Office/Telephone Number<span>*</span></label>
                                        <input name="mpocOtherAltPhone" placeholder="Alternate Office/Telephone Number" onChange={handleChange} />
                                    </div>
                                </div>
                            </div>

                            {/* ===== TPOC ===== */}
                            <div className="form-card">
                                <h4 className="section-title">Technical Point of Contact (TPOC)</h4>

                                <div className="form-grid">
                                    <div>
                                        <label>TPOC Name<span>*</span></label>
                                        <input name="tpocName" placeholder="Name"
                                            value={formData.tpocName}
                                            onChange={handleChange} />
                                        {errors.tpocName && <p className="error">{errors.tpocName}</p>}
                                    </div>

                                    <div>
                                        <label>TPOC Full Designation<span>*</span></label>
                                        <input name="tpocDesignation" placeholder="Full Designation"
                                            value={formData.tpocDesignation}
                                            onChange={handleChange} />
                                        {errors.tpocDesignation && <p className="error">{errors.tpocDesignation}</p>}
                                    </div>

                                    <div>
                                        <label>TPOC Official Email Address<span>*</span></label>
                                        <input name="tpocEmail" placeholder="Official Email Address"
                                            value={formData.tpocEmail}
                                            onChange={handleChange} />
                                        {errors.tpocEmail && <p className="error">{errors.tpocEmail}</p>}
                                    </div>

                                    <div>
                                        <label>TPOC Mobile Number <span>*</span></label>
                                        <input name="tpocMobile" placeholder="Mobile Number"
                                            value={formData.tpocMobile}
                                            onChange={handleChange} />
                                        {errors.tpocMobile && <p className="error">{errors.tpocMobile}</p>}
                                    </div>

                                    <div>
                                        <label>TPOC Alternate Office Telephone Number<span>*</span></label>
                                        <input name="tpocAltPhone" placeholder="Alternate Office/Telephone Number"
                                            value={formData.tpocAltPhone}
                                            onChange={handleChange} />
                                        {errors.tpocAltPhone && <p className="error">{errors.tpocAltPhone}</p>}
                                    </div>
                                </div>

                                <h5>Other Key Personnel (If Any)</h5>
                                <div className="grid">
                                    <div>
                                        <label>Personnel Name<span>*</span></label>
                                        <input name="tpocOtherName" placeholder="Name" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label>Personnel Full designation<span>*</span></label>
                                        <input name="tpocOtherDesignation" placeholder="Full Designation" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label>Personnel Email Address<span>*</span></label>
                                        <input name="tpocOtherEmail" placeholder="Official Email Address" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label>Personnel Mobile Number <span>*</span></label>
                                        <input name="tpocOtherMobile" placeholder="Mobile Number" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label>Personnel Alternate Office/Telephone Number <span>*</span></label>
                                        <input name="tpocOtherAltPhone" placeholder="Alternate Office/Telephone Number" onChange={handleChange} />
                                    </div>
                                </div>
                            </div>

                            {/* ===== DC ===== */}
                            <div className="form-card">
                                <h4 className="section-title">DC (Data Centre)</h4>
                                <div className="form-grid">
                                    <div>
                                        <label>DC Name <span>*</span></label>
                                        <input name="dcName" placeholder="MPOC/TPOC Name"
                                            value={formData.dcName}
                                            onChange={handleChange} />
                                        {errors.dcName && <p className="error">{errors.dcName}</p>}
                                    </div>

                                    <div>
                                        <label>DC Email<span>*</span></label>
                                        <input name="dcEmail" placeholder="Email Address"
                                            value={formData.dcEmail}
                                            onChange={handleChange} />
                                        {errors.dcEmail && <p className="error">{errors.dcEmail}</p>}
                                    </div>

                                    <div>
                                        <label>DC Phone Number<span>*</span></label>
                                        <input name="dcPhone" placeholder="Telephone/Mobile No."
                                            value={formData.dcPhone}
                                            onChange={handleChange} />
                                        {errors.dcPhone && <p className="error">{errors.dcPhone}</p>}
                                    </div>

                                    <div>
                                        <label>DC Address<span>*</span></label>
                                        <input name="dcAddress" placeholder="Address"
                                            value={formData.dcAddress}
                                            onChange={handleChange} />
                                        {errors.dcAddress && <p className="error">{errors.dcAddress}</p>}
                                    </div>

                                    <div>
                                        <label>DC District<span>*</span></label>
                                        <input name="dcDistrict" placeholder="District"
                                            value={formData.dcDistrict}
                                            onChange={handleChange} />
                                        {errors.dcDistrict && <p className="error">{errors.dcDistrict}</p>}
                                    </div>

                                    <div>
                                        <label>DC State<span>*</span></label>
                                        <input name="dcState" placeholder="State"
                                            value={formData.dcState}
                                            onChange={handleChange} />
                                        {errors.dcState && <p className="error">{errors.dcState}</p>}
                                    </div>

                                    <div>
                                        <label>DC PIN Code<span>*</span></label>
                                        <input name="dcPin" placeholder="PIN Code"
                                            value={formData.dcPin}
                                            onChange={handleChange} />
                                        {errors.dcPin && <p className="error">{errors.dcPin}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* ===== DR ===== */}
                            <div className="form-card">
                                <h4 className="section-title">DR (Data Recovery Centre)</h4>
                                <div className="form-grid">
                                    <div>
                                        <label>DR Name<span>*</span></label>
                                        <input name="drName" placeholder="MPOC/TPOC Name"
                                            value={formData.drName}
                                            onChange={handleChange} />
                                        {errors.drName && <p className="error">{errors.drName}</p>}
                                    </div>

                                    <div>
                                        <label>DR Email<span>*</span></label>
                                        <input name="drEmail" placeholder="Email Address"
                                            value={formData.drEmail}
                                            onChange={handleChange} />
                                        {errors.drEmail && <p className="error">{errors.drEmail}</p>}
                                    </div>

                                    <div>
                                        <label>DR Phone<span>*</span></label>
                                        <input name="drPhone" placeholder="Telephone/Mobile No."
                                            value={formData.drPhone}
                                            onChange={handleChange} />
                                        {errors.drPhone && <p className="error">{errors.drPhone}</p>}
                                    </div>

                                    <div>
                                        <label>DR Address<span>*</span></label>
                                        <input name="drAddress" placeholder="Address"
                                            value={formData.drAddress}
                                            onChange={handleChange} />
                                        {errors.drAddress && <p className="error">{errors.drAddress}</p>}
                                    </div>

                                    <div>
                                        <label>DR District <span>*</span></label>
                                        <input name="drDistrict" placeholder="District"
                                            value={formData.drDistrict}
                                            onChange={handleChange} />
                                        {errors.drDistrict && <p className="error">{errors.drDistrict}</p>}
                                    </div>

                                    <div>
                                        <label>DR State<span>*</span></label>
                                        <input name="drState" placeholder="State"
                                            value={formData.drState}
                                            onChange={handleChange} />
                                        {errors.drState && <p className="error">{errors.drState}</p>}
                                    </div>

                                    <div>
                                        <label>DR Pin<span>*</span></label>
                                        <input name="drPin" placeholder="PIN Code"
                                            value={formData.drPin}
                                            onChange={handleChange} />
                                        {errors.drPin && <p className="error">{errors.drPin}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* ===== Grievance ===== */}
                            <div className="form-card">
                                <h4 className="section-title">Contact Details for Grievance Redressal</h4>
                                <div className="form-grid">
                                    <div>
                                        <label>Website URL <span>*</span></label>
                                        <input name="grievanceWebsite" placeholder=""
                                            value={formData.grievanceWebsite}
                                            onChange={handleChange} />
                                        {errors.grievanceWebsite && <p className="error">{errors.grievanceWebsite}</p>}
                                    </div>

                                    <div>
                                        <label>Email Address<span>*</span></label>
                                        <input name="grievanceEmail" placeholder=""
                                            value={formData.grievanceEmail}
                                            onChange={handleChange} />
                                        {errors.grievanceEmail && <p className="error">{errors.grievanceEmail}</p>}
                                    </div>

                                    <div>
                                        <label>Helpdesk Number<span>*</span></label>
                                        <input name="grievanceHelpdesk" placeholder=""
                                            value={formData.grievanceHelpdesk}
                                            onChange={handleChange} />
                                        {errors.grievanceHelpdesk && <p className="error">{errors.grievanceHelpdesk}</p>}
                                    </div>
                                </div>
                            </div>


                            <div className="step-buttons">
                                <button type="button" onClick={prevStep}>Back</button>
                                <button type="button" onClick={nextStep}>Next</button>
                            </div>
                        </>
                    )}
                    {step === 3 && (
                        <>
                            <div className="form-card">

                                <h2 className="page-title">
                                    Step 3: Details of Authentication Service Agency (ASA)
                                </h2>

                                {/* ================== ASA NAMES ================== */}
                                <div className="section-block">

                                    <h4 className="section-heading">
                                        Name(s) of ASA
                                    </h4>

                                    {formData.asaNames.map((name, index) => (
                                        <div key={index} className="asa-input-wrapper">
                                            <input
                                                className="asa-input"
                                                placeholder={`ASA Name ${index + 1}`}
                                                value={name}
                                                onChange={(e) =>
                                                    handleAsaNameChange(index, e.target.value)
                                                }
                                            />

                                            {index !== 0 && (
                                                <button
                                                    type="button"
                                                    className="asa-clear-btn"
                                                    onClick={() => removeAsaField(index)}
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}


                                    {errors.asaNames && (
                                        <p className="error">{errors.asaNames}</p>
                                    )}

                                    <button
                                        type="button"
                                        className="add-btn"
                                        onClick={addAsaField}
                                    >
                                        + Add ASA
                                    </button>

                                </div>

                                {/* ================== DECLARATION ================== */}

                                <h4 className="section-heading">
                                    Declaration by the ASA(s)
                                </h4>

                                <div className="asa-declaration">
                                    <input
                                        type="checkbox"
                                        name="asaDeclarationAccepted"
                                        checked={formData.asaDeclarationAccepted}
                                        onChange={handleChange}
                                    />

                                    <span>
                                        ASA agrees to provide secure network connectivity and related services for authentication.
                                    </span>
                                </div>




                                {/* ================== FILE UPLOAD ================== */}
                                <div className="section-block">

                                    <h4 className="section-heading">
                                        Upload ASA Letter (Original)
                                    </h4>

                                    {!formData.asaLetter ? (
                                        <input
                                            type="file"
                                            name="asaLetter"
                                            onChange={handleChange}
                                            className="file-input"
                                        />
                                    ) : (
                                        <div className="file-preview">
                                            <span className="file-name">
                                                {formData.asaLetter.name}
                                            </span>

                                            <button
                                                type="button"
                                                className="remove-file-btn"
                                                onClick={handleRemoveFile}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}

                                </div>

                            </div>

                            {/* ================== BUTTONS ================== */}
                            <div className="step-buttons">
                                <button type="button" className="btn-outline" onClick={prevStep}>
                                    Back
                                </button>

                                <button type="button" className="btn-primary" onClick={nextStep}>
                                    Next
                                </button>
                            </div>
                        </>
                    )}



                    {/* 
                    {step === 3 && (
                        <>
                            <div className="form-card">
                                <h3 className="section-title">Step 3: Details of Authentication Service Agency (ASA)</h3>

                                <h4>Name(s) of ASA</h4>

                                {formData.asaNames.map((name, index) => (
                                    <div key={index} className="asa-field">
                                        <input
                                            className="asa-input"
                                            placeholder={`ASA Name ${index + 1}`}
                                            value={name}
                                            onChange={(e) =>
                                                handleAsaNameChange(index, e.target.value)
                                            }
                                        />

                                        {index !== 0 && (
                                            <span
                                                className="asa-remove"
                                                onClick={() => removeAsaField(index)}
                                            >
                                                ×
                                            </span>
                                        )}
                                    </div>
                                ))}

                                {errors.asaNames && (
                                    <p className="error">{errors.asaNames}</p>
                                )}

                                <button
                                    type="button"
                                    onClick={addAsaField}
                                    style={{ marginBottom: "20px" }}
                                >
                                    + Add ASA
                                </button>

                                <h4>Declaration by the ASA(s)</h4>

                                <div className="asa-declaration-wrapper">
                                    <label className="asa-checkbox-row">
                                        <input
                                            type="checkbox"
                                            name="asaDeclarationAccepted"
                                            checked={formData.asaDeclarationAccepted}
                                            onChange={handleChange}
                                        />
                                        <p1>
                                            ASA agrees to provide secure network connectivity and related services for authentication.
                                        </p1>
                                    </label>
                                </div>

                                <h4>Upload ASA Letter (Original)</h4>

                                <div className="asa-upload-wrapper">
                                    {!formData.asaLetter ? (
                                        <input
                                            type="file"
                                            name="asaLetter"
                                            onChange={handleChange}
                                            id="asaLetterInput"
                                        />
                                    ) : (
                                        <div className="asa-file-preview">
                                            <span className="file-name">
                                                {formData.asaLetter.name}
                                            </span>
                                            <button
                                                type="button"
                                                className="remove-file-btn"
                                                onClick={handleRemoveFile}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>


                            <button type="button" onClick={prevStep}>Back</button>
                            <button type="button" onClick={nextStep}>Next</button>
                        </>
                    )} */}

                    {step === 4 && (
                        <>
                            <div className="form-card">
                                <h3 className="section-title">Step 4: Authentication Requirements</h3>

                                {/* (a) Territorial Extent */}
                                <div className="step4-grid">
                                    <div className="step4-card">
                                        <h4>(A) Territorial extent for use of Authentication facility</h4>

                                        <label className="radio-row">
                                            <input
                                                type="radio"
                                                name="territory"
                                                value="india"
                                                checked={formData.territory === "india"}
                                                onChange={handleChange}
                                            />
                                            Whole of India
                                        </label>

                                        <label className="radio-row">
                                            <input
                                                type="radio"
                                                name="territory"
                                                value="states"
                                                checked={formData.territory === "states"}
                                                onChange={handleChange}
                                            />
                                            Name of State(s) and Union Territory(s)
                                        </label>

                                        {formData.territory === "states" && (
                                            <input
                                                type="text"
                                                name="stateNames"
                                                placeholder="Enter State / UT Names"
                                                value={formData.stateNames}
                                                onChange={handleChange}
                                                className="step4-input"
                                            />
                                        )}


                                        {/* (b) Financial Transaction */}

                                        <h4>(B) Whether Authentication will be used for financial transaction</h4>

                                        <label>
                                            <input
                                                type="radio"
                                                name="financialTxn"
                                                value="yes"
                                                checked={formData.financialTxn === "yes"}
                                                onChange={handleChange}
                                            />
                                            Yes
                                        </label>

                                        <label>
                                            <input
                                                type="radio"
                                                name="financialTxn"
                                                value="no"
                                                checked={formData.financialTxn === "no"}
                                                onChange={handleChange}
                                            />
                                            No
                                        </label>


                                        {/* (c) Device Form Factor */}

                                        <h4>(C) Device form factor (select one or more option)</h4>

                                        <label>
                                            <input
                                                type="checkbox"
                                                name="deviceTypes"
                                                value="discrete"
                                                checked={formData.deviceTypes.includes("discrete")}
                                                onChange={handleChange}
                                            />
                                            Discrete Biometric Device
                                        </label>

                                        <label>
                                            <input
                                                type="checkbox"
                                                name="deviceTypes"
                                                value="integrated"
                                                checked={formData.deviceTypes.includes("integrated")}
                                                onChange={handleChange}
                                            />
                                            Integrated Biometric Device
                                        </label>

                                        <label>
                                            <input
                                                type="checkbox"
                                                name="deviceTypes"
                                                value="laptop"
                                                checked={formData.deviceTypes.includes("laptop")}
                                                onChange={handleChange}
                                            />
                                            Laptop/Desktop
                                        </label>

                                        <label>
                                            <input
                                                type="checkbox"
                                                name="deviceTypes"
                                                value="mobile"
                                                checked={formData.deviceTypes.includes("mobile")}
                                                onChange={handleChange}
                                            />
                                            Mobile Phone
                                        </label>


                                        {/* (d) Usage Type */}

                                        <h4>(D) Whether Authentication will be operator-assisted or self-use</h4>

                                        <label>
                                            <input
                                                type="checkbox"
                                                name="authUsage"
                                                value="operator"
                                                checked={formData.authUsage.includes("operator")}
                                                onChange={handleChange}
                                            />
                                            Operator-assisted use
                                        </label>

                                        <label>
                                            <input
                                                type="checkbox"
                                                name="authUsage"
                                                value="self"
                                                checked={formData.authUsage.includes("self")}
                                                onChange={handleChange}
                                            />
                                            Self-use
                                        </label>


                                        {/* (e) Mode of Authentication */}

                                        <h4>(E) Mode of Authentication (select one or more option)</h4>

                                        {["demographic", "otp", "fingerprint", "iris", "face"].map((mode) => (
                                            <label key={mode}>
                                                <input
                                                    type="checkbox"
                                                    name="authModes"
                                                    value={mode}
                                                    checked={formData.authModes.includes(mode)}
                                                    onChange={handleChange}
                                                />
                                                {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                            </label>
                                        ))}


                                        {/* (f) Connectivity */}

                                        <h4>(F) Connectivity supported between AUA/KUA and ASA</h4>

                                        <label>
                                            <input
                                                type="checkbox"
                                                name="connectivity"
                                                value="vpn"
                                                checked={formData.connectivity.includes("vpn")}
                                                onChange={handleChange}
                                            />
                                            VPN
                                        </label>

                                        <label>
                                            <input
                                                type="checkbox"
                                                name="connectivity"
                                                value="leased"
                                                checked={formData.connectivity.includes("leased")}
                                                onChange={handleChange}
                                            />
                                            Leased line
                                        </label>

                                        <label>
                                            <input
                                                type="checkbox"
                                                name="connectivity"
                                                value="other"
                                                checked={formData.connectivity.includes("other")}
                                                onChange={handleChange}
                                            />
                                            Other
                                        </label>

                                        {formData.connectivity.includes("other") && (
                                            <input
                                                type="text"
                                                name="connectivityOther"
                                                placeholder="Please specify"
                                                value={formData.connectivityOther}
                                                onChange={handleChange}
                                            />
                                        )}


                                        {/* (g) Security Policy Confirmation */}

                                        <h4>(G) Confirmation of Information Security Policy</h4>

                                        <label>
                                            <input
                                                type="radio"
                                                name="securityPolicyConfirmed"
                                                value="yes"
                                                checked={formData.securityPolicyConfirmed === "yes"}
                                                onChange={handleChange}
                                            />
                                            Yes
                                        </label>

                                        <label>
                                            <input
                                                type="radio"
                                                name="securityPolicyConfirmed"
                                                value="no"
                                                checked={formData.securityPolicyConfirmed === "no"}
                                                onChange={handleChange}
                                            />
                                            No
                                        </label>
                                        {formData.securityPolicyConfirmed === "yes" && (
                                            <div className="step4-upload">
                                                <input
                                                    type="file"
                                                    name="securityPolicyDocument"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        )}



                                        {/* (h) Privacy Policy Confirmation */}

                                        <h4>(H) Confirmation of Model Privacy Policy</h4>

                                        <label>
                                            <input
                                                type="radio"
                                                name="privacyPolicyConfirmed"
                                                value="yes"
                                                checked={formData.privacyPolicyConfirmed === "yes"}
                                                onChange={handleChange}
                                            />
                                            Yes
                                        </label>

                                        <label>
                                            <input
                                                type="radio"
                                                name="privacyPolicyConfirmed"
                                                value="no"
                                                checked={formData.privacyPolicyConfirmed === "no"}
                                                onChange={handleChange}
                                            />
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className="step-buttons">
                                    <button type="button" onClick={prevStep}>Back</button>
                                    <button type="button" onClick={nextStep}>Next</button>
                                </div>

                            </div>

                        </>
                    )}


                    {/* {step === 5 && (
                            <>
                                <h3>Step 5: Declaration</h3>
                                <label>
                                    <input type="checkbox" name="declarationAccepted" onChange={handleChange} />
                                    I declare all information is correct.
                                </label>
                                <div className="grid">
                                    <input name="signName" placeholder="Name" onChange={handleChange} />
                                    <input name="signDesignation" placeholder="Designation" onChange={handleChange} />
                                    <input name="signPlace" placeholder="Place" onChange={handleChange} />
                                    <input type="date" name="signDate" onChange={handleChange} />
                                </div>
                                <button type="button" onClick={prevStep}>Back</button>
                                <button type="submit">Submit Application</button>
                            </>
                        )} */}


                </div>


            </div>

        </div>

    );
};

export default ApplicationForm;