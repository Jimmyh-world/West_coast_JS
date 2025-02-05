console.log('Admin Page Module Loaded');

import { CourseService } from './courseService.js';
import { NotificationManager } from './notificationManager.js';
import { FormManager } from './formManager.js';
import { UIManager } from './uiManager.js';
import type { Course, Booking, User, EnrolledStudent } from './types.js';
import API_CONFIG, { getApiUrl } from './constants.js';

export class AdminPage {
  private currentCourseId: string | null = null;
  private formManager: FormManager;
  private uiManager: UIManager;
  private courseService: CourseService;
  private notificationManager: NotificationManager;
  private modal: HTMLElement;
  private form: HTMLFormElement;

  constructor() {
    // Show warning first
    this.showWarningModal();

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

  private async loadCourseData(courseId: string): Promise<Course> {
    try {
      const courseResponse = await fetch(`${getApiUrl('COURSES')}/${courseId}`);
      const course = (await courseResponse.json()) as Course;

      const bookingsResponse = await fetch(
        `${getApiUrl('BOOKINGS')}?courseId=${courseId}`
      );
      const bookings = (await bookingsResponse.json()) as Booking[];

      const usersResponse = await fetch(getApiUrl('USERS'));
      const users = (await usersResponse.json()) as User[];

      const enrolledStudents = bookings
        .filter((booking: Booking) => booking.status === 'confirmed')
        .map((booking: Booking) => {
          const user = users.find((u: User) => u.id === booking.userId);
          return {
            studentName: user?.name || 'Unknown',
            email: user?.email || 'No email',
            format: booking.format,
            enrolledDate: booking.bookingDate,
            phoneNumber: user?.phone,
          } as EnrolledStudent;
        });

      return {
        ...course,
        enrolledStudents,
      };
    } catch (error) {
      throw new Error(`Failed to load course data: ${error}`);
    }
  }

  private async handleEdit(courseId: string): Promise<void> {
    try {
      const courseData = await this.loadCourseData(courseId);
      this.formManager.populateForm(courseData);
      this.modal.style.display = 'block';
    } catch (error) {
      console.error('Error handling edit:', error);
    }
  }

  private async handleViewDetails(courseId: string): Promise<void> {
    try {
      const courseData = await this.loadCourseData(courseId);
      this.uiManager.renderCourseDetails(courseData);
    } catch (error) {
      console.error('Error handling view details:', error);
    }
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

  private showWarningModal(): void {
    const modal = document.getElementById('warningModal') as HTMLElement;
    const acknowledgeBtn = document.getElementById(
      'acknowledgeBtn'
    ) as HTMLElement;

    // Show modal
    modal.style.display = 'block';

    // Close modal when button is clicked
    acknowledgeBtn.onclick = () => {
      modal.style.display = 'none';
    };
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
