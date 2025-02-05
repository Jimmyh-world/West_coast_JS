/**
 * Course Details Component
 *
 * Manages individual course display and interaction:
 * - Course information rendering
 * - Booking management
 * - Session availability
 * - User authentication checks
 *
 * Dependencies:
 * - courseServices for data operations
 * - courseUtils for formatting
 * - eventHandler for DOM events
 * - Requires user session in localStorage
 *
 * @module courseDetails
 */

import {
  getCourseById,
  createBooking,
  updateCourseSeats,
  checkExistingBooking,
} from '../api/courseServices.js';
import { courseUtils } from '../utils/courseUtils.js';
import { eventHandler } from '../utils/eventHandler.js';

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
      // Check if the course is in userBookedCourses
      const isBooked = window.userBookedCourses?.includes(
        this.courseId.toString()
      );
      await this.renderCourseWithBookingStatus(course, isBooked);
    } catch (error) {
      courseUtils.handleError(error, this.container.id);
    }
  }

  async renderCourseWithBookingStatus(course, isBooked) {
    const userData = localStorage.getItem('user');
    const userId = userData ? JSON.parse(userData).id : null;

    console.log('User ID:', userId);
    console.log('Course ID:', this.courseId);
    console.log('User Booked Courses:', window.userBookedCourses);

    const hasExistingBooking = userId
      ? await checkExistingBooking(userId, this.courseId)
      : false;

    console.log('Has Existing Booking:', hasExistingBooking);

    this.currentCourse = course;
    this.renderCourse(course, hasExistingBooking);
    this.setupBookingButtons();
  }

  setupBookingButtons() {
    const bookButtons = this.container.querySelectorAll('.book-btn');
    bookButtons.forEach((button) =>
      eventHandler.on(button, 'click', (e) => this.handleBooking(e))
    );
  }

  async handleBooking(event) {
    event.preventDefault();
    const userData = localStorage.getItem('user');

    if (!userData) {
      localStorage.setItem(
        'lastPage',
        window.location.pathname + window.location.search
      );
      window.location.href = '/src/pages/login.html';
      return;
    }

    try {
      const user = JSON.parse(userData);
      const sessionDate = event.target.dataset.sessionDate;
      const formatSelect = event.target
        .closest('.session-card')
        .querySelector('.format-select');

      if (formatSelect && !formatSelect.value) {
        alert('Please select a course format before booking.');
        return;
      }

      const selectedFormat = formatSelect
        ? formatSelect.value
        : this.currentCourse.scheduledDates.find(
            (d) => d.startDate === sessionDate
          ).format;

      const bookingData = {
        userId: user.id,
        courseId: this.courseId,
        sessionDate,
        bookingDate: new Date().toISOString(),
        status: 'confirmed',
        format: selectedFormat,
      };

      const result = await createBooking(bookingData);
      if (result) {
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
      }
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to book the course: ' + error.message);
    }
  }

  renderCourse(course, hasExistingBooking) {
    const imagePath = courseUtils.getImagePath(course);
    this.container.innerHTML = this.generateCourseHTML(
      course,
      imagePath,
      hasExistingBooking
    );
  }

  generateCourseHTML(course, imagePath, hasExistingBooking) {
    return `
      <div class="course-detail-container">
        ${this.generateCourseHeader(course, imagePath)}
        <div class="course-description">
          <h2>About this course</h2>
          <p>${course.discription}</p>
        </div>
        ${this.renderScheduledDates(course.scheduledDates, hasExistingBooking)}
      </div>
    `;
  }

  generateCourseHeader(course, imagePath) {
    return `
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
    `;
  }

  renderScheduledDates(dates, hasExistingBooking) {
    if (!dates?.length) return '';

    return `
      <div class="course-dates">
        <h2>Upcoming Sessions</h2>
        ${dates
          .map((date) => this.generateSessionCard(date, hasExistingBooking))
          .join('')}
      </div>
    `;
  }

  generateSessionCard(date, hasExistingBooking) {
    const deliveryOptions = this.getDeliveryOptions(date);
    const isLoggedIn = localStorage.getItem('user') !== null;

    return `
      <div class="session-card">
        <div class="session-info">
          <span class="date">Starts: ${courseUtils.formatDate(
            date.startDate
          )}</span>
          ${
            deliveryOptions.length > 1
              ? `<div class="format-selection">
                <label for="format-${date.startDate}" class="format-label">
                  <span class="required-asterisk">*</span> Select your preferred format:
                </label>
                <select 
                  id="format-${date.startDate}"
                  class="format-select" 
                  data-date="${date.startDate}"
                  required
                >
                  <option value="" disabled selected>Choose format...</option>
                  ${deliveryOptions
                    .map(
                      (format) =>
                        `<option value="${format}">${
                          format.charAt(0).toUpperCase() + format.slice(1)
                        }</option>`
                    )
                    .join('')}
                </select>
              </div>`
              : `<span class="format">Format: ${
                  date.format.charAt(0).toUpperCase() + date.format.slice(1)
                }</span>`
          }
          <span class="seats">Available seats: ${date.availableSeats}</span>
        </div>
        ${this.renderBookingButton(date, hasExistingBooking)}
      </div>
    `;
  }

  getDeliveryOptions(date) {
    const course = this.currentCourse;
    const options = [];

    if (course && course.deliveryMethods) {
      if (course.deliveryMethods.classroom) options.push('classroom');
      if (course.deliveryMethods.distance) options.push('distance');
    } else {
      options.push('classroom', 'distance');
    }

    return options;
  }

  renderBookingButton(date, hasExistingBooking) {
    const isLoggedIn = localStorage.getItem('user') !== null;

    if (hasExistingBooking)
      return `<button class="btn btn-secondary" disabled>Already Booked</button>`;
    if (date.availableSeats <= 0)
      return `<button class="btn btn-secondary" disabled>Fully Booked</button>`;
    if (!isLoggedIn)
      return `<button class="btn btn-primary book-btn">Sign in to Book</button>`;

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
