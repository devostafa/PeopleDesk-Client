import api from "./api";

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
  const response = await api.get("/analytics/summary");
  return response.data;
}
