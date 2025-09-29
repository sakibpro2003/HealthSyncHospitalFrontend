/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { HeartPulse, Loader2, ShieldPlus } from "lucide-react";

type FieldType =
  | "text"
  | "email"
  | "password"
  | "select"
  | "textarea"
  | "date"
  | "number";

type FieldDefinition = {
  name: string;
  label: string;
  type?: FieldType;
  options?: readonly string[];
  placeholder?: string;
};

const personalFields: FieldDefinition[] = [
  { name: "name", label: "Full name" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone" },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: ["male", "female", "other"],
  },
  { name: "dateOfBirth", label: "Date of birth", type: "date" },
  {
    name: "bloodGroup",
    label: "Blood group",
    type: "select",
    options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  { name: "address", label: "Address" },
  { name: "occupation", label: "Occupation" },
];

const credentialFields: FieldDefinition[] = [
  { name: "password", label: "Password", type: "password" },
  { name: "confirm_password", label: "Confirm password", type: "password" },
];

const emergencyFields: FieldDefinition[] = [
  { name: "emergencyContactName", label: "Emergency contact name" },
  { name: "relationship", label: "Relationship" },
  { name: "emergencyContactPhone", label: "Emergency contact phone" },
  {
    name: "medicalHistory",
    label: "Medical history",
    type: "textarea",
    placeholder: "Allergies, chronic conditions, recent surgeries...",
  },
  { name: "allergies", label: "Allergies", type: "textarea" },
];

const RegisterForm = () => {
  const [register] = useRegisterMutation();
  const form = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit: SubmitHandler<FieldValues> = async (userData) => {
    const {
      emergencyContactName,
      emergencyContactPhone,
      relationship,
      ...rest
    } = userData;
    const payload = {
      ...rest,
      emergencyContact: {
        emergencyContactName,
        emergencyContactPhone,
        relationship,
      },
    };

    try {
      setIsSubmitting(true);
      const res = await register(payload);
      if ("data" in res && res.data?.success) {
        toast.success("Registration successful");
        form.reset();
      } else if ("error" in res) {
        const error = res.error as any;
        if ("status" in error) {
          const errData = error.data as any;
          if (Array.isArray(errData?.errorSources)) {
            errData.errorSources.forEach((e: any) =>
              toast.error(`${e.path}: ${e.message}`)
            );
          } else {
            toast.error(errData?.message || "Registration failed.");
          }
        } else {
          toast.error("Unexpected error occurred.");
        }
      }
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  const renderField = ({
    name,
    label,
    type = "text",
    options = [] as readonly string[],
    placeholder,
  }: FieldDefinition) => (
    <FormField
      key={name}
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium text-slate-600">
            {label}
          </FormLabel>
          <FormControl>
            {type === "textarea" ? (
              <Textarea
                {...field}
                value={field.value || ""}
                placeholder={placeholder || ""}
                className="min-h-[120px] rounded-2xl border-slate-200 bg-white/85 px-4 py-3 text-slate-900 shadow-sm focus-visible:border-violet-400 focus-visible:ring-violet-200"
              />
            ) : type === "select" ? (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white/85 px-4 text-left text-slate-900 shadow-sm focus-visible:border-violet-400 focus-visible:ring-violet-200">
                  <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
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
                value={field.value || ""}
                className="h-12 rounded-2xl border-slate-200 bg-white/85 px-4 text-slate-900 shadow-sm focus-visible:border-violet-400 focus-visible:ring-violet-200"
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-violet-50/70 to-violet-100/30 px-4 py-12">
      <div
        className="absolute -left-24  w-72 rounded-full bg-violet-200/40 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-sky-200/50 blur-3xl"
        aria-hidden
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative z-10 w-full"
        >
          <div className="mx-auto grid w-full max-w-7xl gap-10 overflow-hidden rounded-[2.5rem] border border-white/50 bg-white/95 p-10 shadow-[0_40px_100px_-60px_rgba(76,29,149,0.45)] backdrop-blur-xl xl:grid-cols-[1fr_1.05fr_1.05fr]">
            <div className="space-y-6 text-slate-700">
              <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-violet-600">
                <ShieldPlus className="h-4 w-4" /> Join HealthSync
              </span>
              <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
                Create your unified care profile
              </h1>
              <p className="text-base text-slate-600">
                Register once to synchronise appointments, diagnostics,
                prescriptions, and emergency contacts across the HealthSync
                Hospital network.
              </p>
              <div className="grid gap-3 text-sm">
                <div className="flex items-center gap-3 rounded-2xl bg-violet-50/70 p-4 text-violet-700">
                  <HeartPulse className="h-5 w-5" /> Track appointments, lab
                  results, and bills in real time.
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-slate-900/90 p-4 text-white">
                  <ShieldPlus className="h-5 w-5" /> Share secure access with
                  family and emergency responders.
                </div>
              </div>
              <p className="text-sm text-slate-500">
                Already onboard?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-violet-600 hover:underline"
                >
                  Log in here
                </Link>
                .
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Personal information
                </h2>
                <p className="text-sm text-slate-500">
                  Tell us a little about yourself to tailor your care
                  experience.
                </p>
              </div>
              <div className="grid gap-5">
                {personalFields.map((field) => renderField(field))}
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Security credentials
                  </h2>
                  <p className="text-sm text-slate-500">
                    Set a strong password to keep your health data safe.
                  </p>
                </div>
                <div className="grid gap-5">
                  {credentialFields.map((field) => renderField(field))}
                </div>
              </div>

              <Separator className="bg-slate-200" />

              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Emergency details
                  </h2>
                  <p className="text-sm text-slate-500">
                    Help our clinicians act quickly when every second counts.
                  </p>
                </div>
                <div className="grid gap-5">
                  {emergencyFields.map((field) => renderField(field))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-auto h-12 w-full rounded-full bg-violet-600 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Creating
                    account…
                  </span>
                ) : (
                  "Create account"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default RegisterForm;
