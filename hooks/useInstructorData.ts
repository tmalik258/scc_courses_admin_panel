import { useState, useEffect } from "react";
import { fetchInstructors, fetchInstructorById, deleteInstructor, updateInstructor } from "@/actions/instructor-data";
import { Instructor } from "@/types/instructor";

export function useInstructorData() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshInstructors = async () => {
    setLoading(true);
    try {
      const data = await fetchInstructors();
      setInstructors(data);
    } catch (err) {
      console.log(`Error fetching instructors: ${err}`);
      setError("Failed to load instructors");
    } finally {
      setLoading(false);
    }
  };

  const selectInstructor = async (instructorId: string) => {
    setLoading(true);
    try {
      const data = await fetchInstructorById(instructorId);
      setSelectedInstructor(data);
    } catch (err) {
      console.log(`Error fetching instructor: ${err}`);
      setError("Failed to load instructor details");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInstructor = async (instructorId: string) => {
    setLoading(true);
    try {
      await deleteInstructor(instructorId);
      await refreshInstructors();
      setSelectedInstructor(null);
    } catch (err) {
      console.log(`Error deleting instructor: ${err}`);
      setError("Failed to delete instructor");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInstructor = async (
    instructorId: string,
    data: Partial<Instructor>
  ) => {
    setLoading(true);
    try {
      const updatedInstructor = await updateInstructor(instructorId, data);
      setSelectedInstructor(updatedInstructor);
      await refreshInstructors();
    } catch (err) {
      console.log(`Error updating instructor: ${err}`);
      setError("Failed to update instructor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshInstructors();
  }, []);

  return { instructors, selectedInstructor, setSelectedInstructor, refreshInstructors, selectInstructor, handleDeleteInstructor, handleUpdateInstructor, loading, error };
}