// src/js/components/course-details.js
import {
  getCourseById,
  createBooking,
  updateCourseSeats,
  checkExistingBooking,
} from '../api/courseServices.js';
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
      await this.renderCourseWithBookingStatus(course);
    } catch (error) {
      courseUtils.handleError(error, this.container.id);
    }
  }

  async renderCourseWithBookingStatus(course) {
    const userData = localStorage.getItem('user');
    let hasExistingBooking = false;

    if (userData) {
      const user = JSON.parse(userData);
      hasExistingBooking = await checkExistingBooking(user.id, this.courseId);
    }

    this.renderCourse(course, hasExistingBooking);
    this.setupBookingButtons();
  }

  setupBookingButtons() {
    const bookButtons = this.container.querySelectorAll('.book-btn');
    bookButtons.forEach((button) => {
      eventHandler.on(button, 'click', async (e) => {
        e.preventDefault();
        await this.handleBooking(e);
      });
    });
  }

  async handleBooking(event) {
    const userData = localStorage.getItem('user');
    if (!userData) {
      localStorage.setItem(
        'lastPage',
        window.location.pathname + window.location.search
      );
      window.location.href = '/src/pages/login.html';
      return;
    }

    const user = JSON.parse(userData);
    const sessionDate = event.target.dataset.sessionDate;

    try {
      const bookingData = {
        userId: user.id,
        courseId: this.courseId,
        sessionDate: sessionDate,
        bookingDate: new Date().toISOString(),
        status: 'confirmed',
      };

      await createBooking(bookingData);

      const course = await getCourseById(this.courseId);
      const sessionIndex = course.scheduledDates.findIndex(
        (date) => date.startDate === sessionDate
      );

      if (sessionIndex !== -1) {
        course.scheduledDates[sessionIndex].availableSeats--;
        await updateCourseSeats(this.courseId, course);
      }

      alert('Course booked successfully!');
      window.location.href = '/src/pages/my-page.html';
    } catch (error) {
      alert(error.message || 'Failed to book the course. Please try again.');
    }
  }

  renderCourse(course, hasExistingBooking) {
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
              <span class="course-number">Course: ${course.courseNumber}</span>
              <span class="duration">${course.durationDays} days</span>
            </div>
            <div class="delivery-methods">
              ${courseUtils.createDeliveryMethodBadges(course.deliveryMethods)}
            </div>
          </div>
        </div>
        <div class="course-description">
          <h2>About this course</h2>
          <p>${course.discription}</p>
        </div>
        ${this.renderScheduledDates(course.scheduledDates, hasExistingBooking)}
      </div>
    `;
  }

  renderScheduledDates(dates, hasExistingBooking) {
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
              <span class="seats">Available seats: ${date.availableSeats}</span>
            </div>
            ${this.renderBookingButton(date, hasExistingBooking)}
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  renderBookingButton(date, hasExistingBooking) {
    const isLoggedIn = localStorage.getItem('user') !== null;

    if (hasExistingBooking) {
      return `<button class="btn btn-secondary" disabled>Already Booked</button>`;
    }

    if (date.availableSeats <= 0) {
      return `<button class="btn btn-secondary" disabled>Fully Booked</button>`;
    }

    if (!isLoggedIn) {
      return `<button class="btn btn-primary book-btn">Sign in to Book</button>`;
    }

    return `
      <button class="btn btn-primary book-btn" data-session-date="${date.startDate}">
        Book Now
      </button>
    `;
  }
}

export function initCourseDetails(containerId) {
  return new CourseDetailsManager(containerId);
}
