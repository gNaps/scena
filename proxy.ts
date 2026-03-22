import { clerkMiddleware } from "@clerk/nextjs/server";
import { defaultLocale, locales } from "@/lib/i18n";
import { NextResponse } from "next/server";

export default clerkMiddleware((_auth, request) => {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const acceptLanguage = request.headers.get("accept-language") ?? "";
    const detected =
      locales.find((locale) =>
        acceptLanguage.toLowerCase().includes(locale)
      ) ?? defaultLocale;

    const url = request.nextUrl.clone();
    url.pathname = `/${detected}${pathname}`;
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
