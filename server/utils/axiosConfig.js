const axios = require('axios');

// Create custom axios instance
const customAxios = axios.create();

// Request interceptor
customAxios.interceptors.request.use(
  (config) => {
    console.log('\n=== Request Info ===');
    console.log('Method:', config.method.toUpperCase());
    console.log('URL:', config.url);
    console.log('Headers:', config.headers);
    console.log('Data:', config.data);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
customAxios.interceptors.response.use(
  (response) => {
    console.log('\n=== Response Info ===');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response.data.error || error);
    return Promise.reject(error);
  }
);

module.exports = customAxios; 