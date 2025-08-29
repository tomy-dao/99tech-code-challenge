import { client } from "./initial";

// Auth API functions
const auth = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await client.post('/auth/login', credentials);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.errors?.[0]?.msg || error.response?.data?.error || 'Login failed');
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await client.post('/auth/register', userData);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.errors?.[0]?.msg || error.response?.data?.error || 'Registration failed');
    }
  },

  // get scores
  getScores: async () => {
    try {
      const response = await client.get('/scores');
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.errors?.[0]?.msg || error.response?.data?.error || 'Failed to get scores');
    }
  },

  // Logout user
  logout: async () => {
    try {
      await client.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear auth data regardless of API response
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },
};

export default auth;
