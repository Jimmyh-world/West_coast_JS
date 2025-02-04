import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Course } from '../../types/course';
import { AdminPage } from '../admin';

describe('AdminPage Edit Functionality', () => {
  let adminPage: AdminPage;
  const mockCourse: Course = {
    id: '1',
    title: 'Modern Web Development',
    tagLine: 'Kick start your career',
    discription: 'Lorem ipsum dolor sit amet',
    courseNumber: 'WD101',
    durationDays: 20,
    keyWords: 'HTML, CSS, Javascript, frontend, backend, react',
    deliveryMethods: {
      classroom: true,
      distance: false,
    },
    image: 'modernweb.webp',
    scheduledDates: [
      {
        startDate: '2025-02-15',
        format: 'classroom',
        availableSeats: 13,
      },
    ],
  };

  beforeEach(() => {
    // Setup DOM elements needed for testing
    document.body.innerHTML = `
            <div id="courseList"></div>
            <div id="courseFormModal">
                <form id="courseForm">
                    <input type="text" name="title" id="title" />
                    <input type="text" name="tagLine" id="tagLine" />
                    <textarea name="description" id="description"></textarea>
                    <input type="text" name="courseNumber" id="courseNumber" />
                    <input type="number" name="durationDays" id="durationDays" />
                    <input type="text" name="keyWords" id="keyWords" />
                    <input type="text" name="image" id="image" />
                    <input type="checkbox" id="classroom" name="deliveryMethods.classroom" />
                    <input type="checkbox" id="distance" name="deliveryMethods.distance" />
                    <div id="scheduledDatesContainer"></div>
                </form>
            </div>
        `;

    adminPage = new AdminPage();
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('should correctly load existing course data into form', async () => {
    // Mock fetch response
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCourse),
    });

    // Call loadCourseData
    await adminPage['loadCourseData']('1');

    // Get form elements with proper typing
    const titleInput = document.getElementById('title') as HTMLInputElement;
    const tagLineInput = document.getElementById('tagLine') as HTMLInputElement;
    const descriptionInput = document.getElementById(
      'description'
    ) as HTMLTextAreaElement;
    const courseNumberInput = document.getElementById(
      'courseNumber'
    ) as HTMLInputElement;
    const durationDaysInput = document.getElementById(
      'durationDays'
    ) as HTMLInputElement;
    const keyWordsInput = document.getElementById(
      'keyWords'
    ) as HTMLInputElement;
    const imageInput = document.getElementById('image') as HTMLInputElement;
    const classroomCheckbox = document.getElementById(
      'classroom'
    ) as HTMLInputElement;
    const distanceCheckbox = document.getElementById(
      'distance'
    ) as HTMLInputElement;

    // Assert form fields are populated correctly
    expect(titleInput?.value).toBe(mockCourse.title);
    expect(tagLineInput?.value).toBe(mockCourse.tagLine);
    expect(descriptionInput?.value).toBe(mockCourse.discription);
    expect(courseNumberInput?.value).toBe(mockCourse.courseNumber);
    expect(durationDaysInput?.value).toBe(mockCourse.durationDays.toString());
    expect(keyWordsInput?.value).toBe(mockCourse.keyWords);
    expect(imageInput?.value).toBe(mockCourse.image);
    expect(classroomCheckbox?.checked).toBe(
      mockCourse.deliveryMethods.classroom
    );
    expect(distanceCheckbox?.checked).toBe(mockCourse.deliveryMethods.distance);
  });

  it('should successfully update course in database', async () => {
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCourse),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({ ...mockCourse, title: 'Updated Title' }),
        })
      );

    global.fetch = fetchMock;

    // Load initial course data
    await adminPage['loadCourseData']('1');

    // Update form field
    const titleInput = document.getElementById('title') as HTMLInputElement;
    if (titleInput) {
      titleInput.value = 'Updated Title';
    }

    // Submit form
    const form = document.getElementById('courseForm') as HTMLFormElement;
    if (form) {
      const submitEvent = new Event('submit');
      form.dispatchEvent(submitEvent);
    }

    // Wait for async operations
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Assert PUT request was made with correct data
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const putCall = fetchMock.mock.calls[1];
    expect(putCall[0]).toContain('/courses/1');
    expect(putCall[1].method).toBe('PUT');

    const sentData = JSON.parse(putCall[1].body);
    expect(sentData.title).toBe('Updated Title');
  });
});
