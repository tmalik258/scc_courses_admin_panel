export interface Transaction {
  id: string
  date: string
  studentName: string
  totalPayment: number
  status: "success" | "failed" | "pending"
}

export interface TransactionDetails {
  id: string
  paymentDate: string
  paymentMethod: string
  totalPayment: number
  category: string
  courseName: string
  studentName: string
  status: "success" | "failed" | "pending"
}
