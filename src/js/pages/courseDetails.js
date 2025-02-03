/**
 * Course Details Page
 *
 * Entry point for the course details page that initializes the course details component.
 * Ensures the DOM is fully loaded before component initialization.
 *
 * Dependencies:
 * - course-details.js component for rendering course information
 *
 * @module courseDetails
 */

import { initCourseDetails } from '../components/course-details.js';

document.addEventListener('DOMContentLoaded', () => {
  initCourseDetails('courseDetail');
});
