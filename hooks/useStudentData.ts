import { useCallback, useState } from "react";
import {
  fetchStudents,
  fetchStudentById,
  deleteStudent,
  updateStudent,
} from "@/actions/student-data";
import { fetchImage } from "@/utils/supabase/fetchImage";

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
  fullName?: string;
  phone?: string;
  email?: string;
  avatarUrl?: string | null; // Allow null here to match fetchImage
  bio?: string;
  purchases: Purchase[];
}

export function useStudentData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchStudents();
      const studentsWithResolvedUrls = await Promise.all(
        data.map(async (student: Student) => {
          let resolvedAvatarUrl: string | null | undefined;
          if (student.avatarUrl) {
            try {
              resolvedAvatarUrl = await fetchImage(student.avatarUrl);
            } catch (err) {
              console.error(`Error fetching image for ${student.id}:`, err);
              resolvedAvatarUrl = null;
            }
          }
          return { ...student, avatarUrl: resolvedAvatarUrl };
        })
      );
      setStudents(studentsWithResolvedUrls);
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("Unknown error"));
      }
      console.log(`Error fetching students: ${err}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectStudent = async (studentId: string) => {
    setLoading(true);
    try {
      const data = await fetchStudentById(studentId);
      let resolvedAvatarUrl: string | null | undefined; // Updated type
      if (data.avatarUrl) {
        try {
          resolvedAvatarUrl = await fetchImage(data.avatarUrl);
        } catch (err) {
          console.error(`Error fetching image for ${studentId}:`, err);
          resolvedAvatarUrl = null;
        }
      }
      setSelectedStudent({ ...data, avatarUrl: resolvedAvatarUrl });
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("Unknown error"));
      }
      console.log(`Error fetching student: ${err}`);
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
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("Unknown error"));
      }
      console.log(`Error deleting student: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStudent = async (
    studentId: string,
    data: {
      fullName?: string;
      phone?: string;
      email?: string;
      avatarUrl?: string;
    }
  ) => {
    setLoading(true);
    try {
      const updatedStudent = await updateStudent(studentId, data);
      let resolvedAvatarUrl: string | null | undefined; // Updated type
      if (updatedStudent.avatarUrl) {
        try {
          resolvedAvatarUrl = await fetchImage(updatedStudent.avatarUrl);
        } catch (err) {
          console.error(`Error fetching image for ${studentId}:`, err);
          resolvedAvatarUrl = null;
        }
      }
      setSelectedStudent({ ...updatedStudent, avatarUrl: resolvedAvatarUrl });
      await refreshStudents();
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("Unknown error"));
      }
      console.log(`Error updating student: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    students,
    selectedStudent,
    setSelectedStudent,
    refreshStudents,
    selectStudent,
    handleDeleteStudent,
    handleUpdateStudent,
    loading,
    error,
  };
}
