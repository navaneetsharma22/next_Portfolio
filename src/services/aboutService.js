import api from './api';

const aboutService = {
  getAboutData: async () => {
    const { data } = await api.get('/about');
    return data;
  },
  
  updateAboutData: async (aboutData) => {
    const { data } = await api.post('/admin/about', aboutData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  }
};

export default aboutService;
