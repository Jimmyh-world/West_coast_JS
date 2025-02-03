/**
 * Login Page Handler
 *
 * Manages user authentication flow including:
 * - Form submission and validation
 * - User credential verification
 * - Error display
 * - Redirect handling after successful login
 *
 * Dependencies:
 * - Requires login-form element in HTML
 * - Uses localStorage for user session and return URL
 *
 * @module login
 */

const apiUrl = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');

  if (!form) {
    console.error('Login form not found');
    return;
  }

  const errorContainer = document.createElement('div');
  errorContainer.className = 'error-message';
  form.insertBefore(errorContainer, form.firstChild);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorContainer.textContent = '';

    try {
      const response = await fetch(`${apiUrl}/users?email=${form.email.value}`);
      const users = await response.json();

      if (users.length === 0) throw new Error('User not found');

      const user = users[0];
      if (user.password !== form.password.value)
        throw new Error('Invalid password');

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
