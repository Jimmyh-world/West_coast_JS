export interface ScheduledDate {
  startDate: string;
  format: 'classroom' | 'distance';
  availableSeats: number;
}

export interface DeliveryMethods {
  classroom: boolean;
  distance: boolean;
}

export interface Course {
  id?: string;
  title: string;
  tagLine: string;
  courseNumber: string;
  discription: string; // Keeping misspelling as it matches API
  description?: string; // Optional alias for backwards compatibility
  durationDays: number;
  keyWords: string;
  image: string;
  deliveryMethods: DeliveryMethods;
  scheduledDates: ScheduledDate[];
  [key: string]: any; // Add index signature to allow string indexing
}
