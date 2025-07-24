// lib/actions/get-courses.ts
"use server";
import { prisma } from "@/lib/db";

export async function getPopularCourses() {
  const courses = await prisma.course.findMany({
    orderBy: {
      studentsEnrolled: "desc", // adjust if you have a popularity metric
    },
    take: 8, // get top 8 courses
    include: {
      mentor: true, // if you want mentor name
    },
  });

  return courses;
}
