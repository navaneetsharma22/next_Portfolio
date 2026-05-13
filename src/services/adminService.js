import api from './api';

const adminService = {
  getDashboardStats: async () => {
    const { data } = await api.get('/admin/dashboard');
    return data;
  },
  
  // Add other admin-wide services here if needed
};

export default adminService;
