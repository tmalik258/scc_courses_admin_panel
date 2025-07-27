import axios from 'axios';
import { CourseFormData, CourseWithRelations, CourseWithRelationsResponse, CreateCourseFormData } from '@/types/course';

export async function getCourses(): Promise<{ courses: CourseWithRelations[] }> {
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

export async function getCourseById(courseId: string): Promise<CourseWithRelations> {
  try {
    const response = await axios.get(`/api/courses/${courseId}`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching course:', error.message);
    } else {
      console.error('Error fetching course:', error);
    }
    throw new Error('Failed to fetch course', { cause: error });
  }
}

export async function createCourse(data: CreateCourseFormData): Promise<CourseWithRelationsResponse> {
  try {
    const response = await axios.post('/api/courses', { ...data, isPublished: false });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating course:', error.message);
    } else {
      console.error('Error creating course:', error);
    }
    throw new Error('Failed to create course', { cause: error });
  }
}

export async function updateCourse(courseId: string, data: Partial<CourseFormData>): Promise<CourseWithRelations> {
  try {
    const response = await axios.put(`/api/courses/${courseId}`, data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error updating course:', error.message);
    } else {
      console.error('Error updating course:', error);
    }
    throw new Error('Failed to update course', { cause: error });
  }
}

export async function createModule(courseId: string, data: { title: string; lessons: CourseFormData["modules"][0]["lessons"] }): Promise<CourseWithRelations["modules"][0]> {
  try {
    const response = await axios.post(`/api/courses/${courseId}/modules`, data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating module:', error.message);
    } else {
      console.error('Error creating module:', error);
    }
    throw new Error('Failed to create module', { cause: error });
  }
}

export async function updateModule(courseId: string, moduleId: string, data: { title: string; lessons: CourseFormData["modules"][0]["lessons"] }): Promise<CourseWithRelations> {
  try {
    const response = await axios.put(`/api/courses/${courseId}/modules/${moduleId}`, data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error updating module:', error.message);
    } else {
      console.error('Error updating module:', error);
    }
    throw new Error('Failed to update module', { cause: error });
  }
}

export async function deleteModule(courseId: string, moduleId: string): Promise<void> {
  try {
    await axios.delete(`/api/courses/${courseId}/modules/${moduleId}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error deleting module:', error.message);
    } else {
      console.error('Error deleting module:', error);
    }
    throw new Error('Failed to delete module', { cause: error });
  }
}

export async function updateResource(courseId: string, resourceId: string, data: { title: string; url: string }): Promise<CourseWithRelations> {
  try {
    const response = await axios.put(`/api/courses/${courseId}/resources/${resourceId}`, data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error updating resource:', error.message);
    } else {
      console.error('Error updating resource:', error);
    }
    throw new Error('Failed to update resource', { cause: error });
  }
}

export async function deleteCourse(courseId: string): Promise<void> {
  try {
    await axios.delete(`/api/courses/${courseId}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error deleting course:', error.message);
    } else {
      console.error('Error deleting course:', error);
    }
    throw new Error('Failed to delete course', { cause: error });
  }
}