// src/js/api/apiClient.js

const BASE_URL = 'http://localhost:3000';

class ApiClient {
  async fetchJson(endpoint, options = {}) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed: ${endpoint}`, error);
      throw error;
    }
  }

  async getCourses() {
    return this.fetchJson('/courses');
  }

  async getCourseById(id) {
    return this.fetchJson(`/courses/${id}`);
  }

  async createCourse(courseData) {
    return this.fetchJson('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async updateCourse(id, courseData) {
    return this.fetchJson(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  }

  async deleteCourse(id) {
    return this.fetchJson(`/courses/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
