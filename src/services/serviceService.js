import api from './api';

const serviceService = {
  getAll: async () => {
    const { data } = await api.get('/services');
    return data;
  },

  create: async (serviceData) => {
    const { data } = await api.post('/admin/services', serviceData);
    return data;
  },

  update: async (id, serviceData) => {
    const { data } = await api.put(`/admin/services/${id}`, serviceData);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/admin/services/${id}`);
    return data;
  }
};

export default serviceService;
