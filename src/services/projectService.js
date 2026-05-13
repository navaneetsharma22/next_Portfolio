import api from './api';

const projectService = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/projects', { params });
    return data;
  },

  getByIdOrSlug: async (idOrSlug) => {
    const { data } = await api.get(`/projects/${idOrSlug}`);
    return data;
  },

  // Admin restricted methods
  create: async (projectData) => {
    const { data } = await api.post('/admin/projects', projectData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  update: async (id, projectData) => {
    const { data } = await api.put(`/admin/projects/${id}`, projectData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/admin/projects/${id}`);
    return data;
  }
};

export default projectService;
