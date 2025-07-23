import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        courses: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorCode =
      typeof error === "object" && error && "code" in error
        ? error.code
        : undefined;

    console.error("GET /api/course-category/[id] error:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      code: errorCode,
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch category",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { name, status, thumbnail } = body;

    console.log("PUT /api/course-category/[id] received:", {
      id,
      name,
      status,
      thumbnail,
    });

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const categoryData: {
      name: string;
      slug: string;
      isActive: boolean;
      icon?: string | null;
    } = {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      isActive: status === "active",
      icon: thumbnail || null,
    };

    const category = await prisma.category.update({
      where: { id },
      data: categoryData,
      include: {
        courses: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorCode =
      typeof error === "object" && error && "code" in error
        ? error.code
        : undefined;

    console.error("PUT /api/course-category/[id] error:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      code: errorCode,
    });

    if (errorCode === "P2002") {
      return NextResponse.json(
        { success: false, error: "Category name or slug already exists" },
        { status: 400 }
      );
    }
    if (errorCode === "P2025") {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update category",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorCode =
      typeof error === "object" && error && "code" in error
        ? error.code
        : undefined;

    console.error("DELETE /api/course-category/[id] error:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      code: errorCode,
    });

    if (errorCode === "P2025") {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete category",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
