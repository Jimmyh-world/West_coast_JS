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
    return `
            ${
              deliveryMethods.classroom
                ? '<span class="badge badge-classroom">Classroom</span>'
                : ''
            }
            ${
              deliveryMethods.distance
                ? '<span class="badge badge-distance">Distance</span>'
                : ''
            }
        `;
  },

  handleError(error, containerId) {
    const container = document.getElementById(containerId);
    console.error('Course operation failed:', error);
    if (container) {
      container.innerHTML = `
                <div class="error-message">
                    <p>${
                      error.message ||
                      'An error occurred while loading the content.'
                    }</p>
                </div>`;
    }
  },
};
