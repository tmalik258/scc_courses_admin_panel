import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Increase the limit to prevent memory leak warnings in serverless environment
if (typeof process !== "undefined" && process.setMaxListeners) {
  process.setMaxListeners(20);
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Skip middleware for static files and API routes
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api/") ||
    request.nextUrl.pathname.match(
      /\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2)$/
    ) ||
    request.nextUrl.pathname === "/favicon.ico"
  ) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              secure: true,
              sameSite: "lax",
              httpOnly: true,
            })
          );
        },
      },
    }
  );

  // Define public routes
  const publicRoutes = ["/login", "/signup", "/auth", "/error"];
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // For public routes, just refresh the session without redirecting
  if (isPublicRoute) {
    try {
      await supabase.auth.getUser();
    } catch {
      // Ignore errors on public routes
    }
    return supabaseResponse;
  }

  // For protected routes, check authentication
  try {
    const { data, error } = await supabase.auth.getSession();
    if (data.session) {
      await supabase.auth.refreshSession();
    }
    if (error) {
      console.error("Session refresh error:", error.message);
      // const url = request.nextUrl.clone();
      // url.pathname = "/login";
      // return NextResponse.redirect(url);
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log("Authentication failed, redirecting to login:", userError?.message, userError?.status, userError?.code);
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // User is authenticated, allow access
    return supabaseResponse;
  } catch (error) {
    console.error("Middleware auth error:", error);
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}
