export class UIManager {
    constructor(modal, courseList) {
        this.modal = modal;
        this.courseList = courseList;
    }
    showModal(isEdit) {
        const modalTitle = document.getElementById('modalTitle');
        if (modalTitle) {
            modalTitle.textContent = isEdit ? 'Edit Course' : 'Create New Course';
        }
        this.modal.classList.add('active');
    }
    hideModal() {
        this.modal.classList.remove('active');
    }
    renderCourses(courses, handlers) {
        this.courseList.innerHTML = !courses.length
            ? '<p>No courses found</p>'
            : courses
                .map((course) => this.createCourseElement(course, handlers))
                .join('');
    }
    createCourseElement(course, handlers) {
        const courseId = course.id?.toString() || '';
        return `
      <div class="course-card">
        <div class="course-content">
          <h3>${course.title || 'Untitled Course'}</h3>
          <div class="course-info">
            <p>Course Number: ${course.courseNumber || 'N/A'}</p>
            <p>Duration: ${course.durationDays || 0} days</p>
            <p>Enrollment: ${course.scheduledDates?.[0]?.availableSeats || 0}</p>
            <p>Status: Active</p>
          </div>
        </div>
        <div class="card-actions">
          <button class="btn btn-secondary edit" onclick="(${handlers.onEdit})(${courseId})">Edit</button>
          <button class="btn btn-danger delete" onclick="(${handlers.onDelete})(${courseId})">Delete</button>
        </div>
      </div>
    `;
    }
}
//# sourceMappingURL=uiManager.js.map