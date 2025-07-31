import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export async function GET() {
  try {
    const now = new Date();

    const data = await Promise.all(
      Array.from({ length: 6 }).map(async (_, i) => {
        const monthStart = startOfMonth(subMonths(now, 5 - i));
        const monthEnd = endOfMonth(subMonths(now, 5 - i));

        const count = await prisma.purchase.count({
          where: {
            createdAt: {
              gte: monthStart,
              lte: monthEnd,
            },
          },
        });

        return {
          label: monthStart.toLocaleString("default", { month: "short" }), // Jan, Feb...
          value: count,
        };
      })
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("[GROWTH_API_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch student growth" },
      { status: 500 }
    );
  }
}
