import type { Course, ScheduledDate } from '../types/course';

export class UIManager {
  private modal: HTMLElement;
  private courseList: HTMLElement;

  constructor(modal: HTMLElement, courseList: HTMLElement) {
    this.modal = modal;
    this.courseList = courseList;
  }

  showModal(isEdit: boolean): void {
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
      modalTitle.textContent = isEdit ? 'Edit Course' : 'Create New Course';
    }
    this.modal.classList.add('active');
  }

  hideModal(): void {
    this.modal.classList.remove('active');
  }

  renderCourses(
    courses: Course[],
    handlers: {
      onEdit: (id: string) => void;
      onDelete: (id: string) => void;
    }
  ): void {
    this.courseList.innerHTML = !courses.length
      ? '<p>No courses found</p>'
      : courses
          .map((course) => this.createCourseElement(course, handlers))
          .join('');
  }

  private createCourseElement(
    course: Course,
    handlers: {
      onEdit: (id: string) => void;
      onDelete: (id: string) => void;
    }
  ): string {
    const courseId = course.id?.toString() || '';
    return `
      <div class="course-card">
        <div class="course-content">
          <h3>${course.title || 'Untitled Course'}</h3>
          <div class="course-info">
            <p>Course Number: ${course.courseNumber || 'N/A'}</p>
            <p>Duration: ${course.durationDays || 0} days</p>
            <p>Enrollment: ${
              course.scheduledDates?.[0]?.availableSeats || 0
            }</p>
            <p>Status: Active</p>
          </div>
        </div>
        <div class="card-actions">
          <button class="btn btn-secondary edit" onclick="(${
            handlers.onEdit
          })(${courseId})">Edit</button>
          <button class="btn btn-danger delete" onclick="(${
            handlers.onDelete
          })(${courseId})">Delete</button>
        </div>
      </div>
    `;
  }
}
