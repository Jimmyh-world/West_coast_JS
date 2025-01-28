import { getCourses } from '../api/courseServices.js';
import { courseUtils } from '../utilities/courseUtils.js';

function createCourseCard(course) {
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
                    ${courseUtils.createDeliveryMethodBadges(
                      course.deliveryMethods
                    )}
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
  const container = document.getElementById(containerId);

  if (!container) {
    throw new Error(`Container ${containerId} not found`);
  }

  try {
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
    courseUtils.handleError(error, containerId);
  }
}

export { createCourseCard };
