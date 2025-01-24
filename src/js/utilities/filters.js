// Handles course filtering and search functionality
export const filters = {
  // Filter courses based on delivery method
  filterByDeliveryMethod(courses, method) {
    if (!method) return courses;
    return courses.filter((course) => course.deliveryMethods.includes(method));
  },

  // Search courses by title and description
  searchCourses(courses, searchTerm) {
    if (!searchTerm) return courses;
    const term = searchTerm.toLowerCase();
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(term) ||
        course.description.toLowerCase().includes(term)
    );
  },
};
