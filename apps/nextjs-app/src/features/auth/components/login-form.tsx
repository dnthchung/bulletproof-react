"use client"; // Kích hoạt chế độ client-side rendering (CSR)

import NextLink from "next/link"; // Điều hướng không tải lại trang
import { useSearchParams } from "next/navigation"; // Lấy tham số URL trong Next.js

// Import các thành phần UI
import { Button } from "@/components/ui/button";
import { Form, Input } from "@/components/ui/form";

// Config
import { paths } from "@/config/paths"; // Định nghĩa các đường dẫn của ứng dụng
import { useLogin, loginInputSchema } from "@/lib/auth"; // Hook đăng nhập và schema xác thực

type LoginFormProps = {
  onSuccess: () => void; // Callback khi đăng nhập thành công
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const login = useLogin({ onSuccess }); // Sử dụng hook login khi đăng nhập thành công

  const searchParams = useSearchParams(); // Lấy các tham số URL từ Next.js
  const redirectTo = searchParams?.get("redirectTo"); // Lấy giá trị "redirectTo" từ URL
  return (
    <div>
      <Form
        onSubmit={(values) => {
          login.mutate(values); //Trong React Query (TanStack Query), mutate là một hàm được cung cấp bởi các hook như useMutation để thực thi các hành động thay đổi dữ liệu (create, update, delete) trên server hoặc API.
        }}
        schema={loginInputSchema}
      >
        {({ register, formState }) => (
          <>
            <Input type='email' label='Email Address' error={formState.errors["email"]} registration={register("email")} />
            <Input type='password' label='Password' error={formState.errors["password"]} registration={register("password")} />
            <div>
              <Button isLoading={login.isPending} type='submit' className='w-full'>
                Log in
              </Button>
            </div>
          </>
        )}
      </Form>
      <div className='mt-2 flex items-center justify-end'>
        <div className='text-sm'>
          <NextLink href={paths.auth.register.getHref(redirectTo)} className='font-medium text-blue-600 hover:text-blue-500'>
            Register
          </NextLink>
        </div>
      </div>
    </div>
  );
};

//path apps/nextjs-app/src/features/auth/components/register-form.tsx
