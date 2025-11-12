/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
// import { useRegisterDonorMutation } from "@/redux/features/donor/donorApi";
import { useRegisterPatientMutation } from "@/redux/features/patient/patientApi";
import {
  Activity,
  HeartPulse,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

type RegisterFormProps = {
  showHeading?: boolean;
};

const RegisterForm = ({ showHeading = true }: RegisterFormProps) => {
  const [register] = useRegisterPatientMutation();
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
        const { error } = res;

        if (error && "status" in error) {
          const errData = (error as { data?: unknown }).data as any;

          if (Array.isArray(errData?.errorSources)) {
            errData.errorSources.forEach((e: any) => {
              toast.error(`${e.path}: ${e.message}`);
            });
          } else {
            toast.error(errData?.message || "Registration failed.");
          }
        } else if (error) {
          toast.error("Unexpected error occurred.");
          console.error(error);
        }
      }
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    }
  };

  type FieldType =
    | "text"
    | "email"
    | "password"
    | "select"
    | "textarea"
    | "date";

  type FieldDefinition = {
    name: string;
    label: string;
    type?: FieldType;
    options?: readonly string[];
    placeholder?: string;
    helperText?: string;
    fullWidth?: boolean;
  };

  const fieldDefinitions: Record<string, FieldDefinition> = {
    name: { name: "name", label: "Full name" },
    phone: { name: "phone", label: "Phone", placeholder: "+880 123 456 78" },
    email: {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "patient@email.com",
    },
    gender: {
      name: "gender",
      label: "Gender",
      type: "select",
      options: ["male", "female", "other"],
    },
    address: {
      name: "address",
      label: "Residential address",
      fullWidth: true,
      placeholder: "House 24, Road 7, Dhanmondi",
    },
    dateOfBirth: {
      name: "dateOfBirth",
      label: "Date of birth",
      type: "date",
    },
    bloodGroup: {
      name: "bloodGroup",
      label: "Blood group",
      type: "select",
      options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    maritalStatus: {
      name: "maritalStatus",
      label: "Marital status",
      type: "select",
      options: ["single", "married", "divorced", "widowed"],
    },
    emergencyContactName: {
      name: "emergencyContactName",
      label: "Emergency contact",
      placeholder: "Name of guardian / partner",
    },
    emergencyContactPhone: {
      name: "emergencyContactPhone",
      label: "Emergency phone",
      placeholder: "+880 123 000 999",
    },
    relationship: {
      name: "relationship",
      label: "Relationship",
      placeholder: "Spouse, parent, colleague",
    },
    occupation: {
      name: "occupation",
      label: "Occupation",
      placeholder: "Teacher at HealthSync School",
    },
    medicalHistory: {
      name: "medicalHistory",
      label: "Medical history",
      type: "textarea",
      fullWidth: true,
      helperText: "Key diagnoses, chronic conditions, previous surgeries.",
    },
    allergies: {
      name: "allergies",
      label: "Allergies",
      placeholder: "Penicillin, nuts, latex...",
    },
    currentMedications: {
      name: "currentMedications",
      label: "Current medications",
      type: "textarea",
      fullWidth: true,
      helperText: "List active prescriptions or over-the-counter support.",
    },
  };

  const sections: {
    title: string;
    description: string;
    icon: React.ReactNode;
    badge: string;
    fields: (keyof typeof fieldDefinitions)[];
  }[] = [
    {
      title: "Patient profile",
      description:
        "Baseline identity and demographic information for the central record.",
      icon: <UserRound className="h-5 w-5 text-emerald-500" />,
      badge: "Step 1",
      fields: [
        "name",
        "dateOfBirth",
        "gender",
        "maritalStatus",
        "phone",
        "email",
        "address",
      ],
    },
    {
      title: "Care & lifestyle insights",
      description:
        "Vitals, blood group, and relevant lifestyle context to help triage faster.",
      icon: <Activity className="h-5 w-5 text-emerald-500" />,
      badge: "Step 2",
      fields: [
        "bloodGroup",
        "occupation",
        "medicalHistory",
        "currentMedications",
        "allergies",
      ],
    },
    {
      title: "Emergency readiness",
      description:
        "Ensure we can contact the right person and act on emergency directives.",
      icon: <Users className="h-5 w-5 text-emerald-500" />,
      badge: "Step 3",
      fields: ["emergencyContactName", "relationship", "emergencyContactPhone"],
    },
  ];

  const renderField = (fieldKey: keyof typeof fieldDefinitions) => {
    const definition = fieldDefinitions[fieldKey];
    if (!definition) {
      return null;
    }

    const {
      name,
      label,
      type = "text",
      options,
      placeholder,
      helperText,
      fullWidth,
    } = definition;

    return (
      <FormField
        key={name}
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className={cn(fullWidth && "md:col-span-2")}>
            <FormLabel className="text-sm font-semibold text-slate-700">
              {label}
            </FormLabel>
            <FormControl>
              {type === "textarea" ? (
                <Textarea
                  {...field}
                  placeholder={placeholder}
                  value={field.value || ""}
                  className="min-h-[120px] rounded-2xl border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-200"
                />
              ) : type === "select" ? (
                <Select
                  onValueChange={field.onChange}
                  value={(field.value as string) ?? undefined}
                >
                  <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white/80 px-4 text-left text-sm font-medium text-slate-900">
                    <SelectValue placeholder={label} />
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
                  placeholder={placeholder}
                  value={field.value || ""}
                  className="h-12 rounded-2xl border-slate-200 bg-white/80 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-200"
                />
              )}
            </FormControl>
            {helperText ? (
              <p className="text-xs text-slate-500">{helperText}</p>
            ) : null}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <div className="relative isolate overflow-hidden rounded-[32px] border border-white/40 bg-gradient-to-br from-white to-emerald-50/40 p-6 shadow-[0_20px_80px_-60px_rgba(6,95,70,0.8)] md:p-10">
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-64 rounded-full bg-emerald-200/40 blur-3xl md:block"
        aria-hidden
      />
      {showHeading && (
        <div className="mb-8 space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            HealthSync
          </div>
          <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            Patient registration form
          </h2>
          <p className="text-sm text-slate-600 md:text-base">
            Capture verified details once to give every department the same,
            accurate patient profile.
          </p>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
          noValidate
        >
          <div className="grid gap-6">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50">
                      {section.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {section.title}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    {section.badge}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {section.fields.map((fieldKey) => renderField(fieldKey))}
                </div>
              </section>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-emerald-100 bg-white/90 px-4 py-4 text-sm text-slate-600">
            <div className="flex items-center gap-3">
              <HeartPulse className="h-5 w-5 text-emerald-500" />
              Data autosaves to the EMR once you submit.
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => form.reset()}
              >
                Clear form
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-white shadow-lg transition hover:shadow-xl"
              >
                Save & register patient
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
