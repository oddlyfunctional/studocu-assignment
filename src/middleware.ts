"use server";
import { getLocale } from "@/actions/i18nActions";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  if (!req.cookies.get("NEXT_LOCALE")) {
    res.cookies.set("NEXT_LOCALE", await getLocale());
  }

  return res;
}

export const config = {
  matcher: "/",
};
