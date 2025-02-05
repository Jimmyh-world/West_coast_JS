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
  enrolledStudents?: EnrolledStudent[];
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
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface Booking {
  id: string;
  userId: string;
  courseId: string;
  sessionDate: string;
  bookingDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
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

export interface EnrolledStudent {
  studentName: string;
  email: string;
  format: 'classroom' | 'distance';
  enrolledDate: string;
  phoneNumber?: string;
}
