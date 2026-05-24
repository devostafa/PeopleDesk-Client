const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export interface RecentHire {
  id: string | number;
  firstName: string;
  lastName: string;
  hireDate: string;
  departmentName: string;
}

export interface DepartmentDistribution {
  departmentName: string;
  count: number;
}

export interface AnalyticsSummary {
  totalEmployeesCount: number;
  recentHires: RecentHire[];
  departmentDistribution: DepartmentDistribution[];
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const token = localStorage.getItem("jwt_token");

  const response = await fetch(`${API_BASE_URL}/analytics/summary`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch analytics summary");
  }

  return response.json();
}
