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
  sections: {
    title: string;
    lessons: {
      name: string;
      reading?: string;
      videoUrl?: string;
    }[];
  }[];
  attachments: {
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
        sections: {
          include: {
            lessons: true,
          },
        },
        instructor: {
          select: {
            id: true,
            fullName: true,
          },
        },
        attachments: true,
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
      sections,
      attachments: resources,
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
        sections: {
          create: sections.map((mod, index) => ({
            title: mod.title,
            order_index: index,
            lessons: {
              create: mod.lessons.map((les, lessonIndex) => ({
                title: les.name,
                content: les.reading,
                video_url: les.videoUrl,
                order_index: lessonIndex,
                updated_at: new Date(),
                is_free: false,
              })),
            },
          })),
        },
        attachments: {
          create: resources.map((res) => ({
            name: res.title,
            url: res.url,
            updatedAt: new Date(),
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
