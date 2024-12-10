//path : apps/nextjs-app/middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { paths } from "@/config/paths"; // Import paths

// Middleware kiểm tra xác thực
export function middleware(request: NextRequest) {
  console.log("Middleware triggered for:", request.nextUrl.pathname);

  const authToken = request.cookies.get("bulletproof_react_app_token")?.value;
  console.log("Auth Token:", authToken);

  if (!authToken) {
    const loginUrl = new URL(paths.auth.login.getHref(request.nextUrl.pathname), request.url);
    console.log("Redirecting to:", loginUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Cấu hình matcher để chỉ bảo vệ các trang cụ thể
export const config = {
  matcher: ["/app/:path*"], // Áp dụng cho tất cả route trong /app
};

// => deo dùng được vì cho nextjs server thôi
