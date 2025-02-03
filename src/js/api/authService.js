/**
 * Authentication Service
 *
 * Manages user authentication and session handling:
 * - User login and registration
 * - Session management
 * - Token generation and storage
 * - User data persistence
 *
 * Dependencies:
 * - Requires JSON server running on localhost:3000
 * - Uses localStorage for session persistence
 * - Expects users endpoint with email/password auth
 *
 * @module authService
 */

const BASE_URL = 'http://localhost:3000';

class AuthService {
  constructor() {
    this.tokenKey = 'auth_token';
    this.userKey = 'user_data';
  }

  async login(email, password) {
    try {
      const users = await this._fetchUserByEmail(email);
      if (!users.length) throw new Error('User not found');

      const user = users[0];
      if (user.password !== password) throw new Error('Invalid password');

      this._setSession(this._generateToken(), user);
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const existingUsers = await this._fetchUserByEmail(userData.email);
      if (existingUsers.length) throw new Error('Email already registered');

      const newUser = await this._createUser(userData);
      this._setSession(this._generateToken(), newUser);
      return newUser;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    window.location.href = '/index.html';
  }

  isAuthenticated() {
    return Boolean(this.getToken());
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser() {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  // Private methods
  async _fetchUserByEmail(email) {
    const response = await fetch(`${BASE_URL}/users?email=${email}`);
    return response.json();
  }

  async _createUser(userData) {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...userData,
        registeredDate: new Date().toISOString(),
      }),
    });
    return response.json();
  }

  _setSession(token, user) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  _generateToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

export const authService = new AuthService();
