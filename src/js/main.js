/**
 * Application Entry Point
 *
 * Manages the initialization and routing of the application:
 * - Navigation setup
 * - Page-specific content loading
 * - Search functionality initialization
 * - Course display management
 *
 * Dependencies:
 * - courseList for course display
 * - search for course filtering
 * - navigation for site structure
 *
 * @module main
 */

import { displayCourses } from './components/courseList.js';
import { SearchManager } from './utilities/search.js';
import { initNavigation } from './components/navigation.js';

// Ensure navigation is initialized immediately
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Always initialize navigation first
    const navigation = initNavigation();
    navigation.init();

    const currentPath = window.location.pathname;
    const isHomePage =
      currentPath === '/' ||
      currentPath.endsWith('index.html') ||
      currentPath.endsWith('/');

    if (isHomePage) {
      await displayCourses('course-list', { limit: 3 });
      new SearchManager(
        'courseSearch',
        'courseFilter',
        'searchButton',
        'course-list'
      );
    } else if (currentPath.includes('course-view.html')) {
      const view = new URLSearchParams(window.location.search).get('view');

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
