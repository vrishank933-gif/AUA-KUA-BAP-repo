import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import ApplicationForm from "./pages/ApplicationForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/application" element={<ApplicationForm />} />

      {/* Redirect any unknown route to home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
