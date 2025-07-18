// app/api/payments/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Define the shape of the payment response
interface Payment {
  id: string;
  purchase_id: string;
  invoice_number: string;
  payment_date: string;
  payment_method: string;
  total_amount: number;
  status: string;
  course_name: string;
  student_name: string;
  purchases: {
    profiles: {
      id: string;
      full_name: string | null;
      email: string | null;
    } | null;
    courses: {
      id: string;
      title: string;
      price: number | null;
    } | null;
  } | null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const courseId = searchParams.get("courseId");
    const status = searchParams.get("status");
    const paymentMethod = searchParams.get("paymentMethod");

    // Build the query
    let query = supabase.from("invoices").select(`
        *,
        purchases!invoices_purchase_id_fkey (
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
          )
        )
      `);

    // Apply filters
    if (studentId) query = query.ilike("student_name", `%${studentId}%`);
    if (courseId) query = query.eq("purchases.course_id", courseId);
    if (status) query = query.eq("status", status);
    if (paymentMethod) query = query.eq("payment_method", paymentMethod);

    // Order by payment_date (descending)
    query = query.order("payment_date", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Type the response data
    const payments: Payment[] = data || [];

    return NextResponse.json({
      success: true,
      data: payments,
      count: payments.length,
    });
  } catch (err) {
    console.error("Server error in /api/payments:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
