import api from './axios';

export const couponApi = {
  validate: (data) => api.post('/coupons/validate', data),
  getCoupons: () => api.get('/coupons'),
  createCoupon: (data) => api.post('/coupons', data),
  updateCoupon: (id, data) => api.put(`/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/coupons/${id}`)
};

export const adminApi = {
  getStats: () => api.get('/admin/stats')
};
