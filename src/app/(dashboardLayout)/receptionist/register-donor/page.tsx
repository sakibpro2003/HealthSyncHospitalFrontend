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
// import { useRegisterMutation } from "@/redux/features/auth/authApi";
import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRegisterDonorMutation } from "@/redux/features/donor/donorApi";

const RegisterDonorForm = () => {
  const [registerDonor] = useRegisterDonorMutation();
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
      const res = await registerDonor(modifiedData);

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
    { name: "address", label: "Address *" },
    { name: "email", label: "Email", type: "email" },
    { name: "age", label: "Age", type: "number" },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      options: ["male", "female", "other"],
    },
    {
      name: "bloodGroup",
      label: "Blood Group",
      type: "select",
      options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    { name: "quantity", label: "Quantity", type: "number" },
    { name: "lastDonationDate", type: "date", label: "Last Donation Date" },
  ];

  return (
    <div className="md:p-8">
      <div className="mx-auto md:p-10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
          Register Donor
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
            <div className="mt-8 text-center">
              <Button type="submit" className="w-full md:w-1/3">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterDonorForm;
