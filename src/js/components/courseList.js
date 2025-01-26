// src/js/components/courseList.js
import { getCourses } from '../api/courseServices.js';

function createCourseCard(course) {
  return `
    <article class="course-card">
      <div class="course-image">
        ${
          course.image && course.image.trim()
            ? `<img src="/src/images/${course.image}" alt="${course.title}" 
              onerror="this.src='/src/images/placeholder.webp'">`
            : `<img src="/src/images/placeholder.webp" alt="${course.title}">`
        }
      </div>
      <div class="course-content">
        <h3>${course.title}</h3>
        <p class="tagline">${course.tagLine}</p>
        <div class="delivery-methods">
          ${
            course.deliveryMethods.classroom
              ? '<span class="badge badge-classroom">Classroom</span>'
              : ''
          }
          ${
            course.deliveryMethods.distance
              ? '<span class="badge badge-distance">Distance</span>'
              : ''
          }
        </div>
        <p class="duration">${course.durationDays} days</p>
        <a href="/src/pages/course-details.html?id=${course.id}" 
           class="btn btn-primary">Learn More</a>
      </div>
    </article>
  `;
}

export async function displayCourses(containerId, options = {}) {
  const { limit, filter } = options;

  try {
    const container = document.getElementById(containerId);
    if (!container) throw new Error(`Container ${containerId} not found`);

    container.innerHTML = '<p>Loading courses...</p>';
    const courses = await getCourses();
    let filteredCourses = courses;

    if (filter === 'classroom') {
      filteredCourses = courses.filter(
        (course) => course.deliveryMethods.classroom
      );
    } else if (filter === 'distance') {
      filteredCourses = courses.filter(
        (course) => course.deliveryMethods.distance
      );
    }

    if (limit) {
      filteredCourses = filteredCourses.slice(0, limit);
    }

    container.innerHTML = filteredCourses.map(createCourseCard).join('');
  } catch (error) {
    console.error('Error displaying courses:', error);
    if (container) {
      container.innerHTML =
        '<div class="error-message">Failed to load courses</div>';
    }
  }
}

export { createCourseCard };
