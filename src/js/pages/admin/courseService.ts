import API_CONFIG, { getApiUrl } from './constants.js';
import type { Course } from './types';

export class CourseService {
  async fetchCourses(): Promise<Course[]> {
    const response = await fetch(getApiUrl('COURSES'));
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    return response.json();
  }

  async fetchCourse(id: string): Promise<Course> {
    const response = await fetch(`${getApiUrl('COURSES')}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch course');
    }
    return response.json();
  }

  async createCourse(course: Course): Promise<Course> {
    const response = await fetch(getApiUrl('COURSES'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course),
    });
    if (!response.ok) throw new Error('Failed to create course');
    return response.json();
  }

  async updateCourse(id: string, course: Course): Promise<Course> {
    const response = await fetch(`${getApiUrl('COURSES')}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course),
    });
    if (!response.ok) throw new Error('Failed to update course');
    return response.json();
  }

  async deleteCourse(id: string): Promise<void> {
    const response = await fetch(`${getApiUrl('COURSES')}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete course');
  }
}
