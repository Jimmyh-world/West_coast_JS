export interface Course {
  id?: string;
  title: string;
  tagLine: string;
  discription: string;
  courseNumber: string;
  durationDays: number;
  keyWords: string;
  deliveryMethods: {
    classroom: boolean;
    distance: boolean;
  };
  image: string;
  scheduledDates?: ScheduledDate[];
}

export interface ScheduledDate {
  startDate: string;
  format: 'classroom' | 'distance';
  availableSeats: number;
}

export interface StudentEnrollment {
  studentName: string;
  email: string;
  phoneNumber: string;
  enrolledDate: string;
  format: 'classroom' | 'distance';
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

export interface CourseHandlers {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
}

export type PartialCourse = Partial<Course>;
