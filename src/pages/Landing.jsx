import { useState, useEffect } from "react";
import LoginModal from "../components/LoginModal";
import Register from "../components/Register";
import "../styles/landing.css";

const Landing = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const openLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const openRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  useEffect(() => {
    if (showLogin || showRegister) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showLogin, showRegister]);

  return (
    <div className="landing-container">

      {/* HEADER */}
      <header className="landing-header">
        <div className="header-container">

          <div className="header-left">
            <img
              src="/aadhar_logo.png"
              alt="Aadhar Logo"
              className="aadhar_logo"
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

          <nav className="header-nav">
            <a href="#">Home</a>
            <a href="#">About Us</a>
            <a href="#">Onboarding Process</a>
            <a href="#">Guidelines</a>
            <a href="#">Helpdesk</a>
          </nav>

          {/* 🔥 UPDATED HEADER RIGHT */}
          <div className="header-right">

            <button
              className="register-btn"
              onClick={openRegister}
            >
              Register
            </button>

            <button
              className="login-btn"
              onClick={openLogin}
            >
              Login
            </button>

          </div>

        </div>
      </header>

      {/* HERO */}
      <section className="hero-section">

        <div className="hero-left">
          <img
            src="/auth-illustration1.png"
            alt="AUA KUA Secure Authentication System"
            className="hero-image"
          />
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
            onClick={openLogin}
          >
            Login
          </button>
        </div>

      </section>

      {/* LOGIN MODAL */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          openRegister={openRegister}
        />
      )}

      {/* REGISTER MODAL */}
      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
        />
      )}

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-left">
            © {new Date().getFullYear()} UIDAI
          </div>

          <div className="footer-right">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
