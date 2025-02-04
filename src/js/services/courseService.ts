import type { Course } from '../types/course';

export class CourseService {
  private apiUrl: string;

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.apiUrl = `${baseUrl}/courses`;
  }

  private async handleRequest<T>(
    url: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async fetchCourses() {
    return this.handleRequest<Course[]>(this.apiUrl);
  }

  async fetchCourse(id: string) {
    return this.handleRequest<Course>(`${this.apiUrl}/${id}`);
  }

  async createCourse(courseData: Partial<Course>) {
    return this.handleRequest<Course>(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData),
    });
  }

  async updateCourse(id: string, courseData: Partial<Course>) {
    return this.handleRequest<Course>(`${this.apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData),
    });
  }

  async deleteCourse(id: string) {
    return this.handleRequest<void>(`${this.apiUrl}/${id}`, {
      method: 'DELETE',
    });
  }
}
