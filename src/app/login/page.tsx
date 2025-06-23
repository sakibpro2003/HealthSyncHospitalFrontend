/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
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
import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

const LoginForm = () => {
  const [login] = useLoginMutation();
  const form = useForm();

  const handleReceptionist = ()=>{
    form.setValue("email","sakibprodhan2003@gmail.com")
    form.setValue("password","123456")
  }
  const handleUser = ()=>{
    form.setValue("email","user1@gmail.com")
    form.setValue("password","123456")
  }
  
  const onSubmit: SubmitHandler<FieldValues> = async (userData) => {
    try {
      const res = await login(userData);
      console.log(res,'resssss')
      // console.log(res.data.data.result.accessToken,'token')

      // if ("data" in res && res.data?.success) {
      //   toast.success("Login successful");
      // } else if ("error" in res) {
      //   const error = res.error;
      //   if ("status" in error) {
      //     const errData = error.data as any;
      //     if (Array.isArray(errData?.errorSources)) {
      //       errData.errorSources.forEach((e: any) => {
      //         toast.error(`${e.path}: ${e.message}`);
      //       });
      //     } else {
      //       toast.error(errData?.message || "Login failed.");
      //     }
      //   } else {
      //     toast.error("Unexpected error occurred.");
      //     console.error(error);
      //   }
      // }
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    }
  };

  const fields = [
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Welcome Back
        </h2>

        <div className="flex gap-4">
            <Button onClick={handleReceptionist} className="bg-red-500 mb-4">Receptionist Credentials</Button>
        <Button onClick={handleUser} className="bg-red-500 mb-4">User Credentials</Button>
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
                    <FormLabel className="text-gray-700">{label}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type={type}
                        className="w-full"
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button type="submit" className="w-full text-base font-semibold">
              Log In
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
