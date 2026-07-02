import api from './axios';

export const productApi = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (identifier) => api.get(`/products/${identifier}`),
  getFilters: () => api.get('/products/meta/filters'),
  getRelated: (id) => api.get(`/products/${id}/related`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data),
  deleteReview: (id, reviewId) => api.delete(`/products/${id}/reviews/${reviewId}`)
};
