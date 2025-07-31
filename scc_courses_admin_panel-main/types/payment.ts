// @/types/payment.ts
export interface Transaction {
  id: string;
  date: string;
  studentName: string;
  totalPayment: number;
  status: "success" | "failed" | "pending";
}

export interface TransactionDetails {
  id: string;
  invoiceNumber: string; // Added to match Payment and schema.prisma
  paymentDate: string;
  paymentMethod: string;
  totalPayment: number;
  category?: string;
  courseName: string;
  studentName: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  studentEmail: string;
  courseTitle: string;
}

export interface Profile {
  id: string;
  fullName: string | null;
  email: string | null;
}

export interface Course {
  id: string;
  title: string;
  price: number | null;
}

export interface Purchase {
  id: string;
  studentId: string;
  courseId: string;
  student: Profile;
  course: Course;
}

export interface Payment {
  id: string;
  purchaseId: string;
  invoiceNumber: string;
  paymentDate: string;
  paymentMethod: string;
  totalAmount: number;
  status: string;
  category: string | null;
  courseName: string;
  studentName: string;
  createdAt: string;
  updatedAt: string;
  purchase: Purchase;
}

export interface PaymentResponse {
  success: boolean;
  data: Payment[];
  count: number;
}

export interface PaymentFilters {
  studentId?: string;
  courseId?: string;
  status?: string;
  paymentMethod?: string;
}
