import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Define the shape of the transaction response
interface Transaction {
  id: string;
  studentId: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    fullName: string | null;
    email: string | null;
  };
  course: {
    id: string;
    title: string;
    price: number | null;
  };
  invoice: {
    id: string;
    invoiceNumber: string;
    paymentDate: string;
    paymentMethod: string;
    totalAmount: number;
    status: string;
    courseName: string;
    studentName: string;
  } | null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const courseId = searchParams.get("courseId");
    const status = searchParams.get("status");

    const supabase = await createClient();

    // Build the query
    let query = supabase.from("purchases").select(`
        *,
        profiles!purchases_student_id_fkey (
          id,
          full_name,
          email
        ),
        courses!purchases_course_id_fkey (
          id,
          title,
          price
        ),
        invoices!purchases_id_fkey (
          id,
          invoice_number,
          payment_date,
          payment_method,
          total_amount,
          status,
          course_name,
          student_name
        )
      `);

    // Apply filters
    if (studentId) query = query.eq("student_id", studentId);
    if (courseId) query = query.eq("course_id", courseId);
    if (status) query = query.eq("invoices.status", status);

    // Order by created_at (descending)
    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch transactions" },
        { status: 500 }
      );
    }

    // Type the response data
    const transactions: Transaction[] = data || [];

    return NextResponse.json({
      success: true,
      data: transactions,
      count: transactions.length,
    });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
