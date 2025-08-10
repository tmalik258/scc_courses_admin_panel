import axios from "axios";

export async function fetchInstructors(page = 1, limit = 10, course = false) {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/instructors${course ? `?course=${course}` : `?page=${page}&limit=${limit}`}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching instructors:", error);
    throw error;
  }
}

export async function fetchInstructorById(instructorId: string) {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/instructors/${instructorId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching instructor:", error);
    throw error;
  }
}

export async function deleteInstructor(instructorId: string) {
  try {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_SITE_URL}/api/instructors/${instructorId}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting instructor:", error);
    throw error;
  }
}

export async function updateInstructor(instructorId: string, data: { name?: string; role?: string; company?: string }) {
  try {
    const res = await axios.patch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/instructors/${instructorId}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating instructor:", error);
    throw error;
  }
}