import axios from 'axios';
import { User } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await axios.get(`${API_URL}/api/users`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await axios.get(`${API_URL}/api/users/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  update: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await axios.patch(`${API_URL}/api/users/${id}`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/api/users/${id}`, {
      headers: getAuthHeader(),
    });
  },

  toggleActive: async (id: string): Promise<User> => {
    const response = await axios.patch(
      `${API_URL}/api/users/${id}/toggle-active`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  makeAdmin: async (id: string): Promise<User> => {
    const response = await axios.patch(
      `${API_URL}/api/users/${id}/make-admin`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  },
};
