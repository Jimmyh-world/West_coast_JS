// src/js/pages/myPage.js
import { eventHandler } from '../utilities/eventHandler.js';
import { courseUtils } from '../utilities/courseUtils.js';
import { createCourseCard } from '../components/courseList.js';

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
    await this.loadUserData();
    await this.loadUserBookings();
    this.setupEventListeners();
    this.render();
  }

  checkAuthentication() {
    const userData = localStorage.getItem('user');
    if (!userData) {
      window.location.href = '/src/pages/login.html';
      return;
    }
    this.user = JSON.parse(userData);
  }

  async loadUserData() {
    try {
      const response = await fetch(
        `http://localhost:3000/users/${this.user.id}`
      );
      if (!response.ok) throw new Error('Failed to load user data');
      this.user = await response.json();
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  async loadUserBookings() {
    try {
      const response = await fetch(
        `http://localhost:3000/bookings?userId=${this.user.id}`
      );
      if (!response.ok) throw new Error('Failed to load bookings');
      this.bookings = await response.json();

      // Load course details for each booking
      const coursePromises = this.bookings.map((booking) =>
        fetch(`http://localhost:3000/courses/${booking.courseId}`).then((res) =>
          res.json()
        )
      );
      const courses = await Promise.all(coursePromises);

      // Merge course details with bookings
      this.bookings = this.bookings.map((booking, index) => ({
        ...booking,
        course: courses[index],
      }));
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  }

  setupEventListeners() {
    // Logout button
    eventHandler.on(this.logoutBtn, 'click', () => this.handleLogout());

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach((button) => {
      eventHandler.on(button, 'click', (e) => this.handleTabSwitch(e));
    });
  }

  handleLogout() {
    localStorage.removeItem('user');
    window.location.href = '/index.html';
  }

  handleTabSwitch(event) {
    const activeTab = event.target.dataset.tab;

    // Update active button state
    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Render appropriate course list
    this.renderCourseList(activeTab);
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
    const filteredBookings = this.bookings.filter((booking) => {
      const courseDate = new Date(booking.sessionDate);
      return type === 'upcoming' ? courseDate >= now : courseDate < now;
    });

    if (filteredBookings.length === 0) {
      this.coursesContainer.innerHTML = `
                <div class="no-courses-message">
                    <p>No ${type} courses found.</p>
                </div>
            `;
      return;
    }

    // Add the course-grid class to the container
    this.coursesContainer.className = 'course-grid';

    // Use the same createCourseCard function with additional booking info
    this.coursesContainer.innerHTML = filteredBookings
      .map((booking) => {
        const course = booking.course;
        // Add session date to the course object for display
        course.sessionDate = booking.sessionDate;
        return createCourseCard(course, true); // true indicates this is a booked course
      })
      .join('');
  }

  destroy() {
    eventHandler.removeAll();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MyPageManager();
});
