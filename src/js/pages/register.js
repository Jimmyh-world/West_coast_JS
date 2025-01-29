// src/js/pages/register.js
const apiUrl = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  const emailInput = document.getElementById('email');
  const errorContainer = document.createElement('div');
  errorContainer.className = 'error-message';
  form.insertBefore(errorContainer, form.firstChild);

  emailInput.addEventListener('input', validateEmail);

  function validateEmail() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailPattern.test(emailInput.value);

    if (!isValid) {
      emailInput.setCustomValidity('Please enter a valid email address');
      emailInput.classList.add('invalid');
    } else {
      emailInput.setCustomValidity('');
      emailInput.classList.remove('invalid');
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorContainer.textContent = '';

    if (!emailInput.checkValidity()) {
      errorContainer.textContent = 'Please enter a valid email address';
      return;
    }

    if (!/^\d{6}$/.test(form.password.value)) {
      errorContainer.textContent = 'Password must be exactly 6 numbers';
      return;
    }

    const userData = {
      email: form.email.value.trim(),
      password: form.password.value,
      name: form.name.value.trim(),
    };

    try {
      const checkUser = await fetch(`${apiUrl}/users?email=${userData.email}`);
      const existingUsers = await checkUser.json();

      if (existingUsers.length > 0) {
        throw new Error('Email already registered');
      }

      const response = await fetch(`${apiUrl}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error('Registration failed');

      const user = await response.json();
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
