// Export as a module
const API_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  ENDPOINTS: {
    COURSES: '/courses',
    BOOKINGS: '/bookings',
    USERS: '/users',
  },
} as const;

// Helper function to build full URLs
export const getApiUrl = (
  endpoint: keyof typeof API_CONFIG.ENDPOINTS
): string => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;
};

// Export for direct use if needed
export default API_CONFIG;
