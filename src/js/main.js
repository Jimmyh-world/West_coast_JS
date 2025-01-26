// src/js/main.js
import { displayCourses } from './components/courseList.js';

document.addEventListener('DOMContentLoaded', async () => {
  const currentPage = window.location.pathname;

  try {
    if (currentPage.includes('index.html') || currentPage === '/') {
      // Show only 3 featured courses on home page
      await displayCourses('course-list', { limit: 3 });
    } else if (currentPage.includes('course-view.html')) {
      const urlParams = new URLSearchParams(window.location.search);
      const view = urlParams.get('view');

      // Update page title and description based on view
      const pageTitle = document.getElementById('pageTitle');
      const pageDescription = document.getElementById('pageDescription');

      if (view === 'ondemand') {
        pageTitle.textContent = 'On-Demand Courses';
        pageDescription.textContent = 'Learn at your own pace';
        await displayCourses('courseGrid', { filter: 'distance' });
      } else {
        pageTitle.textContent = 'All Courses';
        pageDescription.textContent = 'Browse our available courses';
        await displayCourses('courseGrid');
      }
    }
  } catch (error) {
    console.error('Application initialization failed:', error);
  }
});
