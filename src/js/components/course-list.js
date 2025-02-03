/**
 * Course List Component
 * Manages the display and filtering of course listings.
 * Handles course card rendering, search functionality, and filter interactions.
 */

import { getCourses } from '../api/courseServices.js';
import { courseUtils } from '../utilities/courseUtils.js';
import { eventHandler } from '../utilities/eventHandler.js';

class CourseListManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.courses = [];
    this.filters = {
      search: '',
      deliveryMethod: 'all',
    };
    this.init();
  }

  async init() {
    try {
      this.courses = await getCourses();
      this.setupEventListeners();
      this.renderCourses();
    } catch (error) {
      courseUtils.handleError(error, this.container.id);
    }
  }

  setupEventListeners() {
    const searchInput = document.getElementById('courseSearch');
    const filterSelect = document.getElementById('deliveryFilter');

    if (searchInput) {
      eventHandler.on(searchInput, 'input', () => {
        this.filters.search = searchInput.value.toLowerCase();
        this.renderCourses();
      });
    }

    if (filterSelect) {
      eventHandler.on(filterSelect, 'change', () => {
        this.filters.deliveryMethod = filterSelect.value;
        this.renderCourses();
      });
    }
  }

  filterCourses() {
    return this.courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(this.filters.search) ||
        course.discription.toLowerCase().includes(this.filters.search);

      const matchesDelivery =
        this.filters.deliveryMethod === 'all' ||
        course.deliveryMethods.includes(this.filters.deliveryMethod);

      return matchesSearch && matchesDelivery;
    });
  }

  renderCourses() {
    const filteredCourses = this.filterCourses();

    if (!filteredCourses.length) {
      this.container.innerHTML = this.generateNoCourseMessage();
      return;
    }

    this.container.innerHTML = `
      <div class="course-grid">
        ${filteredCourses
          .map((course) => this.generateCourseCard(course))
          .join('')}
      </div>
    `;
  }

  generateCourseCard(course) {
    const imagePath = courseUtils.getImagePath(course);
    const nextSession = courseUtils.getNextAvailableSession(
      course.scheduledDates
    );

    return `
      <div class="course-card">
        <img src="${imagePath}" 
             alt="${course.title}" 
             class="course-image"
             onerror="this.src='/src/images/placeholder.webp'">
        <div class="course-content">
          <h3>${course.title}</h3>
          <p class="course-description">${this.truncateDescription(
            course.discription
          )}</p>
          ${this.generateCourseMetadata(course, nextSession)}
          <div class="delivery-methods">
            ${courseUtils.createDeliveryMethodBadges(course.deliveryMethods)}
          </div>
          <a href="/src/pages/course-details.html?id=${course.id}" 
             class="btn btn-primary">View Details</a>
        </div>
      </div>
    `;
  }

  generateCourseMetadata(course, nextSession) {
    return `
      <div class="course-meta">
        <span class="course-number">Course: ${course.courseNumber}</span>
        <span class="duration">${course.durationDays} days</span>
        ${
          nextSession
            ? `<span class="next-session">Next: ${courseUtils.formatDate(
                nextSession
              )}</span>`
            : ''
        }
      </div>
    `;
  }

  generateNoCourseMessage() {
    return `
      <div class="no-courses-message">
        <p>No courses found matching your criteria.</p>
        <p>Try adjusting your search or filters.</p>
      </div>
    `;
  }

  truncateDescription(description, maxLength = 150) {
    return description.length > maxLength
      ? `${description.substring(0, maxLength)}...`
      : description;
  }
}

export function initCourseList(containerId) {
  return new CourseListManager(containerId);
}
