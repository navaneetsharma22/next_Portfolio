import api from './api';

const experienceService = {
  getExperiences: async () => {
    const response = await api.get('/experience');
    return response.data;
  },
  
  createExperience: async (formData) => {
    const response = await api.post('/experience', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  updateExperience: async (id, formData) => {
    const response = await api.put(`/experience/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  deleteExperience: async (id) => {
    const response = await api.delete(`/experience/${id}`);
    return response.data;
  }
};

export default experienceService;
