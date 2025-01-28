// src/js/utilities/search.js
import { getCourses } from '../api/courseServices.js';
import { createCourseCard } from '../components/courseList.js';

export class SearchManager {
  constructor(
    searchInputId,
    filterSelectId,
    searchButtonId,
    resultsContainerId
  ) {
    console.log('Initializing SearchManager with:', {
      searchInputId,
      filterSelectId,
      searchButtonId,
      resultsContainerId,
    });
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
    this.searchButton.addEventListener('click', () => this.handleSearch());
    this.searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') this.handleSearch();
    });
    this.filterSelect.addEventListener('change', () => this.handleSearch());
  }

  async handleSearch() {
    const searchTerm = this.searchInput.value.toLowerCase();
    const filterType = this.filterSelect.value;

    if (searchTerm.trim() === '') {
      this.resultsContainer.innerHTML = `
                <div class="error-message">
                    <p>Please enter a search term to find courses.</p>
                </div>`;
      return;
    }

    let results = this.courses.filter((course) => {
      const matchesSearch =
        searchTerm === '' ||
        course.title.toLowerCase().includes(searchTerm) ||
        course.keyWords.toLowerCase().includes(searchTerm) ||
        course.discription.toLowerCase().includes(searchTerm);

      const matchesFilter =
        filterType === '' ||
        (filterType === 'classroom' && course.deliveryMethods.classroom) ||
        (filterType === 'ondemand' && course.deliveryMethods.distance);

      return matchesSearch && matchesFilter;
    });

    this.displayResults(results);
  }

  displayResults(results) {
    if (!this.resultsContainer) return;

    if (results.length === 0) {
      this.resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>No courses found matching your criteria.</p>
                </div>`;
      return;
    }

    this.resultsContainer.innerHTML = results
      .map((course) => createCourseCard(course))
      .join('');
  }
}
