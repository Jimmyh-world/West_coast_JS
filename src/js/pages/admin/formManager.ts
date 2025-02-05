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

    // Validate required fields
    const title = formData.get('title') as string;
    const description = (formData.get('description') as string) || '';
    const courseNumber = formData.get('courseNumber') as string;
    const duration = Number(formData.get('duration'));
    const price = Number(formData.get('price'));

    if (!title || !courseNumber || isNaN(duration) || isNaN(price)) {
      throw new Error('Please fill in all required fields');
    }

    return {
      title,
      description,
      courseNumber,
      duration,
      price,
      status: formData.get('status') as 'Active' | 'Inactive',
      formats: formData.getAll('formats') as string[],
      scheduledDates,
    };
  }

  /**
   * Populates form with existing course data
   * @param course Course data to populate
   */
  populateForm(course: Course): void {
    const {
      title,
      description = '',
      courseNumber,
      duration,
      price,
      status,
      formats = [],
      scheduledDates = [],
    } = course;

    // Set basic form fields
    this.setFormValue('title', title);
    this.setFormValue('description', description);
    this.setFormValue('courseNumber', courseNumber);
    this.setFormValue('duration', duration.toString());
    this.setFormValue('price', price.toString());
    this.setFormValue('status', status);

    // Set formats checkboxes
    formats.forEach((format) => {
      const checkbox = this.form.querySelector(
        `[name="formats"][value="${format}"]`
      ) as HTMLInputElement;
      if (checkbox) checkbox.checked = true;
    });

    // Clear and repopulate scheduled dates
    this.clearScheduledDates();
    scheduledDates.forEach((date) => this.addDateField(date));
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
