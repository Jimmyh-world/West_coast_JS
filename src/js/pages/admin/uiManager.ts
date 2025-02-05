import type { Course, CourseHandlers } from './types.js';

export class UIManager {
  private modal: HTMLElement;
  private courseList: HTMLElement;
  private detailsPanel: HTMLElement;

  constructor(modal: HTMLElement, courseList: HTMLElement) {
    this.modal = modal;
    this.courseList = courseList;
    this.detailsPanel = document.getElementById('courseDetails') as HTMLElement;
    if (!this.detailsPanel) {
      throw new Error('Course details panel not found');
    }
    this.showPlaceholder();
  }

  showModal(isEdit: boolean): void {
    const modalTitle = this.modal.querySelector('#modalTitle');
    if (modalTitle) {
      modalTitle.textContent = isEdit ? 'Edit Course' : 'Create New Course';
    }
    this.modal.style.display = 'block';
  }

  hideModal(): void {
    this.modal.style.display = 'none';
  }

  renderCourses(courses: Course[], handlers: CourseHandlers): void {
    this.courseList.innerHTML = courses
      .map(
        (course) => `
      <div class="course-card" data-course-id="${course.id}">
        <h3>${course.title || 'Untitled Course'}</h3>
        <div class="course-details">
          <p>Course Number: ${course.courseNumber}</p>
          <p>Duration: ${
            course.duration ? `${course.duration} days` : 'Not specified'
          }</p>
          <p>Status: ${course.status || 'Draft'}</p>
        </div>
        <div class="course-actions">
          <button class="btn btn-info view-details-btn" data-course-id="${
            course.id
          }">View Details</button>
          <button class="btn btn-primary edit-btn" data-course-id="${
            course.id
          }">Edit</button>
          <button class="btn btn-danger delete-btn" data-course-id="${
            course.id
          }">Delete</button>
        </div>
      </div>
    `
      )
      .join('');

    // Add event listeners
    this.courseList.querySelectorAll('.view-details-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const courseId = (btn as HTMLElement).dataset.courseId;
        if (courseId) handlers.onViewDetails(courseId);

        // Highlight selected course
        this.courseList.querySelectorAll('.course-card').forEach((card) => {
          card.classList.remove('selected');
        });
        btn.closest('.course-card')?.classList.add('selected');
      });
    });

    this.courseList.querySelectorAll('.edit-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const courseId = (btn as HTMLElement).dataset.courseId;
        if (courseId) handlers.onEdit(courseId);
      });
    });

    this.courseList.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const courseId = (btn as HTMLElement).dataset.courseId;
        if (courseId) handlers.onDelete(courseId);
      });
    });
  }

  renderCourseDetails(course: Course): void {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    this.detailsPanel.innerHTML = `
      <div class="course-overview">
        <h3>${course.title}</h3>
        <div class="overview-details">
          <p><strong>Course Number:</strong> ${course.courseNumber}</p>
          <p><strong>Duration:</strong> ${course.duration} days</p>
          <p><strong>Price:</strong> ${course.price} SEK</p>
          <p><strong>Status:</strong> ${course.status}</p>
          <p><strong>Formats:</strong> ${
            course.formats?.join(', ') || 'None specified'
          }</p>
        </div>
      </div>

      <div class="scheduled-sessions">
        <h4>Scheduled Sessions</h4>
        ${
          course.scheduledDates?.length
            ? course.scheduledDates
                .map(
                  (date) => `
            <div class="session-detail">
              <p><strong>Date:</strong> ${formatDate(date.startDate)}</p>
              <p><strong>Format:</strong> ${date.format}</p>
              <p><strong>Available Seats:</strong> ${date.availableSeats}</p>
            </div>
          `
                )
                .join('')
            : '<p>No sessions scheduled</p>'
        }
      </div>

      <div class="enrolled-students">
        <h4>Enrolled Students</h4>
        ${
          course.enrollments?.length
            ? `
          <div class="students-list">
            ${course.enrollments
              .map(
                (student) => `
              <div class="student-card">
                <div class="student-info">
                  <p><strong>Name:</strong> ${student.studentName}</p>
                  <p><strong>Email:</strong> ${student.email}</p>
                  <p><strong>Phone:</strong> ${student.phoneNumber}</p>
                  <p><strong>Format:</strong> ${student.format}</p>
                  <p><strong>Enrolled:</strong> ${formatDate(
                    student.enrolledDate
                  )}</p>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        `
            : '<p>No students enrolled yet</p>'
        }
      </div>

      <div class="course-description">
        <h4>Description</h4>
        <p>${course.description}</p>
      </div>
    `;
  }

  showPlaceholder(): void {
    this.detailsPanel.innerHTML = `
      <div class="details-placeholder">
        <p>Select a course to view details</p>
      </div>
    `;
  }
}
