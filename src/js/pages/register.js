// src/js/pages/register.js
const apiUrl = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  const errorContainer = document.createElement('div');
  errorContainer.className = 'error-message';
  form.insertBefore(errorContainer, form.firstChild);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorContainer.textContent = '';

    // Simple password validation
    if (!/^\d{6}$/.test(form.password.value)) {
      errorContainer.textContent = 'Password must be exactly 6 numbers';
      return;
    }

    const userData = {
      email: form.email.value,
      password: form.password.value,
      name: form.name.value,
    };

    try {
      // Check if user exists
      const checkUser = await fetch(`${apiUrl}/users?email=${userData.email}`);
      const existingUsers = await checkUser.json();

      if (existingUsers.length > 0) {
        throw new Error('Email already registered');
      }

      // Register new user
      const response = await fetch(`${apiUrl}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error('Registration failed');

      // Store user session
      const user = await response.json();
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to my-page instead of home
      window.location.href = '/src/pages/my-page.html';
    } catch (error) {
      errorContainer.textContent = error.message;
    }
  });
});
