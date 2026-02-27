import axios from 'axios';

const API_BASE_URL = '/api';

// Submissions API
export const submissionAPI = {
  evaluate: async (code, language, interviewMode = false) => {
    const response = await axios.post(`${API_BASE_URL}/submissions/evaluate`, {
      code,
      language,
      interviewMode
    });
    return response.data;
  },

  getAll: async (page = 1, limit = 10) => {
    const response = await axios.get(`${API_BASE_URL}/submissions`, {
      params: { page, limit }
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/submissions/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await axios.get(`${API_BASE_URL}/submissions/stats/overview`);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/submissions/${id}`);
    return response.data;
  }
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    });
    return response.data;
  },

  register: async (name, email, password) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      name,
      email,
      password
    });
    return response.data;
  },

  getMe: async () => {
    const response = await axios.get(`${API_BASE_URL}/auth/me`);
    return response.data;
  }
};

export default {
  submission: submissionAPI,
  auth: authAPI
};
