import { CourseService } from './courseService.js';
import { NotificationManager } from './notificationManager.js';
import { FormManager } from './formManager.js';
import { UIManager } from './uiManager.js';
import type { Course } from './types.js';

export class AdminPage {
  private currentCourseId: string | null = null;
  private formManager: FormManager;
  private uiManager: UIManager;
  private courseService: CourseService;
  private notificationManager: NotificationManager;
  private modal: HTMLElement;
  private form: HTMLFormElement;

  constructor() {
    const elements = this.initializeElements();
    this.modal = elements.modal;
    this.form = elements.form;
    this.formManager = new FormManager(elements.form);
    this.uiManager = new UIManager(elements.modal, elements.courseList);
    this.courseService = new CourseService();
    this.notificationManager = new NotificationManager();

    this.initialize();
  }

  private initializeElements() {
    const courseList = document.getElementById('courseList');
    const modal = document.getElementById('courseFormModal');
    const form = document.getElementById('courseForm') as HTMLFormElement;

    if (!courseList || !modal || !form) {
      throw new Error('Required DOM elements not found');
    }

    return { courseList, modal, form };
  }

  private async initialize(): Promise<void> {
    try {
      await this.loadCourses();
      this.setupEventListeners();
    } catch (error) {
      console.error('Error initializing admin page:', error);
      this.notificationManager.show('error', 'Failed to initialize admin page');
    }
  }

  private setupEventListeners(): void {
    this.setupModalControls();
    this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));

    // Add refresh button handler
    const refreshButton = document.getElementById('refreshButton');
    if (refreshButton) {
      refreshButton.addEventListener('click', () => this.loadCourses());
    }
  }

  private setupModalControls(): void {
    const createButton = document.getElementById('createCourseBtn');
    const closeButton = this.modal.querySelector('.close-button');
    const cancelButton = document.getElementById('cancelButton');

    createButton?.addEventListener('click', () => {
      this.currentCourseId = null;
      this.form.reset();
      const dateContainer = this.form.querySelector('#scheduledDatesContainer');
      if (dateContainer) dateContainer.innerHTML = '';
      const modalTitle = this.modal.querySelector('#modalTitle');
      if (modalTitle) modalTitle.textContent = 'Create New Course';
      this.uiManager.showModal(false);
    });

    closeButton?.addEventListener('click', () => this.uiManager.hideModal());
    cancelButton?.addEventListener('click', () => this.uiManager.hideModal());
  }

  private async loadCourses(): Promise<void> {
    try {
      const courses = await this.courseService.fetchCourses();
      this.uiManager.renderCourses(courses, {
        onEdit: (id) => this.handleEdit(id),
        onDelete: (id) => this.handleDelete(id),
        onViewDetails: (id) => this.handleViewDetails(id),
      });
    } catch (error) {
      console.error('Error loading courses:', error);
      this.notificationManager.show('error', 'Failed to load courses');
    }
  }

  private async handleViewDetails(courseId: string): Promise<void> {
    try {
      const course = await this.courseService.fetchCourse(courseId);
      this.uiManager.renderCourseDetails(course);
    } catch (error) {
      console.error('Error loading course details:', error);
      this.notificationManager.show('error', 'Failed to load course details');
    }
  }

  private async handleEdit(courseId: string): Promise<void> {
    this.currentCourseId = courseId;
    this.uiManager.showModal(true);
    await this.loadCourseData(courseId);
  }

  private async handleDelete(courseId: string): Promise<void> {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        await this.courseService.deleteCourse(courseId);
        await this.loadCourses();
        this.notificationManager.show('success', 'Course deleted successfully');
      } catch (error) {
        console.error('Error deleting course:', error);
        this.notificationManager.show('error', 'Failed to delete course');
      }
    }
  }

  private async loadCourseData(courseId: string): Promise<void> {
    try {
      const course = await this.courseService.fetchCourse(courseId);
      this.formManager.populateForm(course);
    } catch (error) {
      console.error('Error loading course data:', error);
      this.notificationManager.show('error', 'Failed to load course data');
    }
  }

  private async handleFormSubmit(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    try {
      const courseData: Course = this.formManager.getFormData();

      if (this.currentCourseId) {
        await this.courseService.updateCourse(this.currentCourseId, courseData);
        this.notificationManager.show('success', 'Course updated successfully');
      } else {
        await this.courseService.createCourse(courseData);
        this.notificationManager.show('success', 'Course created successfully');
      }

      this.uiManager.hideModal();
      await this.loadCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      this.notificationManager.show('error', 'Failed to save course');
    }
  }
}

// Initialize only in browser environment
if (typeof window !== 'undefined') {
  try {
    const adminPage = new AdminPage();
    Object.assign(window, { adminPage });
  } catch (error) {
    console.error('Failed to initialize AdminPage:', error);
  }
}
