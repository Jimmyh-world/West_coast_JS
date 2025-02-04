export class CourseService {
    constructor(apiUrl = 'http://localhost:3000') {
        this.apiUrl = apiUrl;
    }
    async fetchCourses() {
        try {
            const response = await fetch(`${this.apiUrl}/courses`);
            if (!response.ok)
                throw new Error('Failed to fetch courses');
            return await response.json();
        }
        catch (error) {
            console.error('Error fetching courses:', error);
            throw error;
        }
    }
    async fetchCourse(id) {
        try {
            const response = await fetch(`${this.apiUrl}/courses/${id}`);
            if (!response.ok)
                throw new Error('Failed to fetch course');
            return await response.json();
        }
        catch (error) {
            console.error('Error fetching course:', error);
            throw error;
        }
    }
    async createCourse(courseData) {
        try {
            const response = await fetch(`${this.apiUrl}/courses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(courseData),
            });
            if (!response.ok)
                throw new Error('Failed to create course');
            return await response.json();
        }
        catch (error) {
            console.error('Error creating course:', error);
            throw error;
        }
    }
    async updateCourse(id, courseData) {
        try {
            const response = await fetch(`${this.apiUrl}/courses/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(courseData),
            });
            if (!response.ok)
                throw new Error('Failed to update course');
            return await response.json();
        }
        catch (error) {
            console.error('Error updating course:', error);
            throw error;
        }
    }
    async deleteCourse(id) {
        try {
            const response = await fetch(`${this.apiUrl}/courses/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok)
                throw new Error('Failed to delete course');
        }
        catch (error) {
            console.error('Error deleting course:', error);
            throw error;
        }
    }
}
//# sourceMappingURL=courseService.js.map