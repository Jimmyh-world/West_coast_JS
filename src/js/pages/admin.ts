import type { Course, ScheduledDate } from '../types/course';

export class AdminPage {
  private courseListElement: HTMLElement | null;
  private modal: HTMLElement | null;
  private courseForm: HTMLFormElement | null;
  private currentCourseId: string | null = null;
  private apiUrl = 'http://localhost:3000';

  constructor() {
    console.log('Admin page initialized');
    this.courseListElement = document.getElementById('courseList');
    this.modal = document.getElementById('courseFormModal');
    this.courseForm = document.getElementById('courseForm') as HTMLFormElement;
    this.initialize();
  }

  private async initialize(): Promise<void> {
    console.log('Initializing admin page...');
    await this.loadCourses();

    const createButton = document.getElementById('createCourseBtn');
    createButton?.addEventListener('click', () => this.showModal());

    const closeButton = this.modal?.querySelector('.close-button');
    closeButton?.addEventListener('click', () => this.hideModal());

    const cancelButton = document.getElementById('cancelButton');
    cancelButton?.addEventListener('click', () => this.hideModal());

    this.courseForm?.addEventListener('submit', (e) =>
      this.handleFormSubmit(e)
    );

    // Add refresh button listener
    const refreshButton = document.querySelector('.refresh-btn');
    if (refreshButton) {
      refreshButton.addEventListener('click', () => this.loadCourses());
    }

    // Add date button handler
    this.initializeAddDateButton();
  }

  private async loadCourses(): Promise<void> {
    console.log('Fetching courses...');
    try {
      const response = await fetch(`${this.apiUrl}/courses`);
      const courses: Course[] = await response.json();
      console.log('Courses fetched:', courses);
      this.renderCourses(courses);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  }

  private async loadCourseData(courseId: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/courses/${courseId}`);
      if (!response.ok) {
        throw new Error('Failed to load course data');
      }

      const course = await response.json();
      if (!this.courseForm) return;

      // Basic fields
      const fields = [
        'title',
        'tagLine',
        'courseNumber',
        'durationDays',
        'keyWords',
        'image',
      ];
      fields.forEach((field) => {
        const input = this.courseForm.elements.namedItem(
          field
        ) as HTMLInputElement;
        if (input && course[field]) {
          input.value = course[field];
        }
      });

      // Description
      const descriptionInput = this.courseForm.elements.namedItem(
        'description'
      ) as HTMLTextAreaElement;
      if (descriptionInput) {
        descriptionInput.value = course.discription || course.description || '';
      }

      // Delivery Methods
      const classroomCheckbox = this.courseForm.elements.namedItem(
        'deliveryMethods.classroom'
      ) as HTMLInputElement;
      const distanceCheckbox = this.courseForm.elements.namedItem(
        'deliveryMethods.distance'
      ) as HTMLInputElement;

      if (classroomCheckbox && distanceCheckbox && course.deliveryMethods) {
        classroomCheckbox.checked = course.deliveryMethods.classroom;
        distanceCheckbox.checked = course.deliveryMethods.distance;
      }

      // Scheduled Dates
      const datesContainer = document.getElementById('scheduledDatesContainer');
      if (datesContainer && course.scheduledDates?.length > 0) {
        datesContainer.innerHTML = '';
        course.scheduledDates.forEach((date: ScheduledDate, idx: number) => {
          const dateGroup = this.createScheduledDateGroup(idx);
          const startDateInput = dateGroup.querySelector(
            'input[type="date"]'
          ) as HTMLInputElement;
          const formatSelect = dateGroup.querySelector(
            'select'
          ) as HTMLSelectElement;
          const seatsInput = dateGroup.querySelector(
            'input[type="number"]'
          ) as HTMLInputElement;

          if (startDateInput) startDateInput.value = date.startDate;
          if (formatSelect) formatSelect.value = date.format;
          if (seatsInput) seatsInput.value = date.availableSeats.toString();

          datesContainer.appendChild(dateGroup);
        });
      }
    } catch (error) {
      console.error('Error loading course data:', error);
      this.showNotification('error', 'Failed to load course data');
    }
  }

  private renderScheduledDates(dates: ScheduledDate[]): void {
    const container = document.getElementById('scheduledDatesContainer');
    if (!container) return;

    container.innerHTML = '';

    if (!dates || !Array.isArray(dates)) {
      console.warn('No scheduled dates or invalid dates format');
      return;
    }

    dates.forEach((date, index) => {
      const dateGroup = this.createScheduledDateGroup(index);
      if (!dateGroup) return;

      // Populate the date group with existing data
      const startDateInput = dateGroup.querySelector(
        '[name^="startDate"]'
      ) as HTMLInputElement;
      const formatSelect = dateGroup.querySelector(
        '[name^="format"]'
      ) as HTMLSelectElement;
      const seatsInput = dateGroup.querySelector(
        '[name^="availableSeats"]'
      ) as HTMLInputElement;

      if (startDateInput) startDateInput.value = date.startDate || '';
      if (formatSelect) formatSelect.value = date.format || 'classroom';
      if (seatsInput) seatsInput.value = date.availableSeats?.toString() || '0';

      container.appendChild(dateGroup);
    });
  }

  private createScheduledDateGroup(index: number): HTMLDivElement {
    const group = document.createElement('div');
    group.className = 'scheduled-date-group';

    group.innerHTML = `
      <div class="date-inputs">
        <label>Start Date:
          <input type="date" name="scheduledDates[${index}].startDate" required>
        </label>
        <label>Format:
          <select name="scheduledDates[${index}].format" required>
            <option value="classroom">Classroom</option>
            <option value="distance">Distance</option>
          </select>
        </label>
        <label>Available Seats:
          <input type="number" name="scheduledDates[${index}].availableSeats" min="0" required>
        </label>
        <button type="button" class="btn btn-danger remove-date">Remove</button>
      </div>
    `;

    const removeButton = group.querySelector('.remove-date');
    if (removeButton) {
      removeButton.addEventListener('click', () => group.remove());
    }

    return group;
  }

  private async handleFormSubmit(e: Event): Promise<void> {
    e.preventDefault();
    const form = e.target;
    if (!(form instanceof HTMLFormElement)) return;

    try {
      const formData = new FormData(form);
      const courseData = {
        title: formData.get('title'),
        tagLine: formData.get('tagLine'),
        courseNumber: formData.get('courseNumber'),
        discription: formData.get('description'), // Map description to discription
        durationDays: formData.get('durationDays'),
        keyWords: formData.get('keyWords'),
        image: formData.get('image'),
        deliveryMethods: {
          classroom: formData.get('deliveryMethods.classroom') === 'on',
          distance: formData.get('deliveryMethods.distance') === 'on',
        },
        scheduledDates: this.getScheduledDatesFromForm(),
      };

      const url = this.currentCourseId
        ? `${this.apiUrl}/courses/${this.currentCourseId}`
        : `${this.apiUrl}/courses`;

      const response = await fetch(url, {
        method: this.currentCourseId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${this.currentCourseId ? 'update' : 'create'} course`
        );
      }

