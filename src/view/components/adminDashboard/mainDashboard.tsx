import {
  type AnalyticsSummary,
  getAnalyticsSummary,
} from "../../../services/analyticsService.ts";
import { useEffect, useState } from "react";
import "../../../styles/components/mainDashboard.css";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

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
    <div className="dashboard-container">
      <h1 className="dashboard-title">Main Dashboard</h1>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h2 className="analytics-card-title">Total Employees</h2>
          <p className="analytics-card-value">{summary.totalEmployeesCount}</p>
        </div>
        <div className="analytics-card">
          <h2 className="analytics-card-title">Total Departments</h2>
          <p className="analytics-card-value">
            {summary.departmentDistribution.length}
          </p>
        </div>
        <div className="analytics-card">
          <h2 className="analytics-card-title">Recent Hires Count</h2>
          <p className="analytics-card-value">{summary.recentHires.length}</p>
        </div>
      </div>

      <div className="dashboard-details-grid">
        <div className="details-card">
          <h2 className="details-card-title">Department Distribution</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={summary.departmentDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="departmentName"
                >
                  {summary.departmentDistribution.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="details-card">
          <h2 className="details-card-title">Recent Hires</h2>
          <div className="recent-hires-list">
            {summary.recentHires.length === 0 ? (
              <p>No recent hires</p>
            ) : (
              <table className="mini-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.recentHires.map((hire) => (
                    <tr key={hire.id}>
                      <td>
                        {hire.firstName} {hire.lastName}
                      </td>
                      <td>{hire.departmentName}</td>
                      <td>{new Date(hire.hireDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
