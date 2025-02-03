/**
 * My Page Manager
 *
 * Handles user's personal dashboard including:
 * - User profile display
 * - Course booking management
 * - Booking cancellation
 * - Tab navigation between upcoming and past courses
 *
 * Dependencies:
 * - eventHandler for DOM event management
 * - courseList for course card creation
 * - courseServices for booking operations
 *
 * @module myPage
 */

import { eventHandler } from '../utilities/eventHandler.js';
import { createCourseCard } from '../components/courseList.js';
import { cancelBooking } from '../api/courseServices.js';

const API_URL = 'http://localhost:3000';

class MyPageManager {
  constructor() {
    this.initializeElements();
    this.init();
  }

  initializeElements() {
    this.userDetails = document.getElementById('user-details');
    this.coursesContainer = document.getElementById('courses-container');
    this.logoutBtn = document.getElementById('logout-btn');
    this.user = null;
    this.bookings = [];
  }

  async init() {
    this.checkAuthentication();
    await this.loadInitialData();
    this.setupEventListeners();
    this.render();
  }

  async loadInitialData() {
    await Promise.all([this.loadUserData(), this.loadUserBookings()]);
  }

  checkAuthentication() {
    const userData = localStorage.getItem('user');
    if (!userData) return (window.location.href = '/src/pages/login.html');
    this.user = JSON.parse(userData);
  }

