/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("../generated/prisma/client");
const { createClient } = require("@supabase/supabase-js");
const prisma = new PrismaClient();

// Initialize Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Supabase URL or Service Role Key is missing in environment variables"
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
      try {
        let userId;

        // Attempt to create user in Supabase Auth (admin API)
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: student.email,
          password: "securePassword123",
          email_confirm: true,
          user_metadata: {
            fullName: student.fullName,
            avatarUrl: student.avatarUrl,
            phone: student.phone,
            bio: student.bio,
            role: "STUDENT",
            isActive: true,
          },
        });

        if (authError) {
          if (authError.message.includes("already been registered")) {
            console.log(`User ${student.email} already exists, attempting to retrieve user ID`);
            const { data: users, error: listError } = await supabase.auth.admin.listUsers();
            if (listError) {
              console.warn(`Supabase list users error: ${listError.message}, skipping`);
              continue;
            }
            const existingUser = users.users.find(user => user.email === student.email);
            if (!existingUser) {
              console.warn(`User with email ${student.email} not found, skipping`);
              continue;
            }
            userId = existingUser.id;
          } else {
            console.warn(`Supabase Auth error for ${student.email}: ${authError.message}, skipping`);
            continue;
          }
        } else {
          userId = authData.user?.id;
        }

        if (!userId) {
          console.warn(`Failed to retrieve user ID for ${student.email}, skipping`);
          continue;
        }

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
      } catch (error) {
        console.error(`Error seeding student ${student.fullName}:`, error.message);
        continue;
      }
    }
  } catch (error) {
    console.error("Error seeding students:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedStudents();