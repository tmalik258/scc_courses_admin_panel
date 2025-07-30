import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

if (typeof process !== "undefined" && process.setMaxListeners) {
  process.setMaxListeners(100); // Increased to avoid MaxListenersExceededWarning
}

export async function updateSession(request: NextRequest) {
  console.log(
    "Middleware: Invoked for:",
    request.nextUrl.pathname,
    "Query:",
    Object.fromEntries(request.nextUrl.searchParams)
  );
  console.log(
    "Middleware: Request cookies:",
    request.cookies
      .getAll()
      .map((c) => ({ name: c.name, value: c.value.substring(0, 20) + "..." }))
  );

  let supabaseResponse = NextResponse.next({ request });

  // Skip middleware for static files, API routes, and RSC requests
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api/") ||
    request.nextUrl.searchParams.has("_rsc") ||
    request.nextUrl.pathname.match(
      /\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2)$/
    ) ||
    request.nextUrl.pathname === "/favicon.ico"
  ) {
    console.log(
      "Middleware: Skipping request for:",
      request.nextUrl.pathname,
      "RSC:",
      request.nextUrl.searchParams.has("_rsc")
    );
    return supabaseResponse;
  }

  // Prevent redundant middleware execution
  if (request.headers.get("x-middleware-executed")) {
    console.log("Middleware: Skipping redundant invocation");
    return supabaseResponse;
  }
  supabaseResponse.headers.set("x-middleware-executed", "true");

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          console.log(
            "Middleware: Setting cookies:",
            cookiesToSet.map((c) => ({
              name: c.name,
              value: c.value.substring(0, 20) + "...",
            }))
          );
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, {
              ...options,
              secure: true,
              sameSite: "lax",
              httpOnly: true,
              path: "/",
              domain: "scc-admin-panel.web.app",
            });
          });
        },
      },
    }
  );

  const publicRoutes = ["/login", "/signup", "/auth", "/error"];
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isPublicRoute) {
    try {
      await supabase.auth.getUser();
    } catch {
      // Ignore errors on public routes
    }
    return supabaseResponse;
  }

  try {
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData?.session) {
      const authToken = request.cookies.get(
        "sb-nflffbbhnctgdaeyyfeq-auth-token"
      )?.value;
      if (authToken) {
        try {
          const tokenData = JSON.parse(
            Buffer.from(authToken.replace("base64-", ""), "base64").toString()
          );
          if (tokenData.refresh_token) {
            const { data, error } = await supabase.auth.refreshSession({
              refresh_token: tokenData.refresh_token,
            });
            if (!error && data.session) {
              return NextResponse.next(); // Session refreshed, proceed
            }
          }
        } catch (e) {
          console.log("Middleware: Failed to parse auth token:", e);
        }
      }
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    console.log(
      "Middleware: User fetch result:",
      user ? "User exists" : "No user",
      "User error:",
      userError?.message,
      userError?.status,
      userError?.code
    );

    if (userError || !user) {
      console.log(
        "Authentication failed, redirecting to login:",
        userError?.message,
        userError?.status,
        userError?.code
      );
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch (error) {
    console.error("Middleware auth error:", error);
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}