      this.showNotification(
        'success',
        `Course ${this.currentCourseId ? 'updated' : 'created'} successfully!`
      );
      this.hideModal();
      await this.loadCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      this.showNotification(
        'error',
        'Failed to save course. Please try again.'
      );
    }
  }

  private getScheduledDatesFromForm(): ScheduledDate[] {
    const dates: ScheduledDate[] = [];
    const container = document.getElementById('scheduledDatesContainer');
    if (!container) return dates;

    const dateGroups = container.querySelectorAll('.scheduled-date-group');

    dateGroups.forEach((group) => {
      const startDateInput = group.querySelector(
        'input[type="date"]'
      ) as HTMLInputElement;
      const formatSelect = group.querySelector('select') as HTMLSelectElement;
      const seatsInput = group.querySelector(
        'input[type="number"]'
      ) as HTMLInputElement;

      if (startDateInput?.value && formatSelect?.value && seatsInput?.value) {
        dates.push({
          startDate: startDateInput.value,
          format: formatSelect.value as 'classroom' | 'distance',
          availableSeats: parseInt(seatsInput.value, 10),
        });
      }
    });

    return dates;
  }

  private showNotification(type: 'success' | 'error', message: string): void {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add to DOM
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  private showModal(courseId?: string): void {
    this.currentCourseId = courseId || null;
    if (!this.modal) return;

    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
      modalTitle.textContent = courseId ? 'Edit Course' : 'Create New Course';
    }

    if (courseId) {
      this.loadCourseData(courseId);
    } else if (this.courseForm) {
      this.courseForm.reset();
    }

    this.modal.classList.add('active');
  }

  private hideModal(): void {
    this.modal?.classList.remove('active');
    if (this.courseForm) {
      this.courseForm.reset();
    }
    this.currentCourseId = null;
  }

  private renderCourses(courses: Course[]): void {
    console.log('Rendering courses:', courses);
    if (!this.courseListElement) {
      console.error('Course list element not found');
      return;
    }

    this.courseListElement.innerHTML = '';

    courses.forEach((course) => {
      const courseElement = document.createElement('div');
      courseElement.className = 'course-card';

      courseElement.innerHTML = `
        <div class="course-content">
          <h3>${course.title}</h3>
          <div class="course-info">
            <p>Course Number: ${course.courseNumber}</p>
            <p>Duration: ${course.durationDays} days</p>
            <p>Enrollment: ${
              course.scheduledDates?.[0]?.availableSeats || 0
            }</p>
            <p>Status: Active</p>
          </div>
        </div>
        <div class="card-actions">
          <button class="btn btn-primary view-details" data-course-id="${
            course.id
          }">View Details</button>
          <button class="btn btn-secondary edit" data-course-id="${
            course.id
          }">Edit</button>
          <button class="btn btn-danger delete" data-course-id="${
            course.id
          }">Delete</button>
        </div>
      `;

      // Add event listeners
      const editBtn = courseElement.querySelector('.edit');
      editBtn?.addEventListener('click', () => this.showModal(course.id));

      const deleteBtn = courseElement.querySelector('.delete');
      deleteBtn?.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this course?')) {
          try {
            const response = await fetch(
              `${this.apiUrl}/courses/${course.id}`,
              {
                method: 'DELETE',
              }
            );
            if (response.ok) {
              await this.loadCourses();
            }
          } catch (error) {
            console.error('Error deleting course:', error);
          }
        }
      });

      this.courseListElement.appendChild(courseElement);
    });

    // Add event listeners for the create and refresh buttons
    const createBtn = document.getElementById('createCourseBtn');
    createBtn?.addEventListener('click', () => this.showModal());

    const refreshBtn = document.querySelector('.refresh-btn');
    refreshBtn?.addEventListener('click', () => this.loadCourses());
  }

  // Add date button handler
  private initializeAddDateButton(): void {
    const addDateBtn = document.getElementById('addDateBtn');
    if (addDateBtn) {
      addDateBtn.addEventListener('click', () => {
        const container = document.getElementById('scheduledDatesContainer');
        if (container) {
          const newIndex = container.children.length;
          const dateGroup = this.createScheduledDateGroup(newIndex);
          container.appendChild(dateGroup);
        }
      });
    }
  }
}

// Create instance only if we're in the browser environment
if (typeof window !== 'undefined') {
  console.log('Creating AdminPage instance');
  new AdminPage();
}
