import api from './api';

const heroService = {
  getHeroData: async () => {
    const { data } = await api.get('/hero');
    return data;
  },
  
  updateHeroData: async (heroData) => {
    // If FormData (file upload), use multipart; otherwise JSON
    const isFormData = heroData instanceof FormData;
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const { data } = await api.post('/admin/hero', heroData, config);
    return data;
  }
};

export default heroService;
