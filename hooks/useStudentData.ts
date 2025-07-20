import { useState, useEffect } from "react";
import { fetchStudents, fetchStudentById, deleteStudent, updateStudent } from "@/actions/student-data";

interface Course {
  id: string;
  title: string;
  category: string;
}

interface Purchase {
  course: Course;
  createdAt: Date;
}

interface Student {
  id: string;
  fullName?: string
  phone?: string
  email?: string
  avatarUrl?: string
  bio?: string
  purchases: Purchase[];
}

export function useStudentData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshStudents = async () => {
    setLoading(true);
    try {
      const data = await fetchStudents();
      setStudents(data);
    } catch (err) {
      console.log(`Error fetching students: ${err}`);
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const selectStudent = async (studentId: string) => {
    setLoading(true);
    try {
      const data = await fetchStudentById(studentId);
      setSelectedStudent(data);
    } catch (err) {
      console.log(`Error fetching student: ${err}`);
      setError("Failed to load student details");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    setLoading(true);
    try {
      await deleteStudent(studentId);
      await refreshStudents();
      setSelectedStudent(null);
    } catch (err) {
      console.log(`Error deleting student: ${err}`);
      setError("Failed to delete student");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStudent = async (studentId: string, data: { fullName?: string; phone?: string; email?: string }) => {
    setLoading(true);
    try {
      const updatedStudent = await updateStudent(studentId, data);
      setSelectedStudent(updatedStudent);
      await refreshStudents();
    } catch (err) {
      console.log(`Error updating student: ${err}`);
      setError("Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStudents();
  }, []);

  return { students, selectedStudent, setSelectedStudent, refreshStudents, selectStudent, handleDeleteStudent, handleUpdateStudent, loading, error };
}