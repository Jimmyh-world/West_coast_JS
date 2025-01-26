// src/js/components/courseDetails.js
export async function loadCourseDetails(courseId) {
  try {
    const response = await fetch(`http://localhost:3000/courses/${courseId}`);
    if (!response.ok) {
      console.error('Response not OK:', response.status);
      throw new Error('Course not found');
    }
    const data = await response.json();
    console.log('Loaded course data:', data); // Debug log
    return data;
  } catch (error) {
    console.error('Error loading course:', error);
    throw error;
  }
}

export function renderCourseDetails(course, container) {
  container.innerHTML = `
    <div class="course-detail-container">
      <div class="course-header">
        <img src="/src/images/${course.image || 'placeholder.webp'}" 
             alt="${course.title}" 
             class="course-detail-image"
             onerror="this.src='/src/images/placeholder.webp'">
        <div class="course-header-content">
          <h1>${course.title}</h1>
          <p class="tagline">${course.tagLine}</p>
          <div class="course-meta">
            <span class="course-number">Course: ${course.courseNumber}</span>
            <span class="duration">${course.durationDays} days</span>
          </div>
        </div>
      </div>
      <div class="course-description">
        <h2>About this course</h2>
        <p>${course.discription}</p>
      </div>
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
              <span class="seats">Available seats: ${date.availableSeats}</span>
            </div>
            <button class="btn btn-primary book-btn" data-session-date="${
              date.startDate
            }">
              Book Now
            </button>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;
}
