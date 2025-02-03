/**
 * Registration Page Handler
 *
 * Manages user registration process:
 * - Form validation
 * - Email uniqueness check
 * - User data submission
 * - Session management
 * - Navigation handling
 *
 * Dependencies:
 * - register-form element in HTML
 * - localStorage for session
 * - JSON server API
 *
 * @module register
 */

const API_URL = 'http://localhost:3000';

class RegistrationManager {
  constructor() {
    this.form = document.getElementById('register-form');
    if (!this.form) return;

    this.setupErrorContainer();
    this.initializeFormHandler();
  }

  setupErrorContainer() {
    this.errorContainer = document.createElement('div');
    this.errorContainer.className = 'error-message';
    this.form.insertBefore(this.errorContainer, this.form.firstChild);
  }

  initializeFormHandler() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  validatePassword(password) {
    return /^\d{6}$/.test(password);
  }

  validatePhone(phone) {
    if (!phone) return true;
    return /^\+?\d{10,14}$/.test(phone.replace(/[\s-]/g, ''));
  }

  async checkExistingEmail(email) {
    try {
      const response = await fetch(
        `${API_URL}/users?email=${encodeURIComponent(email)}`
      );
      if (!response.ok) throw new Error('Network error');
      const users = await response.json();
      return users.length > 0;
    } catch (error) {
      console.error('Error checking email:', error);
      throw new Error('Failed to check email availability');
    }
  }

  async registerUser(userData) {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      return response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  getFormData() {
    return {
      name: this.form.name.value.trim(),
      email: this.form.email.value.trim(),
      password: this.form.password.value,
      phone: this.form.phone?.value?.trim() || '',
      address: this.form.address?.value?.trim() || '',
    };
  }

  validateFormData(formData) {
    if (!formData.name) throw new Error('Name is required');
    if (!this.validateEmail(formData.email))
      throw new Error('Please enter a valid email address');
    if (!this.validatePassword(formData.password))
      throw new Error('Password must be exactly 6 numbers');
    if (!this.validatePhone(formData.phone))
      throw new Error('Please enter a valid phone number or leave empty');
  }

  handleError(error) {
    this.errorContainer.textContent = error.message;
    this.errorContainer.style.display = 'block';
  }

  async handleRegistrationSuccess(user) {
    localStorage.setItem('user', JSON.stringify(user));
    const returnUrl =
      localStorage.getItem('lastPage') || '/src/pages/my-page.html';
    localStorage.removeItem('lastPage');
    window.location.href = returnUrl;
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.errorContainer.textContent = '';

    try {
      const formData = this.getFormData();
      this.validateFormData(formData);

      const emailExists = await this.checkExistingEmail(formData.email);
      if (emailExists) throw new Error('Email already registered');

      const user = await this.registerUser(formData);
      await this.handleRegistrationSuccess(user);
    } catch (error) {
      this.handleError(error);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new RegistrationManager());
