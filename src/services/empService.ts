import api from './api';

const empService = {
  async getAll(page: number = 1, limit: number = 10, search: string = '', sort: string = '') {
    const response = await api.get(`/employees?page=${page}&limit=${limit}&search=${search}&sort=${sort}`);
    return response.data;
  },
  async getById(id: number) {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },
  async create(data: any) {
    const response = await api.post('/employees', data);
    return response.data;
  },
  async update(id: number, data: any) {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },
  async delete(id: number) {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  }
};

export default empService;
