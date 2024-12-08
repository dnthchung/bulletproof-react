//path : apps/nextjs-app/src/testing/mocks/handlers/index.ts
import { HttpResponse, http } from "msw"; // Các công cụ từ MSW
import { env } from "@/config/env"; // Biến môi trường
import { networkDelay } from "../utils"; // Mô phỏng độ trễ mạng

import { authHandlers } from "./auth"; // Xử lý xác thực
import { commentsHandlers } from "./comments"; // Xử lý bình luận
import { discussionsHandlers } from "./discussions"; // Xử lý các bài thảo luận
import { teamsHandlers } from "./teams"; // Xử lý nhóm người dùng
import { usersHandlers } from "./users"; // Xử lý thông tin người dùng

export const handlers = [
  ...authHandlers, // Các API liên quan đến xác thực
  ...commentsHandlers, // Các API liên quan đến bình luận
  ...discussionsHandlers, // Các API liên quan đến bài thảo luận
  ...teamsHandlers, // Các API liên quan đến nhóm
  ...usersHandlers, // Các API liên quan đến người dùng

  // Health Check API - Kiểm tra trạng thái hệ thống
  http.get(`${env.API_URL}/healthcheck`, async () => {
    await networkDelay(); // Mô phỏng độ trễ mạng
    return HttpResponse.json({ ok: true }); // Trả về trạng thái "ok"
  }),
];

//Đây là file tổng hợp tất cả các API giả lập (mock API handlers) sử dụng trong dự án.
//Mục tiêu của file này là gom nhóm các handlers từ nhiều module (auth, users, teams, comments, discussions) vào một mảng duy nhất handlers,
//để dễ dàng tích hợp vào Mock Service Worker (MSW) khi khởi động ứng dụng trong môi trường phát triển hoặc kiểm thử.
