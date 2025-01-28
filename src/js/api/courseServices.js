// src/js/api/courseServices.js
import { apiClient } from './apiClient.js';

export async function getCourses() {
  return apiClient.getCourses();
}

export async function getCourseById(id) {
  return apiClient.getCourseById(id);
}

export async function createCourse(courseData) {
  return apiClient.createCourse(courseData);
}

export async function updateCourse(id, courseData) {
  return apiClient.updateCourse(id, courseData);
}

export async function deleteCourse(id) {
  return apiClient.deleteCourse(id);
}
