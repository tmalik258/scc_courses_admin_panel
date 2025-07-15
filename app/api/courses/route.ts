import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

interface CourseFormData {
  title: string;
  description?: string;
  category: string;
  price?: string;
  instructor: string;
  thumbnail?: string | null;
  modules: {
    title: string;
    sections: {
      name: string;
      reading?: string;
      videoUrl?: string;
    }[];
  }[];
  resources: {
    title: string;
    url: string;
  }[];
}

// ✅ Moved this inside GET handler
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: true,
        category: true,
        modules: {
          include: {
            sections: true,
          },
        },
        resources: true,
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body: CourseFormData = await req.json();

    const {
      title,
      description,
      category,
      price,
      instructor,
      thumbnail,
      modules,
      resources,
    } = body;

    if (!title || !instructor || !category) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const createdCourse = await prisma.course.create({
      data: {
        title,
        description,
        instructorId: instructor,
        categoryId: category,
        price: price ? new Decimal(price) : undefined,
        thumbnailUrl: thumbnail || undefined,
        modules: {
          create: modules.map((mod) => ({
            title: mod.title,
            sections: {
              create: mod.sections.map((sec) => ({
                name: sec.name,
                reading: sec.reading,
                videoUrl: sec.videoUrl,
              })),
            },
          })),
        },
        resources: {
          create: resources.map((res) => ({
            title: res.title,
            url: res.url,
          })),
        },
      },
    });

    return NextResponse.json(
      { success: true, course: createdCourse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
