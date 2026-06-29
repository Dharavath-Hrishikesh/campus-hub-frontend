import axios from 'axios';

// We tell Axios to look for a cloud URL first. If it can't find one, it falls back to your local server.
const api = axios.create({
  // Force it back to your local port 5000
  baseURL: 'http://localhost:5000/api', 
});
// Attach the JWT (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;