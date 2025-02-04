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

  constructor() {
    const elements = this.initializeElements();
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

  private async handleFormSubmit(e: Event): Promise<void> {
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
}

// Initialize only in browser environment
if (typeof window !== 'undefined') {
  try {
    new AdminPage();
  } catch (error) {
    console.error('Failed to initialize AdminPage:', error);
  }
}
