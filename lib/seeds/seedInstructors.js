/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("../generated/prisma/client");
const { createClient } = require('@supabase/supabase-js');
const prisma = new PrismaClient();

// Initialize Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL or Service Role Key is missing in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedInstructors() {
  try {
    const instructors = [
      {
        email: "john.doe@instructor.com",
        fullName: "John Doe",
        avatarUrl: "https://example.com/avatars/john.jpg",
        role: "INSTRUCTOR",
        phone: "+1234567890",
        bio: "Experienced web development instructor",
      },
      {
        email: "jane.smith@instructor.com",
        fullName: "Jane Smith",
        avatarUrl: "https://example.com/avatars/jane.jpg",
        role: "INSTRUCTOR",
        phone: "+0987654321",
        bio: "Expert in data science and AI",
      },
    ];

    for (const instructor of instructors) {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: instructor.email,
        password: "securePassword123",
        email_confirm: true,
      });

      if (authError) throw new Error(`Supabase Auth error: ${authError.message}`);

      const userId = authData.user?.id;

      if (!userId) throw new Error("Failed to retrieve user ID from Supabase");

      // Create or update Profile in Prisma
      await prisma.profile.upsert({
        where: { userId },
        update: {},
        create: {
          id: userId,
          userId,
          email: instructor.email,
          fullName: instructor.fullName,
          avatarUrl: instructor.avatarUrl,
          role: instructor.role,
          bio: instructor.bio,
          phone: instructor.phone,
          isActive: true,
        },
      });

      console.log(`Instructor ${instructor.fullName} seeded successfully`);
    }
  } catch (error) {
    console.error("Error seeding instructors:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedInstructors();