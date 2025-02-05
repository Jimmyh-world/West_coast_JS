/**
 * My Page Manager
 *
 * Handles user's personal dashboard including:
 * - User profile display
 * - Course booking management
 * - Booking cancellation
 * - Tab navigation between upcoming and past courses
 *
 * Dependencies:
 * - eventHandler for DOM event management
 * - courseList for course card creation
 * - courseServices for booking operations
 *
 * @module myPage
 */

import { MyPageManager } from '../components/my-page.js';

// Initialize the MyPageManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Create global instance for access from HTML event handlers
  window.myPageManager = new MyPageManager();
});
