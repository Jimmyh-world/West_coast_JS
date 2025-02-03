/**
 * Registration Page Handler
 *
 * Manages new user registration including:
 * - Form validation (email format, password requirements)
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

const apiUrl = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  if (!form) return;

  const emailInput = document.getElementById('email');
  const errorContainer = document.createElement('div');
  errorContainer.className = 'error-message';
  form.insertBefore(errorContainer, form.firstChild);

  const validateEmail = () => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
    emailInput.setCustomValidity(
      isValid ? '' : 'Please enter a valid email address'
    );
    emailInput.classList.toggle('invalid', !isValid);
  };

  const validatePassword = (password) => /^\d{6}$/.test(password);

  const registerUser = async (userData) => {
    const checkUser = await fetch(`${apiUrl}/users?email=${userData.email}`);
    const existingUsers = await checkUser.json();

    if (existingUsers.length > 0) throw new Error('Email already registered');

    const response = await fetch(`${apiUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  };

  emailInput.addEventListener('input', validateEmail);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorContainer.textContent = '';

    if (!emailInput.checkValidity()) {
      errorContainer.textContent = 'Please enter a valid email address';
      return;
    }

    if (!validatePassword(form.password.value)) {
      errorContainer.textContent = 'Password must be exactly 6 numbers';
      return;
    }

    const userData = {
      email: form.email.value.trim(),
      password: form.password.value,
      name: form.name.value.trim(),
    };

    try {
      const user = await registerUser(userData);
      localStorage.setItem('user', JSON.stringify(user));

      const returnUrl =
        localStorage.getItem('lastPage') || '/src/pages/my-page.html';
      localStorage.removeItem('lastPage');
      window.location.href = returnUrl;
    } catch (error) {
      errorContainer.textContent = error.message;
    }
  });
});
