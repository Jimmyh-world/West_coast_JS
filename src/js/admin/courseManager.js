class CourseManager {
  constructor() {
    this.apiUrl = 'http://localhost:3000';
  }

  async renderCourseDetails(course) {
    const enrolledStudents = await this.getEnrolledStudents(course.id);
    const studentsList =
      enrolledStudents.length > 0
        ? enrolledStudents
            .map((student) => `<li>${student.name} (${student.email})</li>`)
            .join('')
        : '<p>No students enrolled yet</p>';

    return `
            <div class="course-details">
                <h2>${course.title || 'Untitled Course'}</h2>
                <p><strong>Course Number:</strong> ${course.courseNumber}</p>
                <p><strong>Duration:</strong> ${
                  course.duration || 'undefined'
                } days</p>
                <p><strong>Price:</strong> ${
                  course.price || 'undefined'
                } SEK</p>
                <p><strong>Status:</strong> ${course.status || 'undefined'}</p>
                <p><strong>Formats:</strong> ${this.formatDeliveryMethods(
                  course.deliveryMethods
                )}</p>

                <div class="sessions-section">
                    <h3>Scheduled Sessions</h3>
                    ${this.renderScheduledSessions(course.sessions)}
                </div>

                <div class="enrolled-section">
                    <h3>Enrolled Students</h3>
                    <ul class="students-list">
                        ${studentsList}
                    </ul>
                </div>

                <div class="description-section">
                    <h3>Description</h3>
                    <p>${course.description || 'No description available'}</p>
                </div>
            </div>
        `;
  }

  async getEnrolledStudents(courseId) {
    try {
      const bookings = await fetch(
        `${this.apiUrl}/bookings?courseId=${courseId}`
      ).then((res) => res.json());
      const studentIds = bookings.map((booking) => booking.userId);
      const uniqueIds = [...new Set(studentIds)];

      const studentPromises = uniqueIds.map((userId) =>
        fetch(`${this.apiUrl}/users/${userId}`).then((res) => res.json())
      );

      return await Promise.all(studentPromises);
    } catch (error) {
      console.error('Error fetching enrolled students:', error);
      return [];
    }
  }

  formatDeliveryMethods(methods) {
    if (!methods) return 'None specified';
    const formats = [];
    if (methods.classroom) formats.push('Classroom');
    if (methods.distance) formats.push('Distance');
    return formats.length ? formats.join(', ') : 'None specified';
  }
}

export const courseManager = new CourseManager();
