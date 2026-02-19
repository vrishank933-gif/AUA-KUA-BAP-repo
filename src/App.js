import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import ApplicationForm from "./pages/Application";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Application Form */}
      <Route path="/application" element={<ApplicationForm />} />

      {/* Redirect unknown route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
