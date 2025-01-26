// src/js/pages/courseDetails.js
import { getCourseById } from '../api/courseServices.js';

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get('id');
  const container = document.getElementById('courseDetail');

  if (!courseId) {
    container.innerHTML =
      '<div class="error-message">Course ID not found</div>';
    return;
  }

  try {
    const course = await getCourseById(courseId);
    if (!course) throw new Error('Course not found');

    container.innerHTML = `
      <div class="course-detail-container">
        <div class="course-header">
          <div class="course-image">
            ${
              course.image && course.image.trim()
                ? `<img src="/src/images/${course.image}" 
                     alt="${course.title}" 
                     onerror="this.src='/src/images/placeholder.webp'">`
                : `<img src="/src/images/placeholder.webp" 
                     alt="${course.title}">`
            }
          </div>
          <div class="course-header-content">
            <h1>${course.title}</h1>
            <p class="tagline">${course.tagLine}</p>
            <div class="course-meta">
              <span>Course Number: ${course.courseNumber}</span>
              <span>Duration: ${course.durationDays} days</span>
            </div>
          </div>
        </div>
        <div class="course-description">
          <h2>About this course</h2>
          <p>${course.discription}</p>
        </div>
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
        ${
          course.scheduledDates
            ? `
          <div class="course-dates">
            <h2>Upcoming Sessions</h2>
            ${course.scheduledDates
              .map(
                (date) => `
              <div class="session-card">
                <div class="session-info">
                  <span class="date">Starts: ${new Date(
                    date.startDate
                  ).toLocaleDateString()}</span>
                  <span class="format">${date.format}</span>
                  <span class="seats">Available seats: ${
                    date.availableSeats
                  }</span>
                </div>
                <button class="btn btn-primary book-btn">Book Now</button>
              </div>
            `
              )
              .join('')}
          </div>
        `
            : ''
        }
      </div>
    `;
  } catch (error) {
    console.error('Failed to load course:', error);
    container.innerHTML =
      '<div class="error-message">Failed to load course details</div>';
  }
});
