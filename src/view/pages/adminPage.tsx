import { useState } from "react";
import EmpDashboard from "../components/adminDashboard/empDashboard";
import DeptDashboard from "../components/adminDashboard/deptDashboard";
import MainDashboard from "../components/adminDashboard/mainDashboard.tsx";
import "../../styles/pages/adminPage.css";

export default function AdminPage() {
  const [dashboardTab, setDashboardTab] = useState(0); // 0 for Main, 1 for Employees, 2 for Departments

  return (
    <div className="admin-layout">
      <nav className="admin-nav">
        <h1>PeopleDesk™️</h1>
        <ul>
          <li
            className={dashboardTab === 0 ? "active" : ""}
            onClick={() => setDashboardTab(0)}
          >
            Main
          </li>
          <p className="nav-category-title">Manage</p>
          <li
            className={dashboardTab === 1 ? "active" : ""}
            onClick={() => setDashboardTab(1)}
          >
            Employees
          </li>
          <li
            className={dashboardTab === 2 ? "active" : ""}
            onClick={() => setDashboardTab(2)}
          >
            Departments
          </li>
        </ul>
      </nav>

      <section className="admin-content">
        {dashboardTab === 0 && <MainDashboard />}
        {dashboardTab === 1 && <EmpDashboard />}
        {dashboardTab === 2 && <DeptDashboard />}
      </section>
    </div>
  );
}
