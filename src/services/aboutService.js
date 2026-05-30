import api from './api';

const aboutService = {
  getAboutData: async () => {
    const { data } = await api.get('/about');
    return data;
  },
  
  updateAboutData: async (aboutData) => {
    // If FormData (file upload), use multipart; otherwise JSON
    const isFormData = aboutData instanceof FormData;
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const { data } = await api.post('/admin/about', aboutData, config);
    return data;
  }
};

export default aboutService;
