// src/js/pages/login.js
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
      localStorage.setItem('user', JSON.stringify(user));

      // Get the stored return URL or default to my-page
      const returnUrl =
        localStorage.getItem('lastPage') || '/src/pages/my-page.html';
      console.log('Redirecting to:', returnUrl);
      localStorage.removeItem('lastPage'); // Clear stored URL
      window.location.href = returnUrl;
    } catch (error) {
      console.error('Login error:', error);
      errorContainer.textContent = error.message;
    }
  });
});
