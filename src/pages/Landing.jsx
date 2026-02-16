
import { useState } from "react";
import LoginModal from "../components/LoginModal";
import "../styles/landing.css";

const Landing = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="landing-container">

      <header className="landing-header">

  <div className="header-left">

    <img
      src="/aadhar-logo.jpg"
      alt="Aadhar Logo"
      className="aadhar-logo"
    />

    <div className="logo-text">
      <span className="gov-small">
        Unique Identification Authority of India
      </span>
      <span className="portal-title">
        AUA / KUA Authentication Onboarding Portal
      </span>
    </div>

  </div>

  <button
    className="login-btn"
    onClick={() => setShowLogin(true)}
  >
    Login
  </button>

</header>

{/* Hero Section */}
<section className="hero-section">

  <div className="hero-left">
    <div className="fingerprint-system">

      <img
        src="/auth-illustration.svg"
        alt="Authentication Illustration"
        className="hero-image"
      />

      {/* Radial System Labels */}
      <span className="system-label top">Authentication</span>
      <span className="system-label top-right">Integration</span>
      <span className="system-label bottom-right">Security</span>
      <span className="system-label bottom">Compliance</span>
      <span className="system-label top-left">Onboarding</span>

    </div>
  </div>

  <div className="hero-content">
    <h1>
      AUA / KUA Authentication
      <br />
      Onboarding Portal
    </h1>

    <p>
      Secure onboarding for Authentication User Agencies (AUA)
      and e-KYC User Agencies (KUA) under the Aadhaar Act, 2016.
    </p>

    <button
      className="primary-btn"
      onClick={() => setShowLogin(true)}
    >
      Login
    </button>
  </div>

</section>


      {showLogin && <LoginModal closeModal={() => setShowLogin(false)} />}
    </div>
  );
};

export default Landing;
