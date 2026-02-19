import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  BarChart3,
  BookOpen,
  CheckCircle,
  Clock
} from "lucide-react";
import "../styles/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard">

      {/* ================= MAIN CONTENT ================= */}
      <div className="dashboard-container">

        {/* ================= HEADER ================= */}
        <div className="dashboard-header">
          <h1>AUA / KUA Onboarding Dashboard</h1>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>

        {/* ================= OVERVIEW ================= */}
        <div className="section-title">Application Overview</div>

        <div className="stats-row">

          <div className="stat-card">
            <CheckCircle size={22} />
            <div>
              <h3>Application Status</h3>
              <p className="status-pending">Not Submitted</p>
            </div>
          </div>

          <div className="stat-card">
            <Clock size={22} />
            <div>
              <h3>Last Activity</h3>
              <p>Today</p>
            </div>
          </div>

        </div>

        {/* ================= ACTIONS ================= */}
        <div className="section-title">Application Actions</div>

        <div className="dashboard-grid">

          <div className="dashboard-card">
            <FileText size={28} />
            <h3>Start Application</h3>
            <p>
              Complete and submit your onboarding application form.
            </p>
            <button onClick={() => navigate("/application")}>
              Fill Application
            </button>
          </div>

          <div className="dashboard-card">
            <BarChart3 size={28} />
            <h3>Track Application Status</h3>
            <p>
              Monitor review progress and approval updates.
            </p>
            <button disabled>
              Coming Soon
            </button>
          </div>

          <div className="dashboard-card">
            <BookOpen size={28} />
            <h3>Onboarding Guidelines</h3>
            <p>
              Review onboarding procedures and compliance requirements.
            </p>
            <button>
              View Guidelines
            </button>
          </div>

        </div>

      </div>

      {/* ================= FOOTER ================= */}
      <div className="dashboard-footer">
        © {new Date().getFullYear()} AUA / KUA Authentication Onboarding Portal
      </div>

    </div>
  );
};

export default Dashboard;
