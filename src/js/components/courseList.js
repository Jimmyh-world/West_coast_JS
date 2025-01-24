// src/js/components/courseList.js

// First, import the getCourses function from our services
import { getCourses } from '../api/courseServices.js';

// Helper function to safely handle image paths
function getImagePath(imagePath) {
  // Check if image path starts with http/https
  if (imagePath?.startsWith('http')) {
    return imagePath;
  }
  // Otherwise, use a relative path from our public directory
  return `../src/images/placeholder.webp`;
}

// Function to create HTML for a single course
function createCourseElement(course) {
  // First, destructure the course object with default values
  const {
    id,
    title = 'Course Title Not Available',
    courseNumber = 'No Course Number',
    durationDays = 0,
    deliveryMethods = {},
    scheduledDates = [],
    image = null,
  } = course;

  // Safely handle date and seats display
  const nextSession = scheduledDates[0] || {};
  const startDate = nextSession.startDate
    ? new Date(nextSession.startDate).toLocaleDateString()
    : 'Date TBD';
  const seats = nextSession.availableSeats ?? 'TBD';

  return `
        <article class="course-card">
            <div class="course-image">
                <img src="${getImagePath(image)}" 
                     alt="${title}"
                     onerror="this.onerror=null; this.src='/images/placeholder.jpg';">
            </div>
            <div class="course-content">
                <h3 class="course-title">${title}</h3>
                <p class="course-number">Course: ${courseNumber}</p>
                <p class="duration">${durationDays} days</p>
                <div class="delivery-methods">
                    ${
                      deliveryMethods.classroom
                        ? '<span class="badge badge-classroom">Classroom</span>'
                        : ''
                    }
                    ${
                      deliveryMethods.distance
                        ? '<span class="badge badge-distance">Distance</span>'
                        : ''
                    }
                </div>
                <div class="course-details">
                    <p>Next Start: ${startDate}</p>
                    <p>Available Seats: ${seats}</p>
                </div>
                <button class="btn btn-primary" onclick="handleCourseClick(${id})">
                    Learn More
                </button>
            </div>
        </article>
    `;
}

// Main function to display courses
export async function displayCourses(containerId = 'course-list') {
  try {
    console.log('Starting displayCourses function...'); // Debug log

    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id '${containerId}' not found`);
    }

    // Show loading state
    container.innerHTML = '<p class="loading">Loading courses...</p>';

    // Fetch courses
    const courses = await getCourses();
    console.log('Fetched courses:', courses); // Debug log

    if (!courses || courses.length === 0) {
      container.innerHTML = '<p class="no-courses">No courses available.</p>';
      return;
    }

    // Clear container and add courses
    container.innerHTML = '';
    courses.forEach((course) => {
      container.insertAdjacentHTML('beforeend', createCourseElement(course));
    });

    console.log('Courses displayed successfully');
  } catch (error) {
    console.error('Error in displayCourses:', error);

    // Find somewhere to display the error
    const container =
      document.getElementById(containerId) ||
      document.querySelector('.featured-courses') ||
      document.body;

    container.innerHTML = `
            <div class="error-message">
                Failed to load courses. Please try again later.
                <br>
                <small>${error.message}</small>
            </div>
        `;
  }
}

// Global handler for course clicks
window.handleCourseClick = (courseId) => {
  console.log('Course clicked:', courseId);
  // Add your course click handling logic here
};
