// src/js/main.js

import { displayCourses } from './components/courseList.js';

console.log('Loading main.js...'); // Debug log

document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM Content Loaded, initializing application...'); // Debug log

  try {
    await displayCourses();
    console.log('Courses displayed successfully');
  } catch (error) {
    console.error('Application initialization failed:', error);
    // Show user-friendly error message
    const container = document.getElementById('course-list');
    if (container) {
      container.innerHTML = `
                <div class="error-message">
                    Sorry, we couldn't load the courses at this time. 
                    Please try refreshing the page.
                </div>
            `;
    }
  }
});
