/**
 * Registration Page Handler
 *
 * Manages new user registration including:
 * - Form validation (email format, password requirements, phone number format)
 * - Duplicate email checking
 * - User data submission
 * - Error handling and display
 * - Post-registration redirect
 *
 * Dependencies:
 * - Requires register-form element in HTML
 * - Uses localStorage for user session and return URL
 *
 * @module register
 */

/**
 * Registration Page Handler
 */

const apiUrl = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  if (!form) return;

  const emailInput = document.getElementById('email');
  const errorContainer = document.createElement('div');
  errorContainer.className = 'error-message';
  form.insertBefore(errorContainer, form.firstChild);

  const validateEmail = (email) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return isValid;
  };

  const validatePassword = (password) => /^\d{6}$/.test(password);

  const validatePhone = (phone) => {
    if (!phone) return true; // Optional field
    return /^\+?\d{10,14}$/.test(phone.replace(/[\s-]/g, ''));
  };

  const checkExistingEmail = async (email) => {
    try {
      const response = await fetch(
        `${apiUrl}/users?email=${encodeURIComponent(email)}`
      );
      if (!response.ok) throw new Error('Network error');
      const users = await response.json();
      return users.length > 0;
    } catch (error) {
      console.error('Error checking email:', error);
      throw new Error('Failed to check email availability');
    }
  };

  const registerUser = async (userData) => {
    try {
      const response = await fetch(`${apiUrl}/users`, {
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
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorContainer.textContent = '';

    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value,
      phone: form.phone?.value?.trim() || '',
      address: form.address?.value?.trim() || '',
    };

    try {
      // Validate required fields
      if (!formData.name) throw new Error('Name is required');
      if (!validateEmail(formData.email))
        throw new Error('Please enter a valid email address');
      if (!validatePassword(formData.password))
        throw new Error('Password must be exactly 6 numbers');
      if (!validatePhone(formData.phone))
        throw new Error('Please enter a valid phone number or leave empty');

      // Check if email already exists
      const emailExists = await checkExistingEmail(formData.email);
      if (emailExists) throw new Error('Email already registered');

      // Register user
      const user = await registerUser(formData);

      // Store user data and redirect
      localStorage.setItem('user', JSON.stringify(user));
      const returnUrl =
        localStorage.getItem('lastPage') || '/src/pages/my-page.html';
      localStorage.removeItem('lastPage');
      window.location.href = returnUrl;
    } catch (error) {
      errorContainer.textContent = error.message;
      errorContainer.style.display = 'block';
    }
  });
});
