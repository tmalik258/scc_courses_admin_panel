import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";

console.log("[PAYMENT_ROUTE] Route handler loaded");

const paymentSchema = z.object({
  studentId: z.string().uuid(),
  courseId: z.string().uuid(),
  paymentMethod: z.string(),
  totalAmount: z.number(),
  courseName: z.string(),
  studentName: z.string(),
  category: z.string().optional(),
});

export async function POST(req: Request) {
  console.log("[PAYMENT_POST] Handler invoked");
  try {
    const body = await req.json();
    console.log("[PAYMENT_POST] Request body:", body);
    const parsedBody = paymentSchema.parse(body);
    console.log("[PAYMENT_POST] Parsed body:", parsedBody);
    const {
      studentId,
      courseId,
      paymentMethod,
      totalAmount,
      courseName,
      studentName,
      category,
    } = parsedBody;

    console.log("[PAYMENT_POST] Checking for existing purchase:", {
      studentId,
      courseId,
    });
    const existingPurchase = await db.purchase.findUnique({
      where: {
        studentId_courseId: { studentId, courseId },
      },
    });
    console.log("[PAYMENT_POST] Existing purchase result:", existingPurchase);

    if (existingPurchase) {
      return NextResponse.json(
        { error: "This student has already purchased this course." },
        { status: 400 }
      );
    }

    console.log("[PAYMENT_POST] Creating new purchase:", {
      studentId,
      courseId,
    });
    const newPurchase = await db.purchase.create({
      data: { studentId, courseId },
    });
    console.log("[PAYMENT_POST] New purchase created:", newPurchase);

    const invoiceNumber = `INV-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${uuidv4().slice(0, 6).toUpperCase()}`;
    console.log("[PAYMENT_POST] Generated invoice number:", invoiceNumber);

    console.log("[PAYMENT_POST] Creating invoice:", {
      purchaseId: newPurchase.id,
      invoiceNumber,
      paymentMethod,
      totalAmount,
      courseName,
      studentName,
      category,
    });
    const invoice = await db.invoice.create({
      data: {
        purchaseId: newPurchase.id,
        invoiceNumber,
        paymentDate: new Date(),
        paymentMethod,
        totalAmount,
        courseName,
        studentName,
        category,
      },
    });
    console.log("[PAYMENT_POST] Invoice created:", invoice);

    return NextResponse.json({
      message: "Payment and invoice created successfully",
      invoice,
    });
  } catch (error) {
    console.error("[PAYMENT_POST_ERROR]", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      body: await req.json().catch(() => "Failed to parse body"),
    });

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Payment API" });
}
