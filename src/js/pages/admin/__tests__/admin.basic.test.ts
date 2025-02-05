import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AdminPage } from '../index.js';
import { CourseService } from '../courseService.js';

// Mock dependencies
vi.mock('../courseService.js');
vi.mock('../notificationManager.js');

describe('AdminPage Basic Tests', () => {
  let adminPage: AdminPage;

  beforeEach(() => {
    // Setup minimal DOM
    document.body.innerHTML = `
      <div id="warningModal">
        <button id="acknowledgeBtn"></button>
      </div>
      <div id="courseList"></div>
      <div id="courseDetails"></div>
      <div id="courseFormModal">
        <form id="courseForm"></form>
      </div>
      <div id="courseDetailsPanel"></div>
      <div id="notificationContainer"></div>
    `;

    // Mock CourseService methods
    vi.mocked(CourseService.prototype.fetchCourses).mockResolvedValue([]);

    adminPage = new AdminPage();
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('should initialize correctly', () => {
    expect(adminPage).toBeDefined();
    expect(document.querySelector('#courseList')).toBeDefined();
    expect(document.querySelector('#courseForm')).toBeDefined();
  });

  it('should show warning modal on initialization', () => {
    const warningModal = document.getElementById('warningModal');
    expect(warningModal?.style.display).toBe('block');
  });
});
