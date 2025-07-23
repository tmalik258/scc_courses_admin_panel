import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CategoryWithRelations } from "@/types/category";
import path from "path";
import fs from "fs/promises";

// Ensure the upload directory exists
const uploadDir = path.join(process.cwd(), "public/uploads");

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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

    const mappedCategory: CategoryWithRelations = {
      ...category,
      createdAt: category.createdAt.toISOString(),
      status: category.isActive ? "active" : "inactive",
    };

    return NextResponse.json({ success: true, data: mappedCategory });
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
  { params }: { params: { id: string } }
) {
  try {
    await fs.mkdir(uploadDir, { recursive: true });

    const { id } = params;
    const formData = await request.formData();
    const name = formData.get("name")?.toString();
    const status = formData.get("status")?.toString();
    const thumbnail = formData.get("thumbnail");

    console.log("PUT /api/course-category/[id] received:", {
      id,
      name,
      status,
      thumbnail: thumbnail instanceof File ? thumbnail.name : thumbnail,
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
    };

    if (thumbnail instanceof File) {
      if (thumbnail.size > 2 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: "Thumbnail size exceeds 2MB" },
          { status: 400 }
        );
      }
      if (!["image/png", "image/jpeg"].includes(thumbnail.type)) {
        return NextResponse.json(
          { success: false, error: "Thumbnail must be PNG or JPG" },
          { status: 400 }
        );
      }
      const extension = path.extname(thumbnail.name) || ".jpg";
      const filename = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}${extension}`;
      const filePath = path.join(uploadDir, filename);
      const buffer = Buffer.from(await thumbnail.arrayBuffer());
      console.log("Saving thumbnail:", { filePath, size: buffer.length });
      await fs.writeFile(filePath, buffer);
      categoryData.icon = `/uploads/${filename}`;
    } else if (thumbnail === "") {
      categoryData.icon = null;
    }

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

    const mappedCategory: CategoryWithRelations = {
      ...category,
      createdAt: category.createdAt.toISOString(),
      status: category.isActive ? "active" : "inactive",
    };

    return NextResponse.json({ success: true, data: mappedCategory });
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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
