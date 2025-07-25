/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";

const RegisterForm = () => {
  const [register] = useRegisterMutation();
  const form = useForm();
  const onSubmit: SubmitHandler<FieldValues> = async (userData) => {
    const {
      emergencyContactName,
      emergencyContactPhone,
      relationship,
      ...rest
    } = userData;
    const emergencyContact = {
      emergencyContactName: emergencyContactName,
      relationship: relationship,
      emergencyContactPhone: emergencyContactPhone,
    };

    const modifiedData = {
      ...rest,
      emergencyContact,
    };

    //! Caution!!
    try {
      const res = await register(modifiedData);

      if ("data" in res && res.data?.success) {
        toast.success("Registration successful");
      } else if ("error" in res) {
        const error = res.error;

        // Check if it's a FetchBaseQueryError
        if ("status" in error) {
          const errData = error.data as any;

          if (Array.isArray(errData?.errorSources)) {
            errData.errorSources.forEach((e: any) => {
              toast.error(`${e.path}: ${e.message}`);
            });
          } else {
            toast.error(errData?.message || "Registration failed.");
          }
        } else {
          // SerializedError fallback
          toast.error("Unexpected error occurred.");
          console.error(error);
        }
      }
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    }
  };

  const fields = [
    { name: "name", label: "Full Name" },
    { name: "phone", label: "Phone *" },
    { name: "email", label: "Email", type: "email" },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      options: ["male", "female", "other"],
    },
    { name: "address", label: "Address" },
    { name: "dateOfBirth", label: "Date of Birth", type: "date" },
    {
      name: "bloodGroup",
      label: "Blood Group",
      type: "select",
      options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    { name: "password", label: "Password", type: "password" },
    { name: "confirm_password", label: "Confirm Password", type: "password" },
    // {
    //   name: "maritalStatus",
    //   label: "Marital Status",
    //   type: "select",
    //   options: ["single", "married", "divorced", "widowed"],
    // },
    // { name: "emergencyContactName", label: "Emergency Contact Name" },
    // { name: "emergencyContactPhone", label: "Emergency Contact Phone" },

    // {
    //   name: "relationship",
    //   label: "Emergency Contact Relationship",
    // },
    // { name: "occupation", label: "Occupation" },
    // { name: "medicalHistory", label: "Medical History", type: "textarea" },
    // { name: "allergies", label: "Allergies" },
    // {
    //   name: "currentMedications",
    //   label: "Current Medications",
    //   type: "textarea",
    // },
  ];
  // className='flex justify-center items-center content-center w-screen h-screen'
  return (
    <div className="flex justify-center items-center content-center w-screen h-screen">
      <div className="mx-auto md:p-10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
          SignUp
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fields.map(({ name, label, options, type = "text" }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        {type === "textarea" ? (
                          <Textarea
                            {...field}
                            placeholder=""
                            value={field.value || ""}
                          />
                        ) : type === "select" ? (
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder={`${label}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            {...field}
                            type={type}
                            placeholder=""
                            value={field.value || ""}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <p className="mt-4">
              Already registered? Go to{" "}
              <Link className="text-blue-600 underline" href={"/login"}>
                Login
              </Link>{" "}
              page.
            </p>
            <div className="mt-8 text-center">
              <Button type="submit" className="w-full md:w-1/3">
                SignUp
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
