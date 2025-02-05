/**
 * Search Manager
 *
 * Handles course search functionality including:
 * - Real-time search filtering
 * - Delivery method filtering
 * - Results display
 * - Event management
 *
 * Dependencies:
 * - courseServices for course data
 * - courseList for result display
 * - eventHandler for DOM events
 *
 * @module SearchManager
 */

import { getCourses } from '../api/courseServices.js';
import { eventHandler } from './eventHandler.js';
import { createCourseCard } from '../components/courseList.js';

export class SearchManager {
  constructor(
    searchInputId,
    filterSelectId,
    searchButtonId,
    resultsContainerId
  ) {
    this.searchInput = document.getElementById(searchInputId);
    this.filterSelect = document.getElementById(filterSelectId);
    this.searchButton = document.getElementById(searchButtonId);
    this.resultsContainer = document.getElementById(resultsContainerId);
    this.courses = [];
    this.init();
  }

  async init() {
    try {
      this.courses = await getCourses();
      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to initialize search:', error);
    }
  }

  setupEventListeners() {
    if (this.searchButton) {
      this.searchButton.addEventListener('click', () => this.performSearch());
    }
    eventHandler.on(this.searchInput, 'keyup', (e) => {
      if (e.key === 'Enter') this.performSearch();
    });
    eventHandler.on(this.filterSelect, 'change', () => this.performSearch());
  }

  async performSearch() {
    try {
      const searchTerm = this.searchInput?.value || '';
      const filterValue = this.filterSelect?.value || '';

      const courses = await getCourses();
      this.displayResults(courses);
    } catch (error) {
      console.error('Search failed:', error);
      if (this.resultsContainer) {
        this.resultsContainer.innerHTML =
          '<p>Error searching courses. Please try again.</p>';
      }
    }
  }

  displayResults(courses) {
    if (!this.resultsContainer) return;

    if (courses.length === 0) {
      this.resultsContainer.innerHTML =
        '<p>No courses found matching your criteria.</p>';
      return;
    }

    this.resultsContainer.innerHTML = courses
      .map((course) => createCourseCard(course))
      .join('');
  }

  destroy() {
    eventHandler.removeAll();
  }
}
