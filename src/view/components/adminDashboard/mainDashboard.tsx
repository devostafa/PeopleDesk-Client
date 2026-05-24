import {
  type AnalyticsSummary,
  getAnalyticsSummary,
} from "../../../services/analyticsService.ts";
import { useEffect, useState } from "react";
import '../../../styles/components/dashboard.css';

export default function MainDashboard() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        setLoading(true);
        setError(null);
        const data = await getAnalyticsSummary();
        setSummary(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (error) return <div className="error-message p-8">Error: {error}</div>;
  if (!summary) return null;

  return (
    <div>
      <h1>Main Dashboard</h1>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h2>Total Employees</h2>
          <p>{summary.totalEmployeesCount}</p>
        </div>
        <div className="analytics-card">
          <h2>Total Departments</h2>
          <p>{summary.departmentDistribution.length}</p>
        </div>
        <div className="analytics-card">
          <h2>Recent Hires</h2>
          <p>{summary.recentHires.length}</p>
        </div>
      </div>
    </div>
  );
}
