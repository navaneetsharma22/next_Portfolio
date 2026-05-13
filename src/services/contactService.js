import api from './api';

const contactService = {
  // Public Information Methods
  getInfo: async () => {
    const { data } = await api.get('/contact');
    return data;
  },

  updateInfo: async (contactData) => {
    const { data } = await api.post('/contact', contactData);
    return data;
  },

  sendMessage: async (messageData) => {
    const { data } = await api.post('/messages', messageData);
    return data;
  },

  // Message Management Methods
  getAll: async () => {
    const { data } = await api.get('/admin/messages');
    return data;
  },

  markAsRead: async (id) => {
    const { data } = await api.put(`/admin/messages/${id}/read`);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/admin/messages/${id}`);
    return data;
  },

  reply: async (id, replyText) => {
    const { data } = await api.post(`/admin/messages/${id}/reply`, { replyText });
    return data;
  }
};

export default contactService;
