// src/js/api/courseServices.js
const apiUrl = 'http://localhost:3000';

export async function getCourses() {
  const response = await fetch(`${apiUrl}/courses`);
  if (!response.ok) throw new Error('Failed to fetch courses');
  return response.json();
}

export async function checkExistingBooking(userId, courseId) {
  const response = await fetch(
    `${apiUrl}/bookings?userId=${userId}&courseId=${courseId}`
  );
  const bookings = await response.json();
  return bookings.length > 0;
}

export async function getCourseById(id) {
  const response = await fetch(`${apiUrl}/courses/${id}`);
  if (!response.ok) throw new Error('Course not found');
  return response.json();
}

export async function createBooking(bookingData) {
  const hasBooking = await checkExistingBooking(
    bookingData.userId,
    bookingData.courseId
  );
  if (hasBooking) {
    throw new Error('You have already booked this course');
  }

  const response = await fetch(`${apiUrl}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) throw new Error('Failed to create booking');
  return response.json();
}

export async function cancelBooking(bookingId, courseId) {
  // Get course first to update seats
  const course = await getCourseById(courseId);
  const booking = await getBookingById(bookingId);

  // Delete booking
  const response = await fetch(`${apiUrl}/bookings/${bookingId}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Failed to cancel booking');

  // Update available seats
  const sessionIndex = course.scheduledDates.findIndex(
    (date) => date.startDate === booking.sessionDate
  );

  if (sessionIndex !== -1) {
    course.scheduledDates[sessionIndex].availableSeats++;
    await updateCourseSeats(courseId, course);
  }
}

export async function getBookingById(id) {
  const response = await fetch(`${apiUrl}/bookings/${id}`);
  if (!response.ok) throw new Error('Booking not found');
  return response.json();
}

export async function updateCourseSeats(id, courseData) {
  const response = await fetch(`${apiUrl}/courses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseData),
  });

  if (!response.ok) throw new Error('Failed to update course');
  return response.json();
}

export async function getUserBookings(userId) {
  const response = await fetch(`${apiUrl}/bookings?userId=${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user bookings');
  return response.json();
}
