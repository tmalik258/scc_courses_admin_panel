import axios from "axios";

export async function fetchInstructors() {
  try {
    const res = await axios.get("/api/instructors");
    return res.data;
  } catch (error) {
    console.error("Error fetching instructors:", error);
    throw error;
  }
}

export async function fetchInstructorById(instructorId: string) {
  try {
    const res = await axios.get(`/api/instructors/${instructorId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching instructor:", error);
    throw error;
  }
}

export async function deleteInstructor(instructorId: string) {
  try {
    const res = await axios.delete(`/api/instructors/${instructorId}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting instructor:", error);
    throw error;
  }
}

export async function updateInstructor(instructorId: string, data: { name?: string; role?: string; company?: string }) {
  try {
    const res = await axios.patch(`/api/instructors/${instructorId}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating instructor:", error);
    throw error;
  }
}