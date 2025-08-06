import axios from "axios";

export async function fetchStudents(page = 1, limit = 10) {
  try {
    const res = await axios.get(`/api/students?page=${page}&limit=${limit}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
}
