import api from './api';

const skillService = {
  getAll: async () => {
    const { data } = await api.get('/skills');
    return data;
  },

  create: async (skillData) => {
    const { data } = await api.post('/admin/skills', skillData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  update: async (id, skillData) => {
    const { data } = await api.put(`/admin/skills/${id}`, skillData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/admin/skills/${id}`);
    return data;
  }
};

export default skillService;
