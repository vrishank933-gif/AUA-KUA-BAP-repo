import { useState } from "react";
import Login from "./pages/login";
import Register from "./pages/Register";
import ApplicationForm from "./pages/Application";
 
function App() {
  const [page, setPage] = useState("login");
 
  return (
    <>
      {page === "login" && <Login />}
      {page === "register" && <Register />}
      {page === "application" && <ApplicationForm />}
 
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        {page === "login" && (
          <button onClick={() => setPage("register")}>
            Go to Register
          </button>
        )}
 
        {page === "register" && (
          <button onClick={() => setPage("login")}>
            Go to Login
          </button>
        )}
 
        {page === "login" && (
          <button onClick={() => setPage("application")}>
            Go to Application Form
          </button>
        )}
      </div>
    </>
  );
}
 
export default App;