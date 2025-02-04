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
}
//# sourceMappingURL=formManager.js.map