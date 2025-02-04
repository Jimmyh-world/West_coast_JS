import { CourseService } from '../services/courseService.js';
import { NotificationManager } from '../utils/notificationManager.js';
import { FormManager } from '../managers/formManager.js';
import { UIManager } from '../managers/uiManager.js';
export class AdminPage {
    constructor() {
        this.currentCourseId = null;
        const elements = this.initializeElements();
        this.modal = elements.modal;
        this.form = elements.form;
        this.formManager = new FormManager(elements.form);
        this.uiManager = new UIManager(elements.modal, elements.courseList);
        this.courseService = new CourseService();
        this.notificationManager = new NotificationManager();
        this.initialize();
    }
    initializeElements() {
        const courseList = document.getElementById('courseList');
        const modal = document.getElementById('courseFormModal');
        const form = document.getElementById('courseForm');
        if (!courseList || !modal || !form) {
            throw new Error('Required DOM elements not found');
        }
        return { courseList, modal, form };
    }
    async initialize() {
        try {
            await this.loadCourses();
            this.setupEventListeners();
        }
        catch (error) {
            console.error('Initialization failed:', error);
            this.notificationManager.show('error', 'Failed to initialize admin page');
        }
    }
    setupEventListeners() {
        this.setupModalControls();
        this.setupFormSubmission();
        this.setupRefreshButton();
    }
    setupModalControls() {
        const createButton = document.getElementById('createCourseBtn');
        const closeButton = this.modal.querySelector('.close-button');
        const cancelButton = document.getElementById('cancelButton');
        createButton?.addEventListener('click', () => this.uiManager.showModal(false));
        closeButton?.addEventListener('click', () => this.uiManager.hideModal());
        cancelButton?.addEventListener('click', () => this.uiManager.hideModal());
    }
    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }
    setupRefreshButton() {
        const refreshButton = document.getElementById('refreshButton');
        refreshButton?.addEventListener('click', () => this.loadCourses());
    }
    async handleFormSubmit(e) {
        e.preventDefault();
        try {
            const courseData = this.formManager.getFormData();
            if (this.currentCourseId) {
                await this.courseService.updateCourse(this.currentCourseId, courseData);
                this.notificationManager.show('success', 'Course updated successfully');
            }
            else {
                await this.courseService.createCourse(courseData);
                this.notificationManager.show('success', 'Course created successfully');
            }
            this.uiManager.hideModal();
            await this.loadCourses();
        }
        catch (error) {
            console.error('Error saving course:', error);
            this.notificationManager.show('error', 'Failed to save course');
        }
    }
    async loadCourses() {
        try {
            const courses = await this.courseService.fetchCourses();
            this.uiManager.renderCourses(courses, {
                onEdit: (id) => this.handleEdit(id),
                onDelete: (id) => this.handleDelete(id),
            });
        }
        catch (error) {
            console.error('Error loading courses:', error);
            this.notificationManager.show('error', 'Failed to load courses');
        }
    }
    async handleEdit(courseId) {
        this.currentCourseId = courseId;
        this.uiManager.showModal(true);
        await this.loadCourseData(courseId);
    }
    async handleDelete(courseId) {
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
    }
    async loadCourseData(courseId) {
        try {
            const course = await this.courseService.fetchCourse(courseId);
            this.formManager.populateForm(course);
        }
        catch (error) {
            console.error('Error loading course data:', error);
            this.notificationManager.show('error', 'Failed to load course data');
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