import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const { invoiceId } = await params;
    const invoice = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
      },
      include: {
        purchase: {
          include: {
            student: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
            course: {
              select: {
                id: true,
                title: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: invoice,
    });
  } catch (err) {
    console.error(
      "[INVOICE] Server error in:",
      err instanceof Error ? err.message : String(err)
    );
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
