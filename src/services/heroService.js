import api from './api';

const heroService = {
  getHeroData: async () => {
    const { data } = await api.get('/hero');
    return data;
  },
  
  updateHeroData: async (heroData) => {
    const { data } = await api.post('/admin/hero', heroData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  }
};

export default heroService;
