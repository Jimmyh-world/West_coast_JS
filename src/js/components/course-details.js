// src/js/components/course-details.js
import { getCourseById } from '../api/courseServices.js';
import { courseUtils } from '../utilities/courseUtils.js';
import { eventHandler } from '../utilities/eventHandler.js';

class CourseDetailsManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.courseId = new URLSearchParams(window.location.search).get('id');
    this.init();
  }

  async init() {
    if (!this.courseId) {
      courseUtils.handleError(
        new Error('Course ID not found'),
        this.container.id
      );
      return;
    }

    try {
      const course = await getCourseById(this.courseId);
      this.renderCourse(course);
      this.setupEventListeners();
    } catch (error) {
      courseUtils.handleError(error, this.container.id);
    }
  }

  setupEventListeners() {
    const bookButtons = this.container.querySelectorAll('.book-btn');
    bookButtons.forEach((button) => {
      eventHandler.on(button, 'click', (e) => this.handleBooking(e));
    });
  }

  handleBooking(event) {
    const sessionDate = event.target.dataset.sessionDate;
    // Booking logic here - can be expanded later
    console.log(`Booking requested for session: ${sessionDate}`);
  }

  renderCourse(course) {
    const imagePath = courseUtils.getImagePath(course);

    this.container.innerHTML = `
            <div class="course-detail-container">
                <div class="course-header">
                    <img src="${imagePath}" 
                         alt="${course.title}" 
                         class="course-detail-image"
                         onerror="this.src='/src/images/placeholder.webp'">
                    <div class="course-header-content">
                        <h1>${course.title}</h1>
                        <p class="tagline">${course.tagLine}</p>
                        <div class="course-meta">
                            <span class="course-number">Course: ${
                              course.courseNumber
                            }</span>
                            <span class="duration">${
                              course.durationDays
                            } days</span>
                        </div>
                        <div class="delivery-methods">
                            ${courseUtils.createDeliveryMethodBadges(
                              course.deliveryMethods
                            )}
                        </div>
                    </div>
                </div>
                <div class="course-description">
                    <h2>About this course</h2>
                    <p>${course.discription}</p>
                </div>
                ${this.renderScheduledDates(course.scheduledDates)}
            </div>
        `;
  }

  renderScheduledDates(dates) {
    if (!dates?.length) return '';

    return `
            <div class="course-dates">
                <h2>Upcoming Sessions</h2>
                ${dates
                  .map(
                    (date) => `
                    <div class="session-card">
                        <div class="session-info">
                            <span class="date">Starts: ${courseUtils.formatDate(
                              date.startDate
                            )}</span>
                            <span class="format">${date.format}</span>
                            <span class="seats">Available seats: ${
                              date.availableSeats
                            }</span>
                        </div>
                        <button class="btn btn-primary book-btn" 
                                data-session-date="${date.startDate}">
                            Book Now
                        </button>
                    </div>
                `
                  )
                  .join('')}
            </div>
        `;
  }

  destroy() {
    eventHandler.removeAll();
  }
}

export function initCourseDetails(containerId) {
  return new CourseDetailsManager(containerId);
}
