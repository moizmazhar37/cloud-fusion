"use client";


import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { register } from "@/actions/register";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { RegisterSchema } from "@/schemas";
import { useForm } from "react-hook-form";


const RegisterPage = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      PATToken: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values)
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);
        });
    });
  };

  return (
    <>
      <div className="bg-black h-screen">
        <section className="font-nunito">
          <div className="hidden py-20 text-center bg-Bg  rounded lg:block border-b-4 border-current">
            <div className="max-w-6xl mx-auto mb-24">
              <span className="inline-block text-base font-medium text-white">
                Welcome Back
              </span>
              <h2 className="mb-6 font-semibold text-current mt-2 text-5xl dark:text-gray-300">
                Create an account
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
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="John Doe"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="PATToken"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Personal Access Token</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="******"
                              type="password"
                            />
                          </FormControl>
                          <FormMessage>
                            <span className="text-gray-500">
                              Optional. Required for private repositories.
                            </span>
                          </FormMessage>
                        </FormItem>
                      )}
                    />

                  </div>
                  <FormError message={error} />
                  <FormSuccess message={success} />
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
                    Create an account
                  </button>
                  <div className="flex items-center justify-center mt-6">
                    <span className="text-sm text-gray-300 mr-2">
                      Already have an account?
                    </span>
                    <Button
                      size="sm"
                      variant="link"
                      asChild
                      className="px-0 font-normal"
                    >
                      <Link href="/auth/login">
                        Login
                      </Link>
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

export default RegisterPage;