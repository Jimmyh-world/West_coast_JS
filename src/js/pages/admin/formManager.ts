import type { Course, ScheduledDate } from './types.js';

export class FormManager {
  private form: HTMLFormElement;

  constructor(form: HTMLFormElement) {
    this.form = form;
    this.setupDateButton();
  }

  /**
   * Collects all form data including scheduled dates
   * @returns Course object with all form data
   */
  getFormData(): Course {
    const formData = new FormData(this.form);
    const scheduledDates = this.getScheduledDates();

    // Get form values matching db.json structure
    const title = formData.get('title') as string;
    const tagLine = formData.get('tagLine') as string;
    const discription = formData.get('description') as string; // Note field name difference
    const courseNumber = formData.get('courseNumber') as string;
    const durationDays = Number(formData.get('duration'));
    const keyWords = formData.get('keyWords') as string;
    const image = formData.get('image') as string;

    // Get checkbox values for delivery methods
    const classroom = formData.get('formats')?.includes('classroom') || false;
    const distance = formData.get('formats')?.includes('distance') || false;

    if (!title || !courseNumber || !tagLine || isNaN(durationDays)) {
      throw new Error('Please fill in all required fields');
    }

    return {
      title,
      tagLine,
      discription,
      courseNumber,
      durationDays,
      keyWords,
      image,
      deliveryMethods: {
        classroom,
        distance,
      },
      scheduledDates,
    };
  }

  /**
   * Populates form with existing course data
   * @param course Course data to populate
   */
  populateForm(course: Course): void {
    // Set basic form fields
    this.setFormValue('title', course.title);
    this.setFormValue('tagLine', course.tagLine);
    this.setFormValue('description', course.discription); // Note field name difference
    this.setFormValue('courseNumber', course.courseNumber);
    this.setFormValue('duration', course.durationDays.toString());
    this.setFormValue('keyWords', course.keyWords);
    this.setFormValue('image', course.image);

    // Set delivery method checkboxes
    const classroomCheckbox = this.form.querySelector(
      '[value="classroom"]'
    ) as HTMLInputElement;
    const distanceCheckbox = this.form.querySelector(
      '[value="distance"]'
    ) as HTMLInputElement;
    if (classroomCheckbox)
      classroomCheckbox.checked = course.deliveryMethods.classroom;
    if (distanceCheckbox)
      distanceCheckbox.checked = course.deliveryMethods.distance;

    // Clear and repopulate scheduled dates
    this.clearScheduledDates();
    course.scheduledDates?.forEach((date) => this.addDateField(date));
  }

  /**
   * Sets up the Add Date button click handler
   */
  private setupDateButton(): void {
    const addDateBtn = this.form.querySelector('#addDateBtn');
    if (addDateBtn) {
      addDateBtn.addEventListener('click', () => this.addDateField());
    }
  }

  /**
   * Adds a new date field to the form
   * @param date Optional existing date data to populate
   */
  private addDateField(date?: ScheduledDate): void {
    const dateContainer = this.form.querySelector('#scheduledDatesContainer');
    if (!dateContainer) return;

    const dateField = document.createElement('div');
    dateField.className = 'scheduled-date-field';
    dateField.innerHTML = `
      <div class="date-inputs">
        <input type="date" 
               class="form-control" 
               name="startDate" 
               value="${date?.startDate || ''}" 
               required>
               
        <select class="form-control" name="format" required>
          <option value="">Select Format</option>
          <option value="classroom" ${
            date?.format === 'classroom' ? 'selected' : ''
          }>Classroom</option>
          <option value="distance" ${
            date?.format === 'distance' ? 'selected' : ''
          }>Distance</option>
        </select>
        
        <input type="number" 
               class="form-control" 
               name="availableSeats" 
               placeholder="Seats" 
               value="${date?.availableSeats || ''}" 
               min="1"
               required>
               
        <button type="button" class="btn btn-danger remove-date">Remove</button>
      </div>
    `;

    // Add remove button handler
    dateField.querySelector('.remove-date')?.addEventListener('click', () => {
      dateContainer.removeChild(dateField);
    });

    dateContainer.appendChild(dateField);
  }

  /**
   * Collects all scheduled dates from the form
   * @returns Array of ScheduledDate objects
   */
  private getScheduledDates(): ScheduledDate[] {
    const dateFields = this.form.querySelectorAll('.scheduled-date-field');
    return Array.from(dateFields).map((field) => ({
      startDate: (field.querySelector('[name="startDate"]') as HTMLInputElement)
        .value,
      format: (field.querySelector('[name="format"]') as HTMLSelectElement)
        .value as 'classroom' | 'distance',
      availableSeats: Number(
        (field.querySelector('[name="availableSeats"]') as HTMLInputElement)
          .value
      ),
    }));
  }

  /**
   * Helper to set form field values
   */
  private setFormValue(name: string, value: string): void {
    const element = this.form.querySelector(
      `[name="${name}"]`
    ) as HTMLInputElement;
    if (element) element.value = value;
  }

  /**
   * Clears all scheduled dates from the form
   */
  private clearScheduledDates(): void {
    const dateContainer = this.form.querySelector('#scheduledDatesContainer');
    if (dateContainer) dateContainer.innerHTML = '';
  }
}
