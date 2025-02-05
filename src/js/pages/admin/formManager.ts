console.log('Form Manager Module Loaded');

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
    console.log('Getting form data...'); // Debug log
    const formData = new FormData(this.form);

    // Debug logs to see what we're getting from the form
    console.log('Form data entries:', Object.fromEntries(formData.entries()));

    const scheduledDates = this.getScheduledDates();
    console.log('Scheduled dates:', scheduledDates); // Debug log

    // Get checkbox values for delivery methods
    const deliveryMethodInputs = this.form.querySelectorAll<HTMLInputElement>(
      'input[name="deliveryMethods"]'
    );
    const deliveryMethods = {
      classroom: false,
      distance: false,
    };

    deliveryMethodInputs.forEach((input) => {
      console.log(`Delivery method ${input.value}:`, input.checked); // Debug log
      if (input.checked) {
        deliveryMethods[input.value as 'classroom' | 'distance'] = true;
      }
    });

    // Get all form values with explicit type checking
    const title = formData.get('title') as string | null;
    const tagLine = formData.get('tagLine') as string | null;
    const discription = formData.get('discription') as string | null;
    const courseNumber = formData.get('courseNumber') as string | null;
    const durationDaysValue = formData.get('durationDays');
    const keyWords = formData.get('keyWords') as string | null;
    const image = formData.get('image') as string | null;

    console.log('Duration days value:', durationDaysValue); // Debug log

    // Validate and convert durationDays
    const durationDays = durationDaysValue ? Number(durationDaysValue) : 0;
    if (isNaN(durationDays)) {
      console.error('Invalid duration value:', durationDaysValue);
      throw new Error('Duration must be a valid number');
    }

    const courseData: Course = {
      title: title || '',
      tagLine: tagLine || '',
      discription: discription || '',
      courseNumber: courseNumber || '',
      durationDays,
      keyWords: keyWords || '',
      image: image || '',
      deliveryMethods,
      scheduledDates,
    };

    console.log('Final course data:', courseData); // Debug log

    // Validate required fields
    if (
      !courseData.title ||
      !courseData.courseNumber ||
      !courseData.tagLine ||
      !courseData.discription ||
      courseData.durationDays <= 0
    ) {
      console.error('Validation failed:', courseData);
      throw new Error('Please fill in all required fields');
    }

    return courseData;
  }

  /**
   * Populates form with existing course data
   * @param course Course data to populate
   */
  populateForm(course: Course): void {
    try {
      this.setFormValue('title', course.title);
      this.setFormValue('tagLine', course.tagLine);
      this.setFormValue('discription', course.discription);
      this.setFormValue('courseNumber', course.courseNumber);
      this.setFormValue('durationDays', course.durationDays?.toString() || '');
      this.setFormValue('keyWords', course.keyWords);
      this.setFormValue('image', course.image || '');

      // Set delivery method checkboxes
      const classroomCheckbox = this.form.querySelector(
        'input[value="classroom"]'
      ) as HTMLInputElement;
      const distanceCheckbox = this.form.querySelector(
        'input[value="distance"]'
      ) as HTMLInputElement;

      if (classroomCheckbox) {
        classroomCheckbox.checked = course.deliveryMethods?.classroom || false;
      }
      if (distanceCheckbox) {
        distanceCheckbox.checked = course.deliveryMethods?.distance || false;
      }

      // Clear and repopulate scheduled dates
      this.clearScheduledDates();
      if (course.scheduledDates && course.scheduledDates.length > 0) {
        course.scheduledDates.forEach((date) => this.addDateField(date));
      }
    } catch (error) {
      throw new Error(`Failed to populate form: ${error}`);
    }
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
               placeholder="Available Seats" 
               value="${date?.availableSeats || ''}" 
               min="1"
               required>
               
        <button type="button" class="btn btn-danger remove-date">Remove</button>
      </div>
    `;

    // Add remove button handler
    const removeButton = dateField.querySelector('.remove-date');
    if (removeButton) {
      removeButton.addEventListener('click', () => {
        dateContainer.removeChild(dateField);
      });
    }

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
    console.log(`Setting ${name} to:`, value); // Debug log
    const element = this.form.querySelector(
      `[name="${name}"]`
    ) as HTMLInputElement | null;
    if (element) {
      element.value = value;
    } else {
      console.warn(`Form element with name "${name}" not found`); // Debug log
    }
  }

  /**
   * Clears all scheduled dates from the form
   */
  private clearScheduledDates(): void {
    const dateContainer = this.form.querySelector('#scheduledDatesContainer');
    if (dateContainer) {
      dateContainer.innerHTML = '';
    }
  }
}
