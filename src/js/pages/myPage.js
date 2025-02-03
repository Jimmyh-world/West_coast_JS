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
    this.userDetails = document.getElementById('user-details');
    this.coursesContainer = document.getElementById('courses-container');
    this.logoutBtn = document.getElementById('logout-btn');
    this.user = null;
    this.bookings = [];
    this.init();
  }

  async init() {
    this.checkAuthentication();
    await Promise.all([this.loadUserData(), this.loadUserBookings()]);
    this.setupEventListeners();
    this.render();
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
      const response = await fetch(
        `${API_URL}/bookings?userId=${this.user.id}`
      );
      if (!response.ok) throw new Error('Failed to load bookings');

      this.bookings = await response.json();
      const courses = await Promise.all(
        this.bookings.map((booking) =>
          fetch(`${API_URL}/courses/${booking.courseId}`).then((res) =>
            res.json()
          )
        )
      );

      this.bookings = this.bookings.map((booking, index) => ({
        ...booking,
        course: courses[index],
      }));
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
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
    const activeTab = event.target.dataset.tab;
    document
      .querySelectorAll('.tab-btn')
      .forEach((btn) => btn.classList.remove('active'));
    event.target.classList.add('active');
    this.renderCourseList(activeTab);
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
    this.userDetails.innerHTML = `
      <div class="user-detail-item">
        <span class="label">Name:</span>
        <span class="value">${this.user.name}</span>
      </div>
      <div class="user-detail-item">
        <span class="label">Email:</span>
        <span class="value">${this.user.email}</span>
      </div>
    `;
  }

  renderCourseList(type = 'upcoming') {
    if (!this.coursesContainer) return;

    const now = new Date();
    const filteredBookings = this.bookings.filter((booking) =>
      type === 'upcoming'
        ? new Date(booking.sessionDate) >= now
        : new Date(booking.sessionDate) < now
    );

    if (!filteredBookings.length) {
      this.coursesContainer.innerHTML = `
        <div class="no-courses-message">
          <p>No ${type} courses found.</p>
        </div>
      `;
      return;
    }

    this.coursesContainer.className = 'course-grid';
    this.coursesContainer.innerHTML = filteredBookings
      .map((booking) => this.createBookingCard(booking))
      .join('');
  }

  createBookingCard(booking) {
    const courseCard = createCourseCard(booking.course, true);
    return courseCard.replace(
      '</article>',
      `
      <div class="booking-actions">
        <a href="/src/pages/course-details.html?id=${booking.course.id}" 
           class="btn btn-primary">View Details</a>
        <button class="btn btn-secondary" 
                onclick="if(confirm('Are you sure you want to cancel this booking?')) 
                        window.myPageManager.handleCancelBooking('${booking.id}', '${booking.course.id}')">
          Cancel Booking
        </button>
      </div>
      </article>
    `
    );
  }

  destroy() {
    eventHandler.removeAll();
  }
}

window.myPageManager = new MyPageManager();
