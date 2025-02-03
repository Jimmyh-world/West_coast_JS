/**
 * Course Management Service
 *
 * Handles all course-related operations:
 * - Course information retrieval
 * - Booking management
 * - Seat availability tracking
 * - Booking cancellation
 *
 * Dependencies:
 * - Requires JSON server running on localhost:3000
 * - Expects courses and bookings endpoints
 * - Requires proper data structure for courses and sessions
 *
 * @module courseServices
 */

const API_URL = 'http://localhost:3000';

export async function getCourses() {
  const response = await fetch(`${API_URL}/courses`);
  if (!response.ok) throw new Error('Failed to fetch courses');
  return response.json();
}

export async function getCourseById(id) {
  const response = await fetch(`${API_URL}/courses/${id}`);
  if (!response.ok) throw new Error('Course not found');
  return response.json();
}

export async function getBookingById(id) {
  const response = await fetch(`${API_URL}/bookings/${id}`);
  if (!response.ok) throw new Error('Booking not found');
  return response.json();
}

export async function getUserBookings(userId) {
  const response = await fetch(`${API_URL}/bookings?userId=${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user bookings');
  return response.json();
}

export async function checkExistingBooking(userId, courseId) {
  const response = await fetch(
    `${API_URL}/bookings?userId=${userId}&courseId=${courseId}`
  );
  const bookings = await response.json();
  return bookings.length > 0;
}

export async function createBooking(bookingData) {
  const hasBooking = await checkExistingBooking(
    bookingData.userId,
    bookingData.courseId
  );

  if (hasBooking) throw new Error('You have already booked this course');

  const response = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) throw new Error('Failed to create booking');
  return response.json();
}

export async function updateCourseSeats(id, courseData) {
  const response = await fetch(`${API_URL}/courses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseData),
  });

  if (!response.ok) throw new Error('Failed to update course');
  return response.json();
}

export async function cancelBooking(bookingId, courseId) {
  try {
    const [course, booking] = await Promise.all([
      getCourseById(courseId),
      getBookingById(bookingId),
    ]);

    const deleteResponse = await fetch(`${API_URL}/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!deleteResponse.ok) {
      throw new Error(`Failed to cancel booking: ${deleteResponse.status}`);
    }

    const sessionIndex = course.scheduledDates.findIndex(
      (date) => date.startDate === booking.sessionDate
    );

    if (sessionIndex !== -1) {
      course.scheduledDates[sessionIndex].availableSeats++;
      await updateCourseSeats(courseId, course);
    }

    return true;
  } catch (error) {
    console.error('Error canceling booking:', error);
    throw new Error('Failed to cancel booking: ' + error.message);
  }
}
