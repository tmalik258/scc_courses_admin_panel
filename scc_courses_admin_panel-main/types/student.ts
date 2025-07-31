export interface Student {
  id: string;
  fullName?: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  purchases: {
    course: {
      id: string;
      title: string;
    };
  }[];
}

export interface StudentDetails extends Student {
  courses: Array<{
    id: string;
    title: string;
    category: string;
    status: "ongoing" | "completed";
  }>;
}

export interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Data structure for rendering the student growth chart.
 * Example: { label: "Jan", value: 200 }
 */
export interface ChartDataPoint {
  label: string;
  value: number;
}
