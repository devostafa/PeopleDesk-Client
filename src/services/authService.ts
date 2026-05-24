import api from "./api";
import { getAccessToken, setAccessToken } from "./tokenStorage";
import { UserRole } from "../data/enums/userRole";

const authService = {
  async login(dto: { userName: string; password: string }) {
    const response = await api.post("/auth/login", dto);
    if (response.data.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    return response.data;
  },
  async logout() {
    await api.post("/auth/logout");
    setAccessToken(null);
  },
  isLoggedIn() {
    return !!getAccessToken();
  },
  getUserRole(): UserRole | null {
    const token = getAccessToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (Object.values(UserRole).includes(payload.role)) {
        return payload.role;
      }
      return null;
    } catch {
      return null;
    }
  },
  async refreshToken() {
    try {
      const response = await api.post("/auth/refresh");
      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
      }
      return response.data;
    } catch (error) {
      setAccessToken(null);
      throw error;
    }
  },
};

export default authService;
