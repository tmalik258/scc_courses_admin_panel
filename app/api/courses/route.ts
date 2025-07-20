import { NextResponse } from "next/server";
import { Decimal } from "@prisma/client/runtime/library";
import prisma from "@/lib/prisma";

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

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          }
        },
        modules: {
          include: {
            sections: true,
          },
        },
        instructor: {
          select: {
            id: true,
            fullName: true,
          },
        },
        resources: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json({courses}, { status: 200 });
  } catch (error) {
    console.error(
      "Error fetching courses:",
      error instanceof Error ? error.message : String(error)
    );
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

    const instructor_profile = await prisma.profile.findUnique({
      where: { id: body.instructor, role: "INSTRUCTOR" },
    });

    if (!instructor_profile) {
      return NextResponse.json(
        { error: "Instructor not found." },
        { status: 404 }
      );
    }

    const createdCourse = await prisma.course.create({
      data: {
        title,
        description,
        instructorId: instructor_profile.id,
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
    console.error(
      "Error creating course:",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
