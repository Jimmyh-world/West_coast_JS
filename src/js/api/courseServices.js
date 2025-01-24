// src/js/api/courseServices.js

const BASE_URL = 'http://localhost:3000';

// Main function to fetch all courses
export async function getCourses() {
  try {
    console.log('Fetching courses from:', `${BASE_URL}/courses`); // Debug log

    const response = await fetch(`${BASE_URL}/courses`);
    console.log('Response status:', response.status); // Debug log

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched data:', data); // Debug log
    return data;
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
