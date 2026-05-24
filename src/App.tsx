import "./styles/global.css";
import { Navigate, Route, Routes } from "react-router";
import { useEffect, useState } from "react";
import LandingPage from "./view/pages/landingPage.tsx";
import AdminPage from "./view/pages/adminPage.tsx";
import authService from "./services/authService";

function App() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // All the app's initialization functions are called here
  useEffect(() => {
    const initAuth = async () => {
      try {
        await authService.refreshToken();
        setIsAdmin(authService.getUserRole() === "ADMIN");
      } catch (error) {
        console.info("No active session", error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage onLoginSuccess={() => setIsAdmin(true)} />} />
      <Route
        path="/admin"
        element={isAdmin ? <AdminPage /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;
