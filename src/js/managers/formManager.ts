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
}
