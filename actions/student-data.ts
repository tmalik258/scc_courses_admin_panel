import axios from "axios";

export async function fetchStudents() {
  try {
    const res = await axios.get("/api/students");
    return res.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
}

export async function fetchStudentById(studentId: string) {
  try {
    const res = await axios.get(`/api/students/${studentId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching student:", error);
    throw error;
  }
}

export async function deleteStudent(studentId: string) {
  try {
    const res = await axios.delete(`/api/students/${studentId}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
}

export async function updateStudent(studentId: string, data: { name?: string; phone?: string; email?: string }) {
  try {
    const res = await axios.patch(`/api/students/${studentId}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  }
}