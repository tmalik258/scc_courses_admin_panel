import { CategoriesResponse } from '@/types/category';
import axios from 'axios';

export async function getAllCategories(): Promise<CategoriesResponse> {
  try {
    const response = await axios.get<CategoriesResponse>('/api/categories');
    // console.log('Categories:', response.data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching categories:', error.message);
    } else {
      console.error('Error fetching categories:', error);
    }
    throw new Error('Failed to fetch categories', { cause: error });
  }
}