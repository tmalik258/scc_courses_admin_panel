import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const payments = await prisma.invoice.findMany({
      include: {
        purchase: {
          include: {
            student: {
              select: {
                id: true,
                fullName: true,
                email: true
              }
            },
            course: {
              select: {
                id: true,
                title: true,
                price: true
              }
            }
          }
        }
      },
      orderBy: {
        paymentDate: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: payments,
      count: payments.length,
    });
  } catch (err) {
    console.error("[PAYMENT] Server error in:", err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
