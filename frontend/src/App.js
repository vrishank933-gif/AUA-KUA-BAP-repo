import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ApplicationForm from "./pages/ApplicationForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/application" element={<ApplicationForm />} />
    </Routes>
  );
}

export default App;
