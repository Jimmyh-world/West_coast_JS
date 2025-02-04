export class CourseService {
    constructor(baseUrl = 'http://localhost:3000') {
        this.apiUrl = `${baseUrl}/courses`;
    }
    async handleRequest(url, options) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
    async fetchCourses() {
        return this.handleRequest(this.apiUrl);
    }
    async fetchCourse(id) {
        return this.handleRequest(`${this.apiUrl}/${id}`);
    }
    async createCourse(courseData) {
        return this.handleRequest(this.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(courseData),
        });
    }
    async updateCourse(id, courseData) {
        return this.handleRequest(`${this.apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(courseData),
        });
    }
    async deleteCourse(id) {
        return this.handleRequest(`${this.apiUrl}/${id}`, {
            method: 'DELETE',
        });
    }
}
//# sourceMappingURL=courseService.js.map