import { fetchStudents } from "@/actions/student-data";
import { Student } from "@/types/student";
import { fetchImage } from "@/utils/supabase/fetchImage";
import { useCallback, useEffect, useState } from "react";

export function useStudentData(
  initialLimit: number = 10,
  initialPage: number = 1
) {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
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
      const studentsWithResolvedUrls = await Promise.all(
        fetchedStudents.map(async (student: Student) => {
          let resolvedAvatarUrl: string | null | undefined;
          if (student.avatarUrl) {
            try {
              resolvedAvatarUrl = await fetchImage(
                student.avatarUrl,
                "profiles"
              );
            } catch (err) {
              console.error(`Error fetching image for ${student.id}:`, err);
              resolvedAvatarUrl = null;
            }
          }
          return { ...student, avatarUrl: resolvedAvatarUrl };
        })
      );
      setStudents((prev) =>
        JSON.stringify(prev) !== JSON.stringify(studentsWithResolvedUrls)
          ? studentsWithResolvedUrls
          : prev
      );
      setTotalPages(Math.ceil(total / limit));
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  const handleDeleteStudent = useCallback(
    async (studentId: string) => {
      try {
        const response = await fetch(`/api/students/${studentId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          let errorMessage = `Failed to delete student: ${response.statusText}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (jsonError) {
            console.error("Error parsing error response:", jsonError);
          }
          throw new Error(errorMessage);
        }
        setStudents((prev) =>
          prev.filter((student) => student.id !== studentId)
        );
        if (selectedStudent?.id === studentId) {
          setSelectedStudent(null);
        }
      } catch (err) {
        console.error("Failed to delete student:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to delete student")
        );
        throw err;
      }
    },
    [selectedStudent]
  );

  const handleUpdateStudent = useCallback(
    async (updatedStudent: Student) => {
      try {
        const response = await fetch(`/api/students/${updatedStudent.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            id: updatedStudent.id,
            fullName: updatedStudent.fullName,
            phone: updatedStudent.phone,
            email: updatedStudent.email,
            avatarUrl: updatedStudent.avatarUrl || null,
          }),
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          let errorMessage = `Failed to update student: ${response.statusText}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (jsonError) {
            console.error("Error parsing error response:", jsonError);
          }
          throw new Error(errorMessage);
        }
        const updatedData = await response.json();
        setStudents((prev) =>
          prev.map((student) =>
            student.id === updatedStudent.id
              ? { ...student, ...updatedData }
              : student
          )
        );
        if (selectedStudent?.id === updatedStudent.id) {
          setSelectedStudent(updatedData);
        }
        return updatedData;
      } catch (err) {
        console.error("Failed to update student:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to update student")
        );
        throw err;
      }
    },
    [selectedStudent]
  );

  const selectStudent = useCallback((student: Student) => {
    setSelectedStudent((prev) => (prev?.id !== student.id ? student : prev));
  }, []);

  useEffect(() => {
    refreshStudents();
  }, [refreshStudents]);

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
