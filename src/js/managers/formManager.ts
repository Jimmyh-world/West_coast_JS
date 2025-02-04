import type { Course, ScheduledDate } from '../types/course';

export class FormManager {
  private form: HTMLFormElement;

  constructor(form: HTMLFormElement) {
    this.form = form;
  }

  getFormData(): Partial<Course> {
    const formData = new FormData(this.form);
    return {
      title: String(formData.get('title') ?? ''),
      tagLine: String(formData.get('tagLine') ?? ''),
      courseNumber: String(formData.get('courseNumber') ?? ''),
      discription: String(formData.get('description') ?? ''),
      durationDays: Number(formData.get('durationDays') ?? 0),
      keyWords: String(formData.get('keyWords') ?? ''),
      image: String(formData.get('image') ?? 'default.jpg'),
      deliveryMethods: this.getDeliveryMethods(),
      scheduledDates: this.getScheduledDates(),
    };
  }

  private getDeliveryMethods() {
    return {
      classroom: Boolean(
        (document.getElementById('classroom') as HTMLInputElement)?.checked
      ),
      distance: Boolean(
        (document.getElementById('distance') as HTMLInputElement)?.checked
      ),
    };
  }

  private getScheduledDates(): ScheduledDate[] {
    const container = document.getElementById('scheduledDatesContainer');
    if (!container) return [];

    return Array.from(container.querySelectorAll('.scheduled-date-group'))
      .map((group) => {
        const startDate = (
          group.querySelector('input[type="date"]') as HTMLInputElement
        )?.value;
        const format = (group.querySelector('select') as HTMLSelectElement)
          ?.value;
        const seats = (
          group.querySelector('input[type="number"]') as HTMLInputElement
        )?.value;

        return startDate && format && seats
          ? {
              startDate,
              format: format as 'classroom' | 'distance',
              availableSeats: parseInt(seats, 10),
            }
          : null;
      })
      .filter((date): date is ScheduledDate => date !== null);
  }

  populateForm(course: Course): void {
    const fields = [
      'title',
      'tagLine',
      'courseNumber',
      'durationDays',
      'keyWords',
      'image',
    ] as const;

    fields.forEach((field) => {
      const input = this.form.elements.namedItem(field) as HTMLInputElement;
      if (input && course[field] !== undefined) {
        input.value = String(course[field]);
      }
    });

    // Handle description/discription mapping
    const descriptionInput = this.form.elements.namedItem(
      'description'
    ) as HTMLTextAreaElement;
    if (descriptionInput) {
      descriptionInput.value = course.discription || '';
    }

    // Delivery Methods
    this.setDeliveryMethods(course.deliveryMethods);

    // Scheduled Dates
    this.setScheduledDates(course.scheduledDates);
  }

  private setDeliveryMethods(deliveryMethods?: {
    classroom: boolean;
    distance: boolean;
  }): void {
    const classroomCheckbox = document.getElementById(
      'classroom'
    ) as HTMLInputElement;
    const distanceCheckbox = document.getElementById(
      'distance'
    ) as HTMLInputElement;

    if (classroomCheckbox && distanceCheckbox && deliveryMethods) {
      classroomCheckbox.checked = deliveryMethods.classroom;
      distanceCheckbox.checked = deliveryMethods.distance;
    }
  }

  private setScheduledDates(dates?: ScheduledDate[]): void {
    const container = document.getElementById('scheduledDatesContainer');
    if (!container || !dates?.length) return;

    container.innerHTML = '';
    dates.forEach((date) => {
      const dateGroup = this.createScheduledDateGroup();
      this.populateDateGroup(dateGroup, date);
      container.appendChild(dateGroup);
    });
  }

  private createScheduledDateGroup(): HTMLDivElement {
    const group = document.createElement('div');
    group.className = 'scheduled-date-group';
    group.innerHTML = `
      <div class="date-inputs">
        <label>Start Date:
          <input type="date" name="startDate" required>
        </label>
        <label>Format:
          <select name="format" required>
            <option value="classroom">Classroom</option>
            <option value="distance">Distance</option>
          </select>
        </label>
        <label>Available Seats:
          <input type="number" name="availableSeats" min="0" required>
        </label>
        <button type="button" class="btn btn-danger remove-date">Remove</button>
      </div>
    `;

    const removeButton = group.querySelector('.remove-date');
    removeButton?.addEventListener('click', () => group.remove());

    return group;
  }

  private populateDateGroup(group: HTMLDivElement, date: ScheduledDate): void {
    const startDateInput = group.querySelector(
      'input[type="date"]'
    ) as HTMLInputElement;
    const formatSelect = group.querySelector('select') as HTMLSelectElement;
    const seatsInput = group.querySelector(
      'input[type="number"]'
    ) as HTMLInputElement;

    if (startDateInput) startDateInput.value = date.startDate;
    if (formatSelect) formatSelect.value = date.format;
    if (seatsInput) seatsInput.value = date.availableSeats.toString();
  }
}
