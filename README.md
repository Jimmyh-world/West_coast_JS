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

### Step 1 - Tracer bullet

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

### Step 2, HTML, CSS and dynamic loading pages

1. Page Structure and Navigation

Implemented core HTML structure for all main pages:

Home (index.html)
Course View (course-view.html)
Course Details (course-details.html)
About (about.html)
Contact (contact.html)
Login (login.html)

Created responsive navigation with mobile support
Implemented consistent header and footer across all pages

2. Dynamic Course Display

Developed courseList.js component for dynamic course rendering
Implemented course card generation with:

Course image handling with fallback
Delivery method badges (Classroom/Distance)
Course duration and details
Dynamic "Learn More" links

Created filter system for course type selection

3. Course Details Implementation

Built course-details.js component for individual course views
Implemented dynamic routing based on course ID
Created detailed course information display:

Course header with image
Course metadata (number, duration)
Session availability
Booking interface

4. API Integration

Established courseServices.js for backend communication
Implemented error handling and loading states
Created service functions for:

Fetching all courses
Getting individual course details
Handling API errors

Technical Improvements:

- Enhanced error handling across components
- Implemented loading states for better UX
- Added dynamic metadata updates for course information
- Created responsive layouts for all screen sizes

### Step 3: Search, Filtering, Refactoring and Responsive UI

Our third development phase focused on implementing robust search functionality, refactoring the codebase for better maintainability, and enhancing the responsive design. This phase represents a significant improvement in both user experience and code organization.

#### Updated Project Structure

```plaintext
project-root/
  ├── src/
  │   ├── js/
  │   │   ├── api/                # API and data services
  │   │   │   ├── apiClient.js    # Core API functionality
  │   │   │   └── courseServices.js # Course-specific API calls
  │   │   ├── components/         # Reusable UI components
  │   │   │   ├── courseList.js   # Course grid/list display
  │   │   │   ├── course-details.js # Individual course view
  │   │   │   └── navigation.js   # Site navigation
  │   │   ├── utilities/          # Shared utilities
  │   │   │   ├── courseUtils.js  # Course-specific helpers
  │   │   │   ├── eventHandler.js # Event management
  │   │   │   └── search.js      # Search functionality
  │   │   ├── pages/             # Page-specific JS
  │   │   │   └── courseDetails.js
  │   │   └── main.js            # Application entry point
  │   └── css/
  │       └── styles.css         # Global styles
```

#### Search Implementation

1. **Advanced Search Engine**

   ```javascript
   // Example from utilities/search.js
   handleSearch() {
     const searchTerm = this.searchInput.value.toLowerCase();
     const filterType = this.filterSelect.value;

     let results = this.courses.filter((course) => {
       const matchesSearch =
         course.title.toLowerCase().includes(searchTerm) ||
         course.keyWords.toLowerCase().includes(searchTerm) ||
         course.discription.toLowerCase().includes(searchTerm);

       const matchesFilter =
         filterType === '' ||
         (filterType === 'classroom' && course.deliveryMethods.classroom) ||
         (filterType === 'ondemand' && course.deliveryMethods.distance);

       return matchesSearch && matchesFilter;
     });
   }
   ```

2. **Event Management System**
   ```javascript
   // Example from utilities/eventHandler.js
   export const eventHandler = {
     listeners: new Map(),
     on(element, eventType, callback, options = {}) {
       const handler = (event) => callback(event);
       element.addEventListener(eventType, handler, options);
       const key = `${eventType}-${Date.now()}`;
       this.listeners.set(key, { element, eventType, handler });
       return key;
     },
   };
   ```

#### Code Organization & Refactoring

1. **API Layer Abstraction**

   - Centralized API client with error handling
   - Service-based architecture for data operations
   - Consistent error handling patterns

2. **Component Architecture**

   - Modular component structure
   - Clear separation of concerns
   - Reusable utility functions

3. **Event Handling**
   - Centralized event management
   - Automatic event cleanup
   - Memory leak prevention

#### Responsive Design Implementation

1. **Mobile-First Approach**

   ```css
   /* Base styles for mobile */
   .course-grid {
     display: grid;
     grid-template-columns: 1fr;
     gap: 2rem;
   }

   /* Tablet and desktop adjustments */
   @media (min-width: 768px) {
     .course-grid {
       grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
     }
   }
   ```

2. **Flexible Components**

   - Responsive navigation menu
   - Adaptive course cards
   - Dynamic search interface
   - Flexible grid system

3. **Performance Optimizations**
   - Image lazy loading
   - Event delegation
   - Efficient DOM updates

#### Key Features

1. **Search Functionality**

   - Real-time filtering
   - Multiple search criteria
   - Type-ahead suggestions
   - Filter persistence

2. **UI Improvements**

   - Enhanced accessibility
   - Consistent typography
   - Responsive images
   - Loading states

3. **Code Quality**
   - ES6 module system
   - Consistent error handling
   - Type checking
   - Performance monitoring

#### Technical Highlights

1. **Search Engine**

   - Keyword-based searching
   - Multiple filter support
   - Results highlighting
   - Search history

2. **Event System**

   - Event delegation pattern
   - Automatic cleanup
   - Performance optimization
   - Error boundary implementation

3. **Component Architecture**
   - Modular design
   - State management
   - Props validation
   - Lifecycle management

This phase significantly improved the application's usability and maintainability while setting up a solid foundation for future enhancements.
