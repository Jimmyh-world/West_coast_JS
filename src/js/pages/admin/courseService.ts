import type { Course } from './types.js';

const API_URL = 'http://localhost:3000';

export class CourseService {
  async fetchCourses(): Promise<Course[]> {
    const response = await fetch(`${API_URL}/courses`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  }

  async fetchCourse(id: string): Promise<Course> {
    const response = await fetch(`${API_URL}/courses/${id}`);
    if (!response.ok) throw new Error('Failed to fetch course');
    return response.json();
  }

  async createCourse(courseData: Course): Promise<Course> {
    const response = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData),
    });
    if (!response.ok) throw new Error('Failed to create course');
    return response.json();
  }

  async updateCourse(id: string, courseData: Course): Promise<Course> {
    const response = await fetch(`${API_URL}/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData),
    });
    if (!response.ok) throw new Error('Failed to update course');
    return response.json();
  }

  async deleteCourse(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/courses/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete course');
  }
}
