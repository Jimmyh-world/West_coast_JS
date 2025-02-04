export class FormManager {
    constructor(form) {
        this.form = form;
    }
    getFormData() {
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
    getDeliveryMethods() {
        return {
            classroom: Boolean(document.getElementById('classroom')?.checked),
            distance: Boolean(document.getElementById('distance')?.checked),
        };
    }
    getScheduledDates() {
        const container = document.getElementById('scheduledDatesContainer');
        if (!container)
            return [];
        return Array.from(container.querySelectorAll('.scheduled-date-group'))
            .map((group) => {
            const startDate = group.querySelector('input[type="date"]')?.value;
            const format = group.querySelector('select')
                ?.value;
            const seats = group.querySelector('input[type="number"]')?.value;
            return startDate && format && seats
                ? {
                    startDate,
                    format: format,
                    availableSeats: parseInt(seats, 10),
                }
                : null;
        })
            .filter((date) => date !== null);
    }
    populateForm(course) {
        const fields = [
            'title',
            'tagLine',
            'courseNumber',
            'durationDays',
            'keyWords',
            'image',
        ];
        fields.forEach((field) => {
            const input = this.form.elements.namedItem(field);
            if (input && course[field] !== undefined) {
                input.value = String(course[field]);
            }
        });
        // Handle description/discription mapping
        const descriptionInput = this.form.elements.namedItem('description');
        if (descriptionInput) {
            descriptionInput.value = course.discription || '';
        }
        // Delivery Methods
        this.setDeliveryMethods(course.deliveryMethods);
        // Scheduled Dates
        this.setScheduledDates(course.scheduledDates);
    }
    setDeliveryMethods(deliveryMethods) {
        const classroomCheckbox = document.getElementById('classroom');
        const distanceCheckbox = document.getElementById('distance');
        if (classroomCheckbox && distanceCheckbox && deliveryMethods) {
            classroomCheckbox.checked = deliveryMethods.classroom;
            distanceCheckbox.checked = deliveryMethods.distance;
        }
    }
    setScheduledDates(dates) {
        const container = document.getElementById('scheduledDatesContainer');
        if (!container || !dates?.length)
            return;
        container.innerHTML = '';
        dates.forEach((date) => {
            const dateGroup = this.createScheduledDateGroup();
            this.populateDateGroup(dateGroup, date);
            container.appendChild(dateGroup);
        });
    }
    createScheduledDateGroup() {
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
    populateDateGroup(group, date) {
        const startDateInput = group.querySelector('input[type="date"]');
        const formatSelect = group.querySelector('select');
        const seatsInput = group.querySelector('input[type="number"]');
        if (startDateInput)
            startDateInput.value = date.startDate;
        if (formatSelect)
            formatSelect.value = date.format;
        if (seatsInput)
            seatsInput.value = date.availableSeats.toString();
    }
}
//# sourceMappingURL=formManager.js.map