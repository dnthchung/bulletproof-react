//path : apps/nextjs-app/middleware.ts

// path: apps/nextjs-app/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { paths } from "@/config/paths"; // Import paths

// Middleware kiểm tra xác thực
export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("bulletproof_react_app_token")?.value;

  // Nếu không có token, chuyển hướng về trang login
  if (!authToken) {
    const loginUrl = new URL(paths.auth.login.getHref(request.nextUrl.pathname), request.url);
    return NextResponse.redirect(loginUrl); // Điều hướng về /auth/login
  }

  return NextResponse.next(); // Cho phép truy cập nếu đã đăng nhập
}

// Cấu hình matcher để chỉ bảo vệ các trang cụ thể
export const config = {
  matcher: [
    paths.app.dashboard.getHref(), // Bảo vệ /app
    paths.app.discussions.getHref(), // Bảo vệ /app/discussions
    `${paths.app.discussions.getHref()}/*`, // Bảo vệ tất cả các trang con của /app/discussions
    `${paths.app.profile.getHref()}/*`,
    paths.app.profile.getHref(), // Bảo vệ /app/profile
    paths.app.users.getHref(), // Bảo vệ /app/users
  ],
};
