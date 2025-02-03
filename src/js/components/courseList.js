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
import { courseUtils } from '../utilities/courseUtils.js';

export function createCourseCard(course, isBooked = false) {
  const imagePath = courseUtils.getImagePath(course);

  return `
    <article class="course-card">
      <div class="course-image">
        <img src="${imagePath}" 
             alt="${course.title}" 
             onerror="this.src='/src/images/placeholder.webp'">
      </div>
      <div class="course-content">
        <h3>${course.title}</h3>
        <p class="tagline">${course.tagLine}</p>
        <div class="delivery-methods">
          ${courseUtils.createDeliveryMethodBadges(course.deliveryMethods)}
        </div>
        <p class="duration">${course.durationDays} days</p>
        ${
          isBooked
            ? `<div class="booking-info">
               <p class="session-date">Session Date: ${courseUtils.formatDate(
                 course.sessionDate
               )}</p>
             </div>`
            : `<a href="/src/pages/course-details.html?id=${course.id}" class="btn btn-primary">Learn More</a>`
        }
      </div>
    </article>
  `;
}

export async function displayCourses(containerId, options = {}) {
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
}

function filterCourses(courses, filter) {
  if (!filter) return courses;

  return courses.filter((course) => {
    switch (filter) {
      case 'classroom':
        return course.deliveryMethods.classroom;
      case 'distance':
        return course.deliveryMethods.distance;
      default:
        return true;
    }
  });
}
