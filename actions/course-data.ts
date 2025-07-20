import axios from 'axios';
import { CourseWithRelations } from '@/types/course';

export async function getAllCourses(): Promise<{courses: CourseWithRelations[]}> {
  try {
    const response = await axios.get('/api/courses');
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching courses:', error.message);
    } else {
      console.error('Error fetching courses:', error);
    }
    throw new Error('Failed to fetch courses', { cause: error });
  }
}