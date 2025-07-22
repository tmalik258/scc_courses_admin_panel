import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { CourseFormData } from "@/types/course";

// Type for studentGrowth groupBy result
interface StudentGrowthResult {
  createdAt: Date;
  _count: {
    id: number;
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const studentId = searchParams.get("studentId");
  const courseId = searchParams.get("courseId");
  const status = searchParams.get("status");
  const paymentMethod = searchParams.get("paymentMethod");

  try {
    switch (type) {
      case "students":
        const students = await prisma.profile.findMany({
          where: { role: "STUDENT" },
          include: {
            purchases: {
              include: {
                course: true,
              },
            },
          },
        });
        return NextResponse.json({ data: students });

      case "courses":
        const courses = await prisma.course.findMany({
          include: {
            category: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
            modules: {
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
            resources: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
        return NextResponse.json({ data: { courses } });

      case "purchased-courses":
        const purchasedCourses = await prisma.invoice.findMany({
          where: {
            ...(studentId && {
              studentName: {
                contains: studentId,
                mode: "insensitive",
              },
            }),
            ...(courseId && {
              purchase: {
                courseId,
              },
            }),
            ...(status && { status }),
            ...(paymentMethod && { paymentMethod }),
          },
          include: {
            purchase: {
              include: {
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
        return NextResponse.json({ data: { count: purchasedCourses.length } });

      case "total-revenue":
        const payments = await prisma.invoice.findMany({
          where: {
            ...(studentId && {
              studentName: {
                contains: studentId,
                mode: "insensitive",
              },
            }),
            ...(courseId && {
              purchase: {
                courseId,
              },
            }),
            ...(status && { status }),
            ...(paymentMethod && { paymentMethod }),
          },
          select: {
            totalAmount: true,
          },
        });
        const totalRevenue = payments.reduce(
          (sum, payment) =>
            sum + (payment.totalAmount ? Number(payment.totalAmount) : 0),
          0
        );
        return NextResponse.json({ data: { totalRevenue } });

      case "dashboard":
        const totalStudents = await prisma.profile.count({
          where: { role: "STUDENT" },
        });
        const totalCourses = await prisma.course.count();
        const purchasedCoursesCount = await prisma.invoice.count();
        const totalRevenueResult = await prisma.invoice.aggregate({
          _sum: {
            totalAmount: true,
          },
        });
        const studentGrowth = (await prisma.profile.groupBy({
          by: ["createdAt"],
          where: { role: "STUDENT" },
          _count: {
            id: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        })) as StudentGrowthResult[];
        const recentCoursesData = await prisma.course.findMany({
          select: {
            id: true,
            title: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        });
        const popularCoursesData = await prisma.course.findMany({
          include: {
            category: {
              select: {
                name: true,
                color: true,
              },
            },
            instructor: {
              select: {
                fullName: true,
              },
            },
            purchases: true,
            modules: {
              include: {
                lessons: true,
              },
            },
          },
          orderBy: {
            purchases: {
              _count: "desc",
            },
          },
          take: 5,
        });

        const recentCourses = recentCoursesData.map((course) => ({
          id: course.id,
          title: course.title,
          timeAgo: new Date(course.createdAt).toISOString(),
        }));

        const popularCourses = popularCoursesData.map((course) => ({
          id: course.id,
          title: course.title,
          category: course.category.name,
          categoryColor: course.category.color || "#000000",
          instructor: course.instructor.fullName,
          enrollments: course.purchases.length,
          price: course.price ? course.price.toString() : "0",
          lessons: course.modules.reduce(
            (sum, mod) => sum + mod.lessons.length,
            0
          ),
        }));

        return NextResponse.json({
          data: {
            totalStudents,
            totalCourses,
            purchasedCourses: purchasedCoursesCount,
            totalRevenue: totalRevenueResult._sum.totalAmount
              ? Number(totalRevenueResult._sum.totalAmount)
              : 0,
            studentGrowth: studentGrowth.map((entry) => ({
              month: new Date(entry.createdAt).toISOString().slice(0, 7),
              value: entry._count.id,
            })),
            recentCourses,
            popularCourses,
          },
        });

      case "popular-courses":
        const popularCoursesResult = await prisma.course.findMany({
          include: {
            category: {
              select: {
                name: true,
                color: true,
              },
            },
            instructor: {
              select: {
                fullName: true,
              },
            },
            purchases: true,
            modules: {
              include: {
                lessons: true,
              },
            },
          },
          orderBy: {
            purchases: {
              _count: "desc",
            },
          },
          take: 5,
        });

        const formattedPopularCourses = popularCoursesResult.map((course) => ({
          id: course.id,
          name: course.title,
          category: course.category.name,
          categoryColor: course.category.color || "#000000",
          instructor: course.instructor.fullName,
          sales: course.purchases.length,
          price: course.price ? course.price.toString() : "0",
          lessons: course.modules.reduce(
            (sum, mod) => sum + mod.lessons.length,
            0
          ),
        }));

        return NextResponse.json({
          data: { courses: formattedPopularCourses },
        });

      default:
        return NextResponse.json(
          { error: "Invalid request type" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("[DASHBOARD] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// UUID validation helper function
function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
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
      thumbnailUrl,
      modules,
      resources,
    } = body;

    // Validate required fields
    if (!title || !instructor || !category) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: title, instructor, and category are required.",
        },
        { status: 400 }
      );
    }

    // Validate UUID formats
    if (!isValidUUID(instructor)) {
      return NextResponse.json(
        { error: "Invalid instructor ID format. Must be a valid UUID." },
        { status: 400 }
      );
    }

    if (!isValidUUID(category)) {
      return NextResponse.json(
        { error: "Invalid category ID format. Must be a valid UUID." },
        { status: 400 }
      );
    }

    // Validate instructor exists and has correct role
    const instructor_profile = await prisma.profile.findFirst({
      where: {
        id: instructor,
        role: "INSTRUCTOR",
      },
    });

    if (!instructor_profile) {
      return NextResponse.json(
        { error: "Instructor not found or does not have instructor role." },
        { status: 404 }
      );
    }

    // Validate category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: category },
    });

    if (!categoryExists) {
      return NextResponse.json(
        { error: "Category not found." },
        { status: 404 }
      );
    }

    // Create the course
    const createdCourse = await prisma.course.create({
      data: {
        title,
        description: description || null,
        instructorId: instructor_profile.id,
        categoryId: category,
        price: price ? new Decimal(price) : null,
        thumbnailUrl: thumbnailUrl || null,
        isPublished: false,
      },
    });

    // Create modules and lessons
    if (modules && modules.length > 0) {
      for (const [index, mod] of modules.entries()) {
        const createdModule = await prisma.module.create({
          data: {
            title: mod.title,
            order_index: index,
            courseId: createdCourse.id,
          },
        });

        // Create lessons for this module
        if (mod.lessons && mod.lessons.length > 0) {
          for (const [lessonIndex, les] of mod.lessons.entries()) {
            await prisma.lessons.create({
              data: {
                title: les.name,
                content: les.reading || null,
                video_url: les.videoUrl || null,
                order_index: lessonIndex,
                updated_at: new Date(),
                is_free: false,
                module_id: createdModule.id,
                course_id: createdCourse.id,
              },
            });
          }
        }
      }
    }

    // Create resources
    if (resources && resources.length > 0) {
      for (const res of resources) {
        await prisma.resources.create({
          data: {
            id: crypto.randomUUID(),
            name: res.title,
            url: res.url,
            course_id: createdCourse.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json(
      { success: true, course: createdCourse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating course:", error);

    if (error instanceof Error) {
      if (error.message.includes("Invalid") && error.message.includes("UUID")) {
        return NextResponse.json(
          { error: "Invalid UUID format in request data." },
          { status: 400 }
        );
      }

      if (error.message.includes("Foreign key constraint")) {
        return NextResponse.json(
          { error: "Invalid reference to instructor or category." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
