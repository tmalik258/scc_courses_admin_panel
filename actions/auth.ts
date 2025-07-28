"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: signInData, error } = await supabase.auth.signInWithPassword(
    data
  );

  if (signInData?.user) {
    console.log("User data:", signInData.user);
    let profileData;
    try {
      profileData = await prisma.profile.findUnique({
        where: { userId: signInData.user.id },
      });
    } catch (e) {
      console.error("Database error finding profile:", e);
      return { error: "Database error finding profile" };
    }

    if (!profileData) {
      try {
        console.log("Creating new profile for user:", signInData.user.id);
        await prisma.profile.create({
          data: {
            userId: signInData.user.id,
            email: signInData.user.email ?? null,
            fullName:
              signInData.user.user_metadata?.name ??
              signInData.user.email?.split("@")[0] ??
              "Unknown User",
            avatarUrl: signInData.user.user_metadata?.picture ?? null,
            role: "ADMIN",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        });
      } catch (e) {
        console.error("Database error creating profile:", e);
        return { error: "Database error creating profile" };
      }
    }
  }

  if (error) {
    console.error("Login error:", error.message);
    return { error: error.message };
  }

  console.log("Login successful for user:", data.email);

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    fullName: (formData.get("fullName") as string) || null,
    // avatarUrl: (formData.get("avatarUrl") as string) || null,
  };

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (signUpError) {
    return { error: signUpError.message };
  }

  if (signUpData.user) {
    console.log("User data:", signUpData.user);
    let profileData;
    try {
      profileData = await prisma.profile.findUnique({
        where: { userId: signUpData.user.id },
      });
    } catch (e) {
      console.error("Database error finding profile:", e);
    }

    if (!profileData) {
      try {
        console.log("Creating new profile for user:", signUpData.user.id);
        await prisma.profile.create({
          data: {
            userId: signUpData.user.id,
            email: signUpData.user.email ?? null,
            fullName:
              signUpData.user.user_metadata?.name ??
              signUpData.user.email?.split("@")[0] ??
              "Unknown User",
            avatarUrl: signUpData.user.user_metadata?.picture ?? null,
            role: "ADMIN",
            isActive: true
          },
        });
      } catch (e) {
        console.error("Database error creating profile:", e);
        return { error: "Database error creating profile" };
      }
    }
  } else {
    console.error("No user data in session:", data);
    return { error: "No user data in session" };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Sign out error:", error.message);
    return { error: error.message };
  }

  console.log("User signed out successfully");

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect(data.url);
}
