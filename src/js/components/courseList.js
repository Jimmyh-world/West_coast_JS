/**
 * Course List Component
 *
 * Manages course listing display and filtering:
 * - Course card generation
 * - Delivery method filtering
 * - List pagination
 * - Error handling
 *
 * Dependencies:
 * - courseServices for data fetching
 * - courseUtils for formatting
 * - Requires container element in DOM
 *
 * @module courseList
 */

import { getCourses } from '../api/courseServices.js';
import { courseUtils } from '../utils/courseUtils.js';

export function createCourseCard(course, isBookingView = false) {
  const imagePath = courseUtils.getImagePath(course);
  const deliveryMethods = course.deliveryMethods || {};

  return `
    <article class="course-card">
      <img src="${imagePath}" 
           alt="${course.title}" 
           class="course-image"
           onerror="this.src='/src/images/placeholder.webp'">
      <div class="course-content">
        <h3>${course.title}</h3>
        <p class="tagline">${course.tagLine || ''}</p>
        <div class="delivery-methods">
          ${courseUtils.createDeliveryMethodBadges(deliveryMethods)}
        </div>
        <div class="course-meta">
          <span class="duration">${course.durationDays || 'N/A'} days</span>
        </div>
        ${
          !isBookingView
            ? `
          <div class="card-actions">
            <a href="/src/pages/course-details.html?id=${course.id}" class="btn btn-primary">View Details</a>
          </div>
        `
            : ''
        }
      </div>
    </article>
  `;
}

export const displayCourses = async (containerId, options = {}) => {
  const container = document.getElementById(containerId);
  if (!container) throw new Error(`Container ${containerId} not found`);

  try {
    container.innerHTML = '<p>Loading courses...</p>';
    const courses = await getCourses();

    let filteredCourses = filterCourses(courses, options.filter);
    if (options.limit) {
      filteredCourses = filteredCourses.slice(0, options.limit);
    }

    container.innerHTML = filteredCourses
      .map((course) => createCourseCard(course))
      .join('');
  } catch (error) {
    courseUtils.handleError(error, containerId);
  }
};

function filterCourses(courses, filter) {
  if (!filter) return courses;

  return courses.filter((course) => {
    const deliveryMethods = course.deliveryMethods || {};

    switch (filter) {
      case 'classroom':
        return deliveryMethods.classroom || false;
      case 'distance':
        return deliveryMethods.distance || false;
      default:
        return true;
    }
  });
}
