import React, { useState } from "react";
import { useNavigate } from "react-router";
import authService from "../../services/authService";
import "../../styles/pages/landingPage.css";

interface LandingPageProps {
  onLoginSuccess?: () => void;
}

export default function LandingPage({ onLoginSuccess }: LandingPageProps) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authService.login({ userName, password });
      onLoginSuccess?.();
      navigate("/admin");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form className="login-form" onSubmit={handleLogin}>
        <h1 className={"logo-typo"}>PeopleDesk™️</h1>
        <h3 className="login-form-title">Login</h3>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="userName" className="form-label">Username</label>
          <input
            id="userName"
            className="form-input"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
