// src/js/pages/login.js
const apiUrl = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Login page loaded');
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
    console.log('Form submitted');
    errorContainer.textContent = '';

    try {
      console.log('Attempting to fetch user data');
      const response = await fetch(`${apiUrl}/users?email=${form.email.value}`);
      const users = await response.json();
      console.log('Users found:', users);

      if (users.length === 0) {
        throw new Error('User not found');
      }

      const user = users[0];
      if (user.password !== form.password.value) {
        throw new Error('Invalid password');
      }

      console.log('Login successful, storing user data');
      // Store user session
      localStorage.setItem('user', JSON.stringify(user));

      console.log('Redirecting to my-page');
      // Redirect to my-page
      window.location.href = '/src/pages/my-page.html';
    } catch (error) {
      console.error('Login error:', error);
      errorContainer.textContent = error.message;
    }
  });
});
