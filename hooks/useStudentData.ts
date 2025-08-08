import { fetchStudents } from "@/actions/student-data";
import { Student } from "@/types/student";
import { fetchImage } from "@/utils/supabase/fetchImage";
import { useCallback, useState } from "react";

export function useStudentData(initialLimit: number = 10, initialPage: number = 1) {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(initialLimit);

  const refreshStudents = useCallback(async () => {
    setLoading(true);
    try {
      const { students: fetchedStudents, total } = await fetchStudents(
        page,
        limit
      );
      // console.log("Received students:", fetchedStudents);
      const studentsWithResolvedUrls = await Promise.all(
        fetchedStudents.map(async (student: Student) => {
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
      // console.log("Resolved avatar URLs:", studentsWithResolvedUrls);
      setStudents(studentsWithResolvedUrls);
      setTotalPages(Math.ceil(total / limit));
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  const handleDeleteStudent = async (studentId: string) => {
    try {
      setStudents((prev) => prev.filter((student) => student.id !== studentId));
      await refreshStudents(); // Refresh to ensure consistency with backend
    } catch (err) {
      console.error("Failed to delete student:", err);
    }
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    try {
      setStudents((prev) =>
        prev.map((student) =>
          student.id === updatedStudent.id ? updatedStudent : student
        )
      );
    } catch (err) {
      console.error("Failed to update student:", err);
    }
  };

  const selectStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  return {
    students,
    selectedStudent,
    setSelectedStudent,
    selectStudent,
    refreshStudents,
    handleDeleteStudent,
    handleUpdateStudent,
    loading,
    error,
    page,
    setPage,
    totalPages,
    limit,
    setLimit,
  };
}
