# West_coast_JS

Individual assignment for front-end Javascript course

# WestCoast Education Platform Modernization

## Project Overview

In this assignment, I am developing a proof of concept for WestCoast Education's platform modernization initiative. WestCoast Education, with 40 years of experience in technical education, needs a modern platform to handle both traditional classroom courses and online learning options. This implementation represents Step 1 of a larger modernization effort, focusing on establishing core functionality and architectural patterns.

### Development Philosophy

I am approaching this project with a strong emphasis on code quality and maintainable architecture. My implementation adheres to:

- DRY (Don't Repeat Yourself) principles for maintainable code
- KISS (Keep It Simple, Stupid) methodology for clear solutions
- Clean Code practices for readability
- Step-by-step documented development for clear progression
- Initial JavaScript implementation with planned TypeScript integration

### Project Requirements

Based on the requirements specification, the platform needs to handle:

1. Course Display and Management

   - Presentation of classroom and distance learning courses
   - Detailed course information including duration, teacher, and ratings
   - Course scheduling and capacity management
   - Support for future on-demand content

2. User Interaction

   - Course booking system
   - Student registration and profile management
   - Course recommendations based on user history
   - Student-teacher communication capabilities

3. Technical Requirements
   - Modern responsive design
   - ES6+ JavaScript implementation
   - Module-based architecture
   - REST API integration using JSON Server
   - Test-Driven Development for TypeScript components

## Technical Implementation Details

### API Layer

The API service module (`courseServices.js`) handles all data interactions:

```javascript
// Example from src/js/api/courseServices.js
const BASE_URL = 'http://localhost:3000';

export async function getCourses() {
  try {
    const response = await fetch(`${BASE_URL}/courses`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
}
```

### Data Structure

The database schema (`db.json`) is structured to support all required features:

```json
{
  "courses": [
    {
      "id": "1",
      "title": "Modern Web Development",
      "courseNumber": "WD101",
      "durationDays": 5,
      "deliveryMethods": {
        "classroom": true,
        "distance": true
      },
      "scheduledDates": [
        {
          "startDate": "2025-02-15",
          "format": "classroom",
          "availableSeats": 15
        }
      ]
    }
  ],
  "users": [],
  "bookings": []
}
```

### Component Architecture

The course display system (`courseList.js`) implements a modular approach:

```javascript
function createCourseElement(course) {
  const {
    title,
    courseNumber,
    durationDays,
    deliveryMethods = {},
    scheduledDates = [],
  } = course;

  // Component rendering with fallback handling
  return `
        <article class="course-card">
            <div class="course-content">
                <h3 class="course-title">${title}</h3>
                <p class="course-number">Course: ${courseNumber}</p>
                <p class="duration">${durationDays} days</p>
                // Additional content...
            </div>
        </article>
    `;
}
```

### Filtering System

A dedicated filtering module (`filters.js`) handles search and categorization:

```javascript
export const filters = {
  filterByDeliveryMethod(courses, method) {
    if (!method) return courses;
    return courses.filter((course) => course.deliveryMethods.includes(method));
  },

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
```

### Development Environment

The project uses a modern development setup with:

- Live Server for development with hot reloading
- JSON Server for REST API simulation
- ES6 modules with proper MIME type handling
- Configurable server settings through `live-server.config.js`

### Project Structure

```
project-root/
  ├── data/
  │   └── db.json              # Database schema
  ├── src/
  │   ├── js/
  │   │   ├── api/            # API services
  │   │   ├── components/     # UI components
  │   │   ├── utilities/      # Shared functions
  │   │   └── main.js         # Application entry
  │   ├── css/
  │   │   └── styles.css      # Styling
  │   └── images/             # Asset storage
  ├── live-server.config.js    # Server configuration
  └── index.html              # Entry point
```

### Current Implementation Status

The tracer bullet implementation successfully demonstrates:

1. Core Functionality

   - Dynamic course listing and filtering
   - Responsive design implementation
   - Error handling and user feedback
   - Module-based architecture

2. Technical Foundation
   - ES6 module system integration
   - REST API communication
   - Component-based UI structure
   - Modern CSS with responsive design

This implementation provides a solid foundation for future development while maintaining high standards of code quality and user experience.
