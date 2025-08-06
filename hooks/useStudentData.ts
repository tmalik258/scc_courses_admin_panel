import { fetchStudents } from "@/actions/student-data";
import { Student } from "@/types/student";
import { fetchImage } from "@/utils/supabase/fetchImage";
import { useCallback, useEffect, useState } from "react";

export function useStudentData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [total, setTotal] = useState(0);

  const refreshStudents = useCallback(
    async (pageOverride?: number) => {
      setLoading(true);
      try {
        const { students: fetchedStudents, total } = await fetchStudents(
          pageOverride || page,
          limit
        );
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
        setStudents(studentsWithResolvedUrls);
        setTotal(total);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    },
    [page, limit]
  );

  const handleDeleteStudent = async (studentId: string) => {
    try {
      setStudents((prev) => prev.filter((student) => student.id !== studentId));
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

  useEffect(() => {
    refreshStudents();
  }, [page, refreshStudents]);

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
    total,
    totalPages: Math.ceil(total / limit),
  };
}
