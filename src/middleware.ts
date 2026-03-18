import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/courses",
  "/ai-automation",
  "/vibe-coding",
  "/about",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
export default clerkMiddleware(async (auth, req) => {
  const session = await auth();

  if (isPublicRoute(req)) {
    return;
  }

  if ((isDashboardRoute(req) || req.nextUrl.pathname.startsWith("/admin")) && !session.userId) {
    return session.redirectToSignIn();
  }
});

export const config = {
  matcher: [
    "/",
    "/(api|trpc)(.*)",
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/dashboard(.*)",
    "/admin(.*)",
  ],
};


