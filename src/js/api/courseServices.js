// src/js/api/courseServices.js

// src/js/api/courseServices.js
const BASE_URL = 'http://localhost:3000';

export async function getCourses() {
  try {
    const response = await fetch(`${BASE_URL}/courses`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
}

// Function to fetch a single course by ID
export async function getCourseById(id) {
  try {
    const response = await fetch(`${BASE_URL}/courses/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
}
