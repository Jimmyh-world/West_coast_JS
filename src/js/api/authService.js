// src/js/api/authService.js

const BASE_URL = 'http://localhost:3000';

class AuthService {
  constructor() {
    this.tokenKey = 'auth_token';
    this.userKey = 'user_data';
  }

  async login(email, password) {
    try {
      const response = await fetch(`${BASE_URL}/users?email=${email}`);
      const users = await response.json();

      if (users.length === 0) {
        throw new Error('User not found');
      }

      const user = users[0];
      if (user.password !== password) {
        throw new Error('Invalid password');
      }

      const token = this._generateToken();
      this._setSession(token, user);
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      // Check if user already exists
      const existingUsers = await fetch(
        `${BASE_URL}/users?email=${userData.email}`
      );
      const users = await existingUsers.json();

      if (users.length > 0) {
        throw new Error('Email already registered');
      }

      const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userData,
          registeredDate: new Date().toISOString(),
        }),
      });

      const newUser = await response.json();
      const token = this._generateToken();
      this._setSession(token, newUser);
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
    return !!this.getToken();
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser() {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
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
