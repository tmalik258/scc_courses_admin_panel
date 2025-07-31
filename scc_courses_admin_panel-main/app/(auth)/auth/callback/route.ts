import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (code) {
    // Only check for code, state is optional
    try {
      console.log("Attempting to exchange code for session...");
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.log(
          "Error exchanging code:",
          error.message,
          error.status,
          error.code
        );
        redirect("/error");
      }

      if (data.user) {
        console.log("User data:", data.user);
        let profileData;
        try {
          profileData = await prisma.profile.findUnique({
            where: { userId: data.user.id },
          });
        } catch (e) {
          console.error("Database error finding profile:", e);
        }

        if (!profileData) {
          try {
            console.log("Creating new profile for user:", data.user.id);
            await prisma.profile.create({
              data: {
                userId: data.user.id,
                email: data.user.email ?? null,
                fullName:
                  data.user.user_metadata?.name ??
                  data.user.email?.split("@")[0] ??
                  "Unknown User",
                avatarUrl: data.user.user_metadata?.picture ?? null,
                role: "ADMIN",
                isActive: true,
              },
            });
          } catch (e) {
            console.error("Database error creating profile:", e);
            redirect("/error?message=Database error");
          }
        }

        revalidatePath("/", "layout");
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/`);
      } else {
        console.log("No user data in session:", data);
        redirect("/error?message=No user data received");
      }
    } catch (e) {
      console.error("Unexpected error in callback:", e);
      redirect("/error?message=Unexpected error");
    }
  } else {
    console.log("Missing code:", { code, state });
    redirect("/error?message=Authentication failed");
  }
}
