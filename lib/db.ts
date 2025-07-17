// Removed unused PrismaClient import since we're using a mock database
import { v4 as uuidv4 } from "uuid"; // Ensure uuid is available for invoice IDs

// Define types for mock data
interface Purchase {
  id: string;
  studentId: string;
  courseId: string;
}

interface Invoice {
  id: string;
  status: string;
  purchaseId: string;
  invoiceNumber: string;
  paymentDate: Date;
  paymentMethod: string;
  totalAmount: number;
  courseName: string;
  studentName: string;
  category?: string;
}

const mockPurchases: Purchase[] = [];
let purchaseId = 1;

export const db = {
  purchase: {
    findUnique: async ({
      where,
    }: {
      where: { studentId_courseId: { studentId: string; courseId: string } };
    }) => {
      console.log("[DB_PURCHASE] findUnique called:", where);
      const result =
        mockPurchases.find(
          (p) =>
            p.studentId === where.studentId_courseId.studentId &&
            p.courseId === where.studentId_courseId.courseId
        ) || null;
      console.log("[DB_PURCHASE] findUnique result:", result);
      return result;
    },
    create: async ({
      data,
    }: {
      data: { studentId: string; courseId: string };
    }) => {
      console.log("[DB_PURCHASE] create called:", data);
      const newPurchase = { ...data, id: `mock-purchase-${purchaseId++}` };
      mockPurchases.push(newPurchase);
      console.log("[DB_PURCHASE] create result:", newPurchase);
      return newPurchase;
    },
  },
  invoice: {
    create: async ({ data }: { data: Omit<Invoice, "id" | "status"> }) => {
      console.log("[DB_INVOICE] create called:", data);
      const newInvoice = {
        id: `mock-invoice-${uuidv4().slice(0, 8)}`,
        status: "SUCCESS",
        ...data,
      };
      console.log("[DB_INVOICE] create result:", newInvoice);
      return newInvoice;
    },
  },
};

export function resetMockDb() {
  console.log("[DB_RESET] Resetting mock database");
  mockPurchases.length = 0;
  purchaseId = 1;
}
