import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import path from "path";
import fs from "fs/promises";

// Ensure the upload directory exists
const uploadDir = path.join(process.cwd(), "public/uploads");

export async function GET() {
  try {
    await fs.mkdir(uploadDir, { recursive: true });

    const categories = await prisma.category.findMany({
      include: {
        courses: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorCode =
      typeof error === "object" && error && "code" in error
        ? error.code
        : undefined;

    console.error("GET /api/course-category error:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      code: errorCode,
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await fs.mkdir(uploadDir, { recursive: true });

    const formData = await request.formData();
    const name = formData.get("name")?.toString();
    const status = formData.get("status")?.toString();
    const thumbnail = formData.get("thumbnail");

    console.log("POST /api/course-category received:", {
      name,
      status,
      thumbnail: thumbnail instanceof File ? thumbnail.name : null,
    });

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }
    if (!thumbnail) {
      return NextResponse.json(
        { success: false, error: "Thumbnail is required" },
        { status: 400 }
      );
    }

    const categoryData: {
      name: string;
      slug: string;
      isActive: boolean;
      icon?: string;
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
    }

    const category = await prisma.category.create({
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

    console.error("POST /api/course-category error:", {
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

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create category",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
