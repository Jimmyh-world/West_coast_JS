import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AdminPage } from '../index.js';
import { CourseService } from '../courseService.js';

// Mock dependencies
vi.mock('../courseService.js');

describe('AdminPage Form Tests', () => {
  let adminPage: AdminPage;

  beforeEach(() => {
    // Setup minimal form DOM
    document.body.innerHTML = `
      <div id="warningModal" style="display: none;">
        <button id="acknowledgeBtn"></button>
      </div>
      <div id="courseList"></div>
      <div id="courseDetails"></div>
      <div id="courseFormModal">
        <form id="courseForm">
          <input name="title" />
          <input name="description" />
          <input name="courseNumber" />
          <input name="duration" type="number" />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div id="courseDetailsPanel"></div>
      <div id="notificationContainer"></div>
    `;

    adminPage = new AdminPage();
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('should validate required fields on form submission', async () => {
    const form = document.querySelector('#courseForm') as HTMLFormElement;
    const submitEvent = new Event('submit');
    form.dispatchEvent(submitEvent);

    await vi.waitFor(() => {
      expect(CourseService.prototype.createCourse).not.toHaveBeenCalled();
    });
  });
});
