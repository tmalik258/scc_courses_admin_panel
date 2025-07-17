export interface Course {
  id: string;
  title: string;
  category: string;
  totalLessons: number;
}

export interface Instructor {
  id: string;
  fullName: string | null;
  role: string;
  bio: string | null;
  phone: string | null;
  avatarUrl: string | null;
  courses: Course[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
