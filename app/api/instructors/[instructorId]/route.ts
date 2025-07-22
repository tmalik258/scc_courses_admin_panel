import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { instructorId: string } }
) {
  try {
    const { instructorId } = params;
    const instructor = await prisma.profile.findUnique({
      where: { id: instructorId, role: "INSTRUCTOR" },
      include: {
        instructorCourses: {
          include: {
            category: {
              select: {
                name: true,
                color: true,
              },
            },
            modules: {
              select: {
                lessons: {
                  select: { id: true }, // to count lessons
                },
              },
            },
          },
        },
      },
    });

    if (!instructor) {
      return NextResponse.json(
        { error: "Instructor not found" },
        { status: 404 }
      );
    }

    const transformedInstructor = {
      ...instructor,
      instructorCourses: instructor.instructorCourses.map((course) => ({
        id: course.id,
        title: course.title,
        category: course.category,
        totalLessons: course.modules.reduce(
          (sum, module) => sum + module.lessons.length,
          0
        ),
      })),
    };

    return NextResponse.json(transformedInstructor);
  } catch (error) {
    console.error("Error fetching instructor:", error);
    return NextResponse.json(
      { error: "Failed to fetch instructor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { instructorId: string } }
) {
  try {
    const { instructorId } = params;
    const instructor = await prisma.profile.delete({
      where: { id: instructorId, role: "INSTRUCTOR" },
    });

    if (!instructor) {
      return NextResponse.json(
        { error: "Instructor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Instructor deleted successfully" });
  } catch (error) {
    console.error("Error deleting instructor:", error);
    return NextResponse.json(
      { error: "Failed to delete instructor" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { instructorId: string } }
) {
  try {
    const { instructorId } = params;
    const body = await request.json();
    const { fullName, role, bio, phone, avatarUrl } = body; // Updated fields based on schema

    const updatedInstructor = await prisma.profile.update({
      where: { id: instructorId, role: "INSTRUCTOR" },
      data: {
        fullName,
        role, // Should remain "INSTRUCTOR" to ensure consistency
        bio,
        phone,
        avatarUrl,
        updatedAt: new Date(),
      },
      include: {
        instructorCourses: {
          include: {
            category: {
              select: {
                name: true,
                color: true,
              },
            },
            modules: {
              select: {
                lessons: {
                  select: { id: true }, // to count lessons
                },
              },
            },
          },
        },
      },
    });

    if (!updatedInstructor) {
      return NextResponse.json(
        { error: "Instructor not found" },
        { status: 404 }
      );
    }

    const transformedInstructor = {
      ...updatedInstructor,
      instructorCourses: updatedInstructor.instructorCourses.map((course) => ({
        id: course.id,
        title: course.title,
        category: course.category,
        totalLessons: course.modules.reduce(
          (sum, module) => sum + module.lessons.length,
          0
        ),
      })),
    };

    return NextResponse.json(transformedInstructor);
  } catch (error) {
    console.error("Error updating instructor:", error);
    return NextResponse.json(
      { error: "Failed to update instructor" },
      { status: 500 }
    );
  }
}