  async loadUserData() {
    try {
      const response = await fetch(`${API_URL}/users/${this.user.id}`);
      if (!response.ok) throw new Error('Failed to load user data');
      this.user = await response.json();
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  async loadUserBookings() {
    try {
      const bookingsResponse = await fetch(
        `${API_URL}/bookings?userId=${this.user.id}`
      );
      if (!bookingsResponse.ok) throw new Error('Failed to load bookings');

      const bookings = await bookingsResponse.json();
      const courses = await this.fetchBookingCourses(bookings);
      this.bookings = this.mergeBookingsWithCourses(bookings, courses);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  }

  async fetchBookingCourses(bookings) {
    return Promise.all(
      bookings.map((booking) =>
        fetch(`${API_URL}/courses/${booking.courseId}`).then((res) =>
          res.json()
        )
      )
    );
  }

  mergeBookingsWithCourses(bookings, courses) {
    return bookings.map((booking, index) => ({
      ...booking,
      course: courses[index],
    }));
  }

  setupEventListeners() {
    eventHandler.on(this.logoutBtn, 'click', () => this.handleLogout());
    document
      .querySelectorAll('.tab-btn')
      .forEach((button) =>
        eventHandler.on(button, 'click', (e) => this.handleTabSwitch(e))
      );
  }

  handleLogout() {
    localStorage.removeItem('user');
    window.location.href = '/index.html';
  }

  handleTabSwitch(event) {
    this.updateActiveTab(event.target);
    this.renderCourseList(event.target.dataset.tab);
  }

  updateActiveTab(selectedTab) {
    document
      .querySelectorAll('.tab-btn')
      .forEach((btn) => btn.classList.remove('active'));
    selectedTab.classList.add('active');
  }

  async handleCancelBooking(bookingId, courseId) {
    try {
      await cancelBooking(bookingId, courseId);
      await this.loadUserBookings();
      this.renderCourseList('upcoming');
    } catch (error) {
      alert('Failed to cancel booking: ' + error.message);
    }
  }

  render() {
    this.renderUserDetails();
    this.renderCourseList('upcoming');
  }

  renderUserDetails() {
    if (!this.userDetails) return;
    this.userDetails.innerHTML = this.generateUserDetailsHTML();
    this.setupEditButton();
  }

  generateUserDetailsHTML() {
    return `
      <div class="user-details-container">
        <div class="user-details-header">
          <h3>Personal Information</h3>
          <button class="btn btn-primary" id="edit-profile-btn">Edit Profile</button>
        </div>
        ${this.generateUserInfoFields()}
      </div>
    `;
  }

  generateUserInfoFields() {
    const fields = [
      { label: 'Name', value: this.user.name },
      { label: 'Email', value: this.user.email },
      { label: 'Phone', value: this.user.phone || 'Not provided' },
      { label: 'Address', value: this.user.address || 'Not provided' },
    ];

    return fields
      .map(
        (field) => `
      <div class="user-detail-item">
        <span class="label">${field.label}:</span>
        <span class="value">${field.value}</span>
      </div>
    `
      )
      .join('');
  }

  setupEditButton() {
    const editBtn = this.userDetails.querySelector('#edit-profile-btn');
    eventHandler.on(editBtn, 'click', () => this.handleEditAll());
  }

  async handleEditAll() {
    const originalContent = this.userDetails.innerHTML;
    this.userDetails.innerHTML = this.generateEditFormHTML();
    this.setupEditFormListeners(originalContent);
  }

  generateEditFormHTML() {
    const fields = [
      { id: 'name', type: 'text', value: this.user.name },
      { id: 'email', type: 'email', value: this.user.email },
      { id: 'phone', type: 'tel', value: this.user.phone || '' },
      { id: 'address', type: 'textarea', value: this.user.address || '' },
    ];

    return `
      <div class="edit-form-container">
        ${fields.map((field) => this.generateFormField(field)).join('')}
        <div class="form-actions">
          <button class="btn btn-secondary" id="cancel-edit">Cancel</button>
          <button class="btn btn-primary" id="save-edit">Save Changes</button>
        </div>
      </div>
    `;
  }

  generateFormField({ id, type, value }) {
    const label = id.charAt(0).toUpperCase() + id.slice(1);
    const input =
      type === 'textarea'
        ? `<textarea id="edit-${id}">${value}</textarea>`
        : `<input type="${type}" id="edit-${id}" value="${value}" />`;

    return `
      <div class="form-group">
        <label for="edit-${id}">${label}:</label>
        ${input}
      </div>
    `;
  }

  setupEditFormListeners(originalContent) {
    const cancelBtn = this.userDetails.querySelector('#cancel-edit');
    const saveBtn = this.userDetails.querySelector('#save-edit');

    eventHandler.on(cancelBtn, 'click', () =>
      this.handleEditCancel(originalContent)
    );
    eventHandler.on(saveBtn, 'click', () => this.handleEditSave());
  }

  handleEditCancel(originalContent) {
    this.userDetails.innerHTML = originalContent;
    this.setupEventListeners();
  }

  async handleEditSave() {
    const updatedData = this.getFormData();
    await this.updateUserProfile(updatedData);
  }

  getFormData() {
    return {
      name: document.getElementById('edit-name').value.trim(),
      email: document.getElementById('edit-email').value.trim(),
      phone: document.getElementById('edit-phone').value.trim(),
      address: document.getElementById('edit-address').value.trim(),
    };
  }

  async updateUserProfile(updatedData) {
    try {
      const response = await fetch(`${API_URL}/users/${this.user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      this.user = { ...this.user, ...updatedData };
      localStorage.setItem('user', JSON.stringify(this.user));
      this.renderUserDetails();
    } catch (error) {
      alert(`Failed to update profile: ${error.message}`);
    }
  }

  renderCourseList(type = 'upcoming') {
    if (!this.coursesContainer) return;

    const filteredBookings = this.filterBookingsByType(type);
    this.renderBookings(filteredBookings, type);
  }

  filterBookingsByType(type) {
    const now = new Date();
    return this.bookings.filter((booking) =>
      type === 'upcoming'
        ? new Date(booking.sessionDate) >= now
        : new Date(booking.sessionDate) < now
    );
  }

  renderBookings(filteredBookings, type) {
    if (!filteredBookings.length) {
      this.renderEmptyMessage(type);
      return;
    }

    this.coursesContainer.className = 'course-grid';
    this.coursesContainer.innerHTML = filteredBookings
      .map((booking) => this.createBookingCard(booking))
      .join('');
  }

  renderEmptyMessage(type) {
    this.coursesContainer.innerHTML = `
      <div class="no-courses-message">
        <p>No ${type} courses found.</p>
      </div>
    `;
  }

  createBookingCard(booking) {
    const courseCard = this.createBaseCourseCard(booking);
    return this.appendBookingInfo(courseCard, booking);
  }

  createBaseCourseCard(booking) {
    return createCourseCard(booking.course, true).replace(
      /<span class="session-date">Session Date: [^<]+<\/span>/,
      ''
    );
  }

  appendBookingInfo(courseCard, booking) {
    const formattedDate = this.formatBookingDate(booking.sessionDate);
    return courseCard.replace(
      '</article>',
      `
      <div class="session-info">
        <span class="session-date">Session Date: ${formattedDate}</span>
        <span class="format-badge ${booking.format.toLowerCase()}">${
        booking.format
      }</span>
      </div>
      ${this.generateBookingActions(booking)}
      </article>
    `
    );
  }

  formatBookingDate(date) {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  generateBookingActions(booking) {
    return `
      <div class="booking-actions">
        <a href="/src/pages/course-details.html?id=${booking.course.id}" 
           class="btn btn-primary">View Details</a>
        <button class="btn btn-secondary" 
                onclick="if(confirm('Are you sure you want to cancel this booking?')) 
                        window.myPageManager.handleCancelBooking('${booking.id}', '${booking.course.id}')">
          Cancel Booking
        </button>
      </div>
    `;
  }

  destroy() {
    eventHandler.removeAll();
  }
}

window.myPageManager = new MyPageManager();
