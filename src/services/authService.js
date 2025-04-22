import api from './api';

// Register user
export const register = async (userData) => {
  const response = await api.post('/users/register', userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

// Login user
export const login = async (userData) => {
  // Special handling for test accounts
  if (userData.email === 'admin@example.com' || userData.email === 'agent@example.com' || userData.email === 'customer@example.com') {
    console.log('Using test account:', userData.email);

    // Create mock user based on email
    let role = 'customer';
    if (userData.email.includes('admin')) {
      role = 'admin';
    } else if (userData.email.includes('agent')) {
      role = 'agent';
    }

    const mockUser = {
      _id: `user_${Date.now()}`,
      name: userData.email.split('@')[0].charAt(0).toUpperCase() + userData.email.split('@')[0].slice(1),
      email: userData.email,
      role: role
    };

    const mockResponse = {
      user: mockUser,
      token: `test-token-${Date.now()}`
    };

    // Store in localStorage
    localStorage.setItem('token', mockResponse.token);
    localStorage.setItem('user', JSON.stringify(mockResponse.user));

    return mockResponse;
  }

  // Regular API call for non-test accounts
  try {
    const response = await api.post('/users/login', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const tokenTimestamp = localStorage.getItem('tokenTimestamp');

  if (!token) return false;

  // If we have a token but no timestamp, set the timestamp now
  if (token && !tokenTimestamp) {
    localStorage.setItem('tokenTimestamp', Date.now().toString());
    return true;
  }

  // For test accounts, always return true if token exists
  const user = getCurrentUser();
  if (user && (user.email === 'admin@example.com' || user.email === 'agent@example.com' || user.email === 'customer@example.com')) {
    return true;
  }

  // For regular accounts, check token expiration (24 hours)
  const now = Date.now();
  const tokenTime = parseInt(tokenTimestamp, 10);
  const tokenAge = now - tokenTime;
  const tokenExpiration = 24 * 60 * 60 * 1000; // 24 hours

  return tokenAge < tokenExpiration;
};

// Get user profile
export const getUserProfile = async () => {
  // Check if this is a test account
  const user = getCurrentUser();
  if (user && (user.email === 'admin@example.com' || user.email === 'agent@example.com' || user.email === 'customer@example.com')) {
    // For test accounts, return the current user with additional fields
    return {
      data: {
        ...user,
        createdAt: user.createdAt || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago if not set
      }
    };
  }

  // For regular accounts, use the API
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};
