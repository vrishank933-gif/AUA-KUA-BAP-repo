import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import ApplicationForm from "./pages/ApplicationForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/application" element={<ApplicationForm />} />
    </Routes>
  );
}

export default App;
