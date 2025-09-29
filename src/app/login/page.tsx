/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";

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
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { Loader2, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";

const LoginForm = () => {
  const router = useRouter();
  const [login] = useLoginMutation();
  const form = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePrefill = (credential: "receptionist" | "user" | "admin") => {
    switch (credential) {
      case "receptionist":
        form.setValue("email", "sakibprodhan2003@gmail.com");
        form.setValue("password", "123456");
        break;
      case "user":
        form.setValue("email", "user1@gmail.com");
        form.setValue("password", "123456");
        break;
      case "admin":
        form.setValue("email", "admin@gmail.com");
        form.setValue("password", "12345678");
        break;
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (userData) => {
    try {
      setIsSubmitting(true);
      const res = await login(userData);
      if (res?.data?.success) {
        const token = res.data.data.accessToken;
        if (!token) {
          toast.error("No access token received.");
          return;
        }
        const decoded: any = jwtDecode(token);
        switch (decoded?.role) {
          case "user":
            router.push("/");
            break;
          case "receptionist":
            router.push("/receptionist");
            break;
          case "admin":
            router.push("/admin/create-new-medicine");
            break;
          default:
            toast.error("Unknown role detected.");
        }
      } else {
        toast.error("Login failed.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },
  ];

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-white via-violet-50/80 to-violet-100/40 px-4 py-10">
      <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-violet-200/50 blur-3xl" aria-hidden />
      <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl" aria-hidden />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8 rounded-[2.5rem] border border-white/40 bg-white/90 shadow-[0_35px_80px_-45px_rgba(91,33,182,0.35)] backdrop-blur-xl lg:flex-row lg:gap-12">
        <div className="flex-1 space-y-6 border-b border-white/40 px-10 py-12 text-slate-700 lg:border-b-0 lg:border-r">
          <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-violet-600">
            <Sparkles className="h-4 w-4" /> HealthSync Access
          </span>
          <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
            Welcome back to your command centre
          </h1>
          <p className="max-w-xl text-base text-slate-600">
            Manage appointments, monitor care journeys, and stay ahead of every update. Log in using your HealthSync credentials to continue delivering seamless patient experiences.
          </p>
          <div className="grid gap-3 text-sm">
            <div className="flex items-center gap-3 rounded-2xl bg-violet-50/70 p-4 text-violet-700">
              <ShieldCheck className="h-5 w-5" /> Secure SSO with role-based dashboards
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-900/90 p-4 text-white">
              <Stethoscope className="h-5 w-5" /> Doctor availability and bookings at a glance
            </div>
          </div>
        </div>

        <div className="flex-1 px-10 py-12">
          <div className="flex flex-wrap gap-3 pb-6">
            <Button
              variant="outline"
              className="rounded-full border-violet-200 text-violet-600 hover:bg-violet-50"
              onClick={() => handlePrefill("receptionist")}
            >
              Receptionist demo
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-violet-200 text-violet-600 hover:bg-violet-50"
              onClick={() => handlePrefill("user")}
            >
              Patient demo
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-violet-200 text-violet-600 hover:bg-violet-50"
              onClick={() => handlePrefill("admin")}
            >
              Admin demo
            </Button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {fields.map(({ name, label, type }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-600">{label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type={type}
                          value={field.value || ""}
                          className="h-12 rounded-2xl border-slate-200 bg-white/80 px-4 text-slate-900 shadow-sm focus-visible:border-violet-400 focus-visible:ring-violet-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-full bg-violet-600 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Processing…
                  </span>
                ) : (
                  "Log in to dashboard"
                )}
              </Button>

              <p className="pt-2 text-center text-sm text-slate-500">
                Don&apos;t have an account yet?{" "}
                <Link href="/register" className="font-semibold text-violet-600 hover:underline">
                  Create one now
                </Link>
                .
              </p>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
