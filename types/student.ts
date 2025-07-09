export interface Student {
  id: string
  name: string
  phone: string
  email: string
  profileImage?: string
}

export interface StudentDetails extends Student {
  courses: Array<{
    id: string
    title: string
    category: string
    status: "ongoing" | "completed"
  }>
}

export interface StudentTableProps {
  students: Student[]
  onEdit: (student: Student) => void
  onDelete: (studentId: string) => void
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}
