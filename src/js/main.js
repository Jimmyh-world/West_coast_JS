// src/js/main.js
import { displayCourses } from './components/courseList.js';
import { SearchManager } from './utilities/search.js';

document.addEventListener('DOMContentLoaded', async () => {
  const currentPath = window.location.pathname;
  const isHomePage =
    currentPath === '/' ||
    currentPath.endsWith('index.html') ||
    currentPath.endsWith('/');

  try {
    if (isHomePage) {
      await displayCourses('course-list', { limit: 3 });
      new SearchManager(
        'courseSearch',
        'courseFilter',
        'searchButton',
        'course-list'
      );
    } else if (currentPath.includes('course-view.html')) {
      const urlParams = new URLSearchParams(window.location.search);
      const view = urlParams.get('view');

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

      new SearchManager(
        'searchInput',
        'deliveryFilter',
        'searchButton',
        'courseGrid'
      );
    }
  } catch (error) {
    console.error('Application initialization failed:', error);
  }
});
