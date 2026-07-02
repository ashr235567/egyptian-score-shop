import api from './axios';

export const orderApi = {
  createOrder: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  trackOrder: (orderNumber, phone) => api.get(`/orders/track/${orderNumber}`, { params: { phone } }),
  getAllOrders: (params) => api.get('/orders', { params }),
  updateOrderStatus: (id, data) => api.put(`/orders/${id}/status`, data)
};
