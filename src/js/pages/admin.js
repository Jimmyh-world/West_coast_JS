import { CourseService } from '../services/courseService.js';
import { NotificationManager } from '../utils/notificationManager.js';
export class AdminPage {
    constructor() {
        this.currentCourseId = null;
        const courseList = document.getElementById('courseList');
        const modal = document.getElementById('courseFormModal');
        const form = document.getElementById('courseForm');
        if (!courseList || !modal || !form) {
            throw new Error('Required DOM elements not found');
        }
        this.courseListElement = courseList;
        this.modal = modal;
        this.courseForm = form;
        this.courseService = new CourseService();
        this.notificationManager = new NotificationManager();
        this.initialize();
    }
    async initialize() {
        try {
            await this.loadCourses();
            this.setupEventListeners();
            this.initializeAddDateButton();
        }
        catch (error) {
            console.error('Initialization failed:', error);
            this.notificationManager.show('error', 'Failed to initialize admin page');
        }
    }
    setupEventListeners() {
        // Create Course button
        const createButton = document.getElementById('createCourseBtn');
        if (createButton) {
            createButton.addEventListener('click', () => this.showModal());
        }
        // Modal close button
        const closeButton = this.modal.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.hideModal());
        }
        // Cancel button
        const cancelButton = document.getElementById('cancelButton');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => this.hideModal());
        }
        // Form submission
        this.courseForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        // Refresh button - Fixed ID
        const refreshButton = document.getElementById('refreshButton');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => this.loadCourses());
        }
    }
    async loadCourses() {
        try {
            const courses = await this.courseService.fetchCourses();
            this.renderCourses(courses);
        }
        catch (error) {
            console.error('Error loading courses:', error);
            this.notificationManager.show('error', 'Failed to load courses');
        }
    }
    async loadCourseData(courseId) {
        try {
            const course = await this.courseService.fetchCourse(courseId);
            if (!this.courseForm)
                return;
            // Basic fields with explicit string type
            const fields = [
                'title',
                'tagLine',
                'courseNumber',
                'durationDays',
                'keyWords',
                'image',
            ]; // Make this a readonly tuple
            fields.forEach((field) => {
                const input = this.courseForm.elements.namedItem(field);
                if (input && course[field] !== undefined) {
                    // Convert any value to string for input
                    input.value = String(course[field]);
                }
            });
            // Handle description/discription mapping
            const descriptionInput = this.courseForm.elements.namedItem('description');
            if (descriptionInput) {
                descriptionInput.value = course.discription || '';
            }
            // Delivery Methods
            const classroomCheckbox = this.courseForm.elements.namedItem('deliveryMethods.classroom');
            const distanceCheckbox = this.courseForm.elements.namedItem('deliveryMethods.distance');
            if (classroomCheckbox && distanceCheckbox && course.deliveryMethods) {
                classroomCheckbox.checked = course.deliveryMethods.classroom;
                distanceCheckbox.checked = course.deliveryMethods.distance;
            }
            // Scheduled Dates
            const datesContainer = document.getElementById('scheduledDatesContainer');
            if (datesContainer && course.scheduledDates?.length > 0) {
                datesContainer.innerHTML = '';
                course.scheduledDates.forEach((date, idx) => {
                    const dateGroup = this.createScheduledDateGroup(idx);
                    const startDateInput = dateGroup.querySelector('input[type="date"]');
                    const formatSelect = dateGroup.querySelector('select');
                    const seatsInput = dateGroup.querySelector('input[type="number"]');
                    if (startDateInput)
                        startDateInput.value = date.startDate;
                    if (formatSelect)
                        formatSelect.value = date.format;
                    if (seatsInput)
                        seatsInput.value = date.availableSeats.toString();
                    datesContainer.appendChild(dateGroup);
                });
            }
        }
        catch (error) {
            console.error('Error loading course data:', error);
            this.notificationManager.show('error', 'Failed to load course data');
        }
    }
    renderScheduledDates(dates) {
        const container = document.getElementById('scheduledDatesContainer');
        if (!container)
            return;
        container.innerHTML = '';
        if (!dates || !Array.isArray(dates)) {
            console.warn('No scheduled dates or invalid dates format');
            return;
        }
        dates.forEach((date, index) => {
            const dateGroup = this.createScheduledDateGroup(index);
            if (!dateGroup)
                return;
            // Populate the date group with existing data
            const startDateInput = dateGroup.querySelector('[name^="startDate"]');
            const formatSelect = dateGroup.querySelector('[name^="format"]');
            const seatsInput = dateGroup.querySelector('[name^="availableSeats"]');
            if (startDateInput)
                startDateInput.value = date.startDate || '';
            if (formatSelect)
                formatSelect.value = date.format || 'classroom';
            if (seatsInput)
                seatsInput.value = date.availableSeats?.toString() || '0';
            container.appendChild(dateGroup);
        });
    }
    createScheduledDateGroup(index) {
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
        if (removeButton) {
            removeButton.addEventListener('click', () => group.remove());
        }
        return group;
    }
    async handleFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(this.courseForm);
        try {
            const courseData = {
                title: String(formData.get('title') ?? ''),
                tagLine: String(formData.get('tagLine') ?? ''),
                courseNumber: String(formData.get('courseNumber') ?? ''),
                discription: String(formData.get('description') ?? ''),
                durationDays: Number(formData.get('durationDays') ?? 0),
                keyWords: String(formData.get('keyWords') ?? ''),
                image: String(formData.get('image') ?? 'default.jpg'),
                deliveryMethods: {
                    classroom: Boolean(document.getElementById('classroom')?.checked),
                    distance: Boolean(document.getElementById('distance')?.checked),
                },
                scheduledDates: this.getScheduledDatesFromForm(),
            };
            if (this.currentCourseId) {
                await this.courseService.updateCourse(this.currentCourseId, courseData);
                this.notificationManager.show('success', 'Course updated successfully');
            }
            else {
                await this.courseService.createCourse(courseData);
                this.notificationManager.show('success', 'Course created successfully');
            }
            this.hideModal();
            await this.loadCourses();
        }
        catch (error) {
            console.error('Error saving course:', error);
            this.notificationManager.show('error', 'Failed to save course');
        }
    }
    getScheduledDatesFromForm() {
        const dates = [];
        const container = document.getElementById('scheduledDatesContainer');
        if (!container)
            return dates;
        const dateGroups = container.querySelectorAll('.scheduled-date-group');
        dateGroups.forEach((group) => {
            const startDateInput = group.querySelector('input[type="date"]');
            const formatSelect = group.querySelector('select');
            const seatsInput = group.querySelector('input[type="number"]');
            if (startDateInput?.value && formatSelect?.value && seatsInput?.value) {
                dates.push({
                    startDate: startDateInput.value,
                    format: formatSelect.value,
                    availableSeats: parseInt(seatsInput.value, 10),
                });
            }
        });
        return dates;
    }
    showNotification(type, message) {
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
    showModal(courseId) {
        this.currentCourseId = courseId || null;
        if (!this.modal)
            return;
        const modalTitle = document.getElementById('modalTitle');
        if (modalTitle) {
            modalTitle.textContent = courseId ? 'Edit Course' : 'Create New Course';
        }
        if (courseId) {
            this.loadCourseData(courseId);
        }
        else {
            this.courseForm.reset();
        }
        this.modal.classList.add('active');
    }
    hideModal() {
        this.modal.classList.remove('active');
        this.courseForm.reset();
        this.currentCourseId = null;
    }
    renderCourses(courses) {
        this.courseListElement.innerHTML = '';
        if (!courses.length) {
            this.courseListElement.innerHTML = '<p>No courses found</p>';
            return;
        }
        courses.forEach((course) => {
            const courseElement = document.createElement('div');
            courseElement.className = 'course-card';
            // Ensure course.id exists and is a string
            const courseId = course.id?.toString() || '';
            courseElement.innerHTML = `
        <div class="course-content">
          <h3>${course.title || 'Untitled Course'}</h3>
          <div class="course-info">
            <p>Course Number: ${course.courseNumber || 'N/A'}</p>
            <p>Duration: ${course.durationDays || 0} days</p>
            <p>Enrollment: ${course.scheduledDates?.[0]?.availableSeats || 0}</p>
            <p>Status: Active</p>
          </div>
        </div>
        <div class="card-actions">
          <button class="btn btn-secondary edit" data-course-id="${courseId}">Edit</button>
          <button class="btn btn-danger delete" data-course-id="${courseId}">Delete</button>
        </div>
      `;
            const editBtn = courseElement.querySelector('.edit');
            if (editBtn && courseId) {
                editBtn.addEventListener('click', () => this.showModal(courseId));
            }
            const deleteBtn = courseElement.querySelector('.delete');
            if (deleteBtn && courseId) {
                deleteBtn.addEventListener('click', async () => {
                    if (confirm('Are you sure you want to delete this course?')) {
                        try {
                            await this.courseService.deleteCourse(courseId);
                            await this.loadCourses();
                            this.notificationManager.show('success', 'Course deleted successfully');
                        }
                        catch (error) {
                            console.error('Error deleting course:', error);
                            this.notificationManager.show('error', 'Failed to delete course');
                        }
                    }
                });
            }
            this.courseListElement.appendChild(courseElement);
        });
    }
    // Add date button handler
    initializeAddDateButton() {
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
// Initialize only in browser environment
if (typeof window !== 'undefined') {
    try {
        new AdminPage();
    }
    catch (error) {
        console.error('Failed to initialize AdminPage:', error);
    }
}
//# sourceMappingURL=admin.js.map