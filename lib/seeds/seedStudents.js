/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("../generated/prisma/client");
const { createClient } = require("@supabase/supabase-js");
const prisma = new PrismaClient();

// Initialize Supabase client with anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL or Anon Key is missing in environment variables"
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedStudents() {
  try {
    const students = [
      {
        email: "alice.johnson@student.com",
        fullName: "Alice Johnson",
        avatarUrl: "https://example.com/avatars/alice.jpg",
        phone: "+1234567891",
        bio: "Eager to learn web development",
      },
      {
        email: "bob.brown@student.com",
        fullName: "Bob Brown",
        avatarUrl: "https://example.com/avatars/bob.jpg",
        phone: "+0987654322",
        bio: "Interested in data science",
      },
    ];

    for (const student of students) {
      // Sign up user with Supabase Auth (client-side)
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: student.email,
          password: "securePassword123",
          options: {
            data: {
              fullName: student.fullName,
              avatarUrl: student.avatarUrl,
              phone: student.phone,
              bio: student.bio,
              role: "STUDENT", // Default role for students
              isActive: true,
            },
          },
        });

      if (signUpError)
        throw new Error(`Supabase Auth error: ${signUpError.message}`);

      const userId = signUpData.user?.id;

      if (!userId) throw new Error("Failed to retrieve user ID from Supabase");

      // Create or update Profile in Prisma
      await prisma.profile.upsert({
        where: { userId },
        update: {},
        create: {
          id: userId,
          userId,
          email: student.email,
          fullName: student.fullName,
          avatarUrl: student.avatarUrl,
          role: "STUDENT",
          bio: student.bio,
          phone: student.phone,
          isActive: true,
        },
      });

      console.log(`Student ${student.fullName} seeded successfully`);
    }
  } catch (error) {
    console.error("Error seeding students:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedStudents();
