import { CourseService } from '../services/courseService.js';
import { NotificationManager } from '../utils/notificationManager.js';
import { FormManager } from '../managers/formManager.js';
import { UIManager } from '../managers/uiManager.js';
export class AdminPage {
    constructor() {
        this.currentCourseId = null;
        const elements = this.initializeElements();
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