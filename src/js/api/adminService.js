export class AdminServiceImpl {
    constructor() {
        this.apiUrl = 'http://localhost:3000';
    }
    async fetchJson(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
    async getAllCoursesWithEnrollments() {
        console.log('Fetching all courses with enrollments...');
        const [courses, bookings] = await Promise.all([
            this.fetchJson(`${this.apiUrl}/courses`),
            this.fetchJson(`${this.apiUrl}/bookings`),
        ]);
        return courses.map((course) => ({
            ...course,
            isDeleted: course.isDeleted || false,
            enrollmentCount: bookings.filter((b) => b.courseId === course.id).length,
        }));
    }
    async getCourseWithEnrollments(courseId) {
        console.log(`Fetching course ${courseId} with enrollments...`);
        const [course, bookings] = await Promise.all([
            this.fetchJson(`${this.apiUrl}/courses/${courseId}`),
            this.fetchJson(`${this.apiUrl}/bookings?courseId=${courseId}`),
        ]);
        return {
            ...course,
            isDeleted: course.isDeleted || false,
            enrollmentCount: bookings.length,
        };
    }
    async softDeleteCourse(courseId) {
        console.log(`Soft deleting course ${courseId}...`);
        const course = await this.fetchJson(`${this.apiUrl}/courses/${courseId}`);
        const response = await fetch(`${this.apiUrl}/courses/${courseId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...course,
                isDeleted: true,
            }),
        });
        return response.ok;
    }
}
//# sourceMappingURL=adminService.js.map