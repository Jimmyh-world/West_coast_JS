export interface Course {
  id: string;
  title: string;
  tagLine: string;
  discription: string; // Note: keeping original spelling from JSON
  courseNumber: string;
  durationDays: number;
  keyWords: string;
  deliveryMethods: {
    classroom: boolean;
    distance: boolean;
  };
  image: string;
  scheduledDates: ScheduledDate[];
}

export interface ScheduledDate {
  startDate: string;
  format: 'classroom' | 'distance';
  availableSeats: number;
}
