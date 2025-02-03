/**
 * Course Utilities
 *
 * Provides shared functionality for course-related operations:
 * - Image path resolution with fallback
 * - Date formatting
 * - Delivery method badge generation
 * - Error handling
 *
 * Used by:
 * - Course list component
 * - Course details component
 *
 * @module courseUtils
 */

export const courseUtils = {
  getImagePath(course) {
    return course.image?.trim()
      ? `/src/images/${course.image}`
      : '/src/images/placeholder.webp';
  },

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
  },

  createDeliveryMethodBadges(deliveryMethods) {
    const badges = [];

    if (deliveryMethods.classroom) {
      badges.push('<span class="badge badge-classroom">Classroom</span>');
    }

    if (deliveryMethods.distance) {
      badges.push('<span class="badge badge-distance">Distance</span>');
    }

    return badges.join('');
  },

  handleError(error, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    console.error('Course operation failed:', error);
    container.innerHTML = `
      <div class="error-message">
        <p>${
          error.message || 'An error occurred while loading the content.'
        }</p>
      </div>
    `;
  },
};
