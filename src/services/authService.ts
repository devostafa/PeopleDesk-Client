import api from './api';
import { setAccessToken, getAccessToken } from './tokenStorage';

const authService = {
  async login(dto: { userName: string; password: string }) {
    const response = await api.post('/auth/login', dto);
    if (response.data.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    return response.data;
  },
  async logout() {
    await api.post('/auth/logout');
    setAccessToken(null);
  },
  isLoggedIn() {
    return !!getAccessToken();
  },
  getUserRole() {
    const token = getAccessToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch (e) {
      return null;
    }
  },
  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh');
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
