//path : apps/nextjs-app/src/testing/mocks/utils.ts
import Cookies from "js-cookie";
import { delay } from "msw";

import { db } from "./db";

//Encode an object into a base64 string
export const encode = (obj: any) => {
  const btoa = typeof window === "undefined" ? (str: string) => Buffer.from(str, "binary").toString("base64") : window.btoa;
  return btoa(JSON.stringify(obj));
};

// Decode a base64 string into an object
export const decode = (str: string) => {
  const atob = typeof window === "undefined" ? (str: string) => Buffer.from(str, "base64").toString("binary") : window.atob;
  return JSON.parse(atob(str));
};

// Hash a string using a simple hashing algorithm (DJB2)
export const hash = (str: string) => {
  let hash = 5381,
    i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return String(hash >>> 0);
};

// Simulate network delay in mock API calls
export const networkDelay = () => {
  const delayTime = process.env.TEST ? 200 : Math.floor(Math.random() * 700) + 300;
  return delay(delayTime);
};

// Omit specified keys from an object
const omit = <T extends object>(obj: T, keys: string[]): T => {
  const result = {} as T;
  for (const key in obj) {
    if (!keys.includes(key)) {
      result[key] = obj[key];
    }
  }

  return result;
};

// Sanitize user data by removing sensitive fields
export const sanitizeUser = <O extends object>(user: O) => omit<O>(user, ["password", "iat"]);

// Authenticate a user based on email and password
export function authenticate({ email, password }: { email: string; password: string }) {
  const user = db.user.findFirst({
    where: {
      email: {
        equals: email,
      },
    },
  });

  // Verify if the provided password matches the stored hash
  if (user?.password === hash(password)) {
    const sanitizedUser = sanitizeUser(user);
    const encodedToken = encode(sanitizedUser);
    return { user: sanitizedUser, jwt: encodedToken };
  }

  const error = new Error("Invalid username or password");
  throw error;
}

//Name of the authentication cookie
export const AUTH_COOKIE = `bulletproof_react_app_token`;

//Require authentication by verifying the JWT token in cookies
export function requireAuth(cookies: Record<string, string>) {
  try {
    const encodedToken = cookies[AUTH_COOKIE] || Cookies.get(AUTH_COOKIE);
    if (!encodedToken) {
      return { error: "Unauthorized", user: null };
    }
    const decodedToken = decode(encodedToken) as { id: string };

    const user = db.user.findFirst({
      where: {
        id: {
          equals: decodedToken.id,
        },
      },
    });

    if (!user) {
      return { error: "Unauthorized", user: null };
    }

    // Return sanitized user if authentication succeeds
    return { user: sanitizeUser(user) };
  } catch (err: any) {
    // Return unauthorized error if decoding fails
    return { error: "Unauthorized", user: null };
  }
}

//Require the user to have an ADMIN role, throw an error if not
export function requireAdmin(user: any) {
  if (user.role !== "ADMIN") {
    throw Error("Unauthorized");
  }
}

/**
 * Giải Thích Các Chức Năng Được Bình Luận
  encode / decode: Chuyển đổi dữ liệu thành base64 để tạo token.
  hash: Băm mật khẩu bằng thuật toán đơn giản (DJB2).
  networkDelay: Mô phỏng độ trễ mạng cho các API giả lập.
  omit: Xóa các thuộc tính không cần thiết khỏi đối tượng.
  sanitizeUser: Ẩn thông tin nhạy cảm của người dùng (password, iat).
  authenticate: Xác thực người dùng bằng email và mật khẩu.
  AUTH_COOKIE: Tên của cookie lưu trữ token JWT.
  requireAuth: Yêu cầu xác thực bằng cách kiểm tra token JWT trong cookie.
  requireAdmin: Đảm bảo người dùng có quyền ADMIN, nếu không, ném lỗi Unauthorized.
 */
