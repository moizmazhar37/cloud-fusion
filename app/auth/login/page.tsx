"use client";

import Link from "next/link";

import { login } from "@/actions/login";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const LoginPage = () => {

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values, callbackUrl)
        .then((data:any) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
          }


        })
        .catch(() => setError("Something went wrong"));
    });
  };



  return (
    <>
      <div className="bg-black h-screen">
        <section className="font-nunito">
          <div className="hidden py-20 text-center bg-Bg  rounded lg:block border-b-4 border-current">
            <div className="max-w-6xl mx-auto mb-24">
              <span className="inline-block text-base font-medium text-white">Welcome Back</span>
              <h2 className="mb-6 font-semibold text-current mt-2 text-5xl dark:text-gray-300">
                Login to your account
              </h2>
              <p className="mb-6 text-xl text-white">
                Be part of our community 🎉
              </p>
            </div>
          </div>
          <div className="max-w-xl mx-auto ">
            <div className="w-full shadow-lg
                            bg-black bg-opacity-30
                            overflow-hidden
                            right-10
                            text-sm
                            z-10
                            top-8
                            text-gray-300
                            font-light
                            border
                            border-gray-700
                            mt-11 lg:-mt-28 lg:full 
                            rounded-xl
                            min-h-96
                            p-8
                            pt-12
                            w-full
                            backdrop-filter backdrop-blur-lg">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <>
                      <p className="text-white text-md font-semibold">
                        Enter your email and password to login
                      </p>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder="john.doe@example.com"
                                type="email"
                                className="border border-gray-700 rounded-md py-2 px-3 text-white w-full mt-1"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder="******"
                                type="password"
                                className="border border-gray-700 rounded-md py-2 px-3 text-white w-full mt-1"
                              />
                            </FormControl>
                            <Button
                              size="sm"
                              variant="link"
                              asChild
                              className="px-0 font-normal"
                            >
                              <Link href="/auth/reset">
                                Forgot password?
                              </Link>
                            </Button>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  </div>
                  <ErrorMsg error={error} />
                  <SuccessMsg success={success} />
                  <button
                    disabled={isPending}
                    type="submit"
                    className="w-full bg-current text-black rounded-md py-2
                      hover:bg-green-600
                      transition
                      duration-200
                      ease-in-out
                      transform
                      hover:-translate-y-1
                      hover:scale-104
                      mt-12
                      "
                  >
                    Login
                  </button>
                  <div className="flex items-center justify-center mt-6">
                    <span className="text-sm text-gray-300 mr-2">
                      Don't have an account?
                    </span>
                    <Button
                      size="sm"
                      variant="link"
                      asChild
                      className="px-0 font-normal cursor-pointer"
                    >
                      <Link href="/auth/register">Register</Link>
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default LoginPage;


const ErrorMsg = ({ error }: { error: string }) => (
  <div className="text-red-500">{error}</div>
);

const SuccessMsg = ({ success }: { success: string }) => (
  <div className="text-green-500">{success}</div>
);
