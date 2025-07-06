import { authAPI } from './api';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  // Register new user
  async register(userData) {
    try {
      const response = await authAPI.register(userData);
      const { token, user } = response.data;

      this.setAuth(token, user);
      return { success: true, user };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;

      this.setAuth(token, user);
      return { success: true, user };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  // Logout user
  logout() {
    this.clearAuth();
    window.location.href = '/login';
  }

  // Set authentication data
  setAuth(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Clear authentication data
  clearAuth() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Get auth token
  getToken() {
    return this.token;
  }

  // Update user profile
  async updateProfile(userData) {
    try {
      const response = await authAPI.updateProfile(userData);
      const { user } = response.data;

      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true, user };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  }

  // Validate token on app start
  async validateToken() {
    if (!this.token) return false;

    try {
      const response = await authAPI.getProfile();
      const { user } = response.data;
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch (error) {
      this.clearAuth();
      return false;
    }
  }
}

export default new AuthService();
