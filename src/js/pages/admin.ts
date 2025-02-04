import { CourseService } from '../services/courseService.js';
import { NotificationManager } from '../utils/notificationManager.js';
import { FormManager } from '../managers/formManager.js';
import { UIManager } from '../managers/uiManager.js';
import type { Course } from '../types/course';

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
      console.error('Initialization failed:', error);
      this.notificationManager.show('error', 'Failed to initialize admin page');
    }
  }

  private setupEventListeners(): void {
    this.setupModalControls();
    this.setupFormSubmission();
    this.setupRefreshButton();
  }

  private setupModalControls(): void {
    const createButton = document.getElementById('createCourseBtn');
    const closeButton = this.modal.querySelector('.close-button');
    const cancelButton = document.getElementById('cancelButton');

    createButton?.addEventListener('click', () =>
      this.uiManager.showModal(false)
    );
    closeButton?.addEventListener('click', () => this.uiManager.hideModal());
    cancelButton?.addEventListener('click', () => this.uiManager.hideModal());
  }

  private setupFormSubmission(): void {
    this.form.addEventListener('submit', (e: SubmitEvent) =>
      this.handleFormSubmit(e)
    );
  }

  private setupRefreshButton(): void {
    const refreshButton = document.getElementById('refreshButton');
    refreshButton?.addEventListener('click', () => this.loadCourses());
  }

  private async handleFormSubmit(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    try {
      const courseData = this.formManager.getFormData();

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

  private async loadCourses(): Promise<void> {
    try {
      const courses = await this.courseService.fetchCourses();
      this.uiManager.renderCourses(courses, {
        onEdit: (id) => this.handleEdit(id),
        onDelete: (id) => this.handleDelete(id),
      });
    } catch (error) {
      console.error('Error loading courses:', error);
      this.notificationManager.show('error', 'Failed to load courses');
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
}

// Initialize only in browser environment
if (typeof window !== 'undefined') {
  try {
    new AdminPage();
  } catch (error) {
    console.error('Failed to initialize AdminPage:', error);
  }
}
