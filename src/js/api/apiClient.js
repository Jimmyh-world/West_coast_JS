/**
 * API Client Service
 *
 * Provides centralized HTTP request handling for the application:
 * - JSON request formatting
 * - Error handling
 * - Course CRUD operations
 * - Response parsing
 *
 * Dependencies:
 * - Requires JSON server running on localhost:3000
 * - Expects standard REST endpoints for courses
 *
 * @module apiClient
 */

const BASE_URL = 'http://localhost:3000';

class ApiClient {
  async fetchJson(endpoint, options = {}) {
    const defaultHeaders = { 'Content-Type': 'application/json' };
    const requestOptions = {
      headers: defaultHeaders,
      ...options,
    };

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, requestOptions);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`API call failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Course Management Methods
  getCourses() {
    return this.fetchJson('/courses');
  }

  getCourseById(id) {
    return this.fetchJson(`/courses/${id}`);
  }

  createCourse(courseData) {
    return this.fetchJson('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  updateCourse(id, courseData) {
    return this.fetchJson(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  }

  deleteCourse(id) {
    return this.fetchJson(`/courses/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
