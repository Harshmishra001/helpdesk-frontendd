import api from './api';
import { createUser as createMockUser, mockUsers } from './mockData';

// Helper to check if using a test account
const isTestAccount = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user && user.email && (
    user.email === 'admin@example.com' ||
    user.email === 'agent@example.com' ||
    user.email === 'customer@example.com'
  );
};

// Get all users (admin only)
export const getUsers = async () => {
  if (isTestAccount()) {
    // Use mock data for test accounts
    return { data: mockUsers };
  } else {
    // Use real API for regular accounts
    const response = await api.get('/users');
    return response.data;
  }
};

// Get user by ID (admin only)
export const getUserById = async (id) => {
  if (isTestAccount()) {
    // Use mock data for test accounts
    const user = mockUsers.find(user => user._id === id);
    return { data: user };
  } else {
    // Use real API for regular accounts
    const response = await api.get(`/users/${id}`);
    return response.data;
  }
};

// Create new user (admin only)
export const createUser = async (userData) => {
  if (isTestAccount()) {
    // Use mock data for test accounts
    const newUser = createMockUser(userData);
    return { data: newUser };
  } else {
    // Use real API for regular accounts
    const response = await api.post('/users', userData);
    return response.data;
  }
};

// Update user (admin only)
export const updateUser = async (id, userData) => {
  if (isTestAccount()) {
    // Use mock data for test accounts
    const userIndex = mockUsers.findIndex(user => user._id === id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
      return { data: mockUsers[userIndex] };
    }
    throw new Error('User not found');
  } else {
    // Use real API for regular accounts
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  }
};
