export interface Course {
  id: string;
  title: string;
  tagLine: string;
  discription: string; // Note: keeping the typo as it exists in current data
  courseNumber: string;
  durationDays: number;
  keyWords: string;
  deliveryMethods: {
    classroom: boolean;
    distance: boolean;
  };
  image: string;
  scheduledDates: ScheduledDate[];
  isDeleted?: boolean; // New field for soft deletion
}

export interface ScheduledDate {
  startDate: string;
  format: 'classroom' | 'distance';
  availableSeats: number;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
  isAdmin?: boolean; // New field for admin role
}

export interface Booking {
  id: string;
  userId: string;
  courseId: string;
  sessionDate: string;
  bookingDate: string;
  status: 'confirmed' | 'cancelled' | 'pending';
  format: 'classroom' | 'distance';
}

// Admin-specific interfaces
export interface AdminCourseView extends Course {
  enrollmentCount: number;
}
