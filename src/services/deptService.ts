import api from './api';

const deptService = {
  async getAll(page: number = 1, limit: number = 10, search: string = '', sort: string = '') {
    const response = await api.get(`/departments?page=${page}&limit=${limit}&search=${search}&sort=${sort}`);
    return response.data;
  },
  async getById(id: number) {
    const response = await api.get(`/departments/${id}`);
    return response.data;
  },
  async create(data: any) {
    const response = await api.post('/departments', data);
    return response.data;
  },
  async update(id: number, data: any) {
    const response = await api.put(`/departments/${id}`, data);
    return response.data;
  },
  async delete(id: number) {
    const response = await api.delete(`/departments/${id}`);
    return response.data;
  }
};

export default deptService;
