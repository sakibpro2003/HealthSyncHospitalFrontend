"use client";

import React, { use, useEffect } from "react";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  AlertCircle,
  Calendar,
  Droplet,
  HeartPulse,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import Loader from "@/components/shared/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetSinglePatientQuery,
  useUpdatePatientMutation,
  type IPatient,
} from "@/redux/features/patient/patientApi";

interface IParams {
  params: Promise<{ id: string }>;
}
type PatientFormValues = {
  name: string;
  phone: string;
  email: string;
  gender: string;
  address: string;
  dateOfBirth: string;
  bloodGroup: string;
  maritalStatus: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  relationship: string;
  occupation: string;
  medicalHistory: string;
  allergies: string;
  currentMedications: string;
};

const defaultFormValues: PatientFormValues = {
  name: "",
  phone: "",
  email: "",
  gender: "",
  address: "",
  dateOfBirth: "",
  bloodGroup: "",
  maritalStatus: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  relationship: "",
  occupation: "",
  medicalHistory: "",
  allergies: "",
  currentMedications: "",
};

const normaliseListField = (value?: string | string[]) =>
  Array.isArray(value)
    ? value.join(", ")
    : typeof value === "string"
    ? value
    : "";

const parseListField = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const GENDER_OPTIONS = ["male", "female", "other"] as const;
const BLOOD_GROUP_OPTIONS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;
const MARITAL_STATUS_OPTIONS = [
  "single",
  "married",
  "divorced",
  "widowed",
] as const;

const extractErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as { data?: { message?: unknown } }).data?.message === "string"
  ) {
    return (error as { data: { message: string } }).data.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const PatientDetailsPage = ({ params }: IParams) => {
  const { id } = use(params);
  const { data, isLoading } = useGetSinglePatientQuery(id);
  const patientData = data?.data?.result;
  const form = useForm<PatientFormValues>({ defaultValues: defaultFormValues });
  const [updatePatient, { isLoading: isUpdating }] =
    useUpdatePatientMutation();

  useEffect(() => {
    if (patientData) {
      form.reset({
        ...patientData,
        emergencyContactName:
          patientData.emergencyContact?.emergencyContactName || "",
        bloodGroup: patientData.bloodGroup || "",
        emergencyContactPhone:
          patientData.emergencyContact?.emergencyContactPhone || "",
        relationship: patientData.emergencyContact?.relationship || "",
        medicalHistory: normaliseListField(patientData.medicalHistory),
        allergies: normaliseListField(patientData.allergies),
        currentMedications: normaliseListField(
          patientData.currentMedications
        ),
      });
    }
  }, [patientData, form]);
  const onSubmit: SubmitHandler<PatientFormValues> = async (userData) => {
    const {
      emergencyContactName,
      emergencyContactPhone,
      relationship,
      ...rest
    } = userData;
    const emergencyContact = {
      emergencyContactName,
      relationship,
      emergencyContactPhone,
    };

    const updatePayload: Partial<IPatient> = {
      name: rest.name.trim(),
      phone: rest.phone.trim(),
      email: rest.email.trim(),
      address: rest.address.trim() || undefined,
      dateOfBirth: rest.dateOfBirth || undefined,
      occupation: rest.occupation.trim() || undefined,
      gender: GENDER_OPTIONS.includes(
        rest.gender as (typeof GENDER_OPTIONS)[number]
      )
        ? (rest.gender as IPatient["gender"])
        : undefined,
      bloodGroup: BLOOD_GROUP_OPTIONS.includes(
        rest.bloodGroup as (typeof BLOOD_GROUP_OPTIONS)[number]
      )
        ? (rest.bloodGroup as IPatient["bloodGroup"])
        : undefined,
      maritalStatus: MARITAL_STATUS_OPTIONS.includes(
        rest.maritalStatus as (typeof MARITAL_STATUS_OPTIONS)[number]
      )
        ? (rest.maritalStatus as IPatient["maritalStatus"])
        : undefined,
      emergencyContact,
      medicalHistory: parseListField(rest.medicalHistory ?? ""),
      allergies: parseListField(rest.allergies ?? ""),
      currentMedications: parseListField(rest.currentMedications ?? ""),
    };

    try {
      await updatePatient({
        id,
        updatePayload,
      }).unwrap();
      toast.success("Patient updated successfully");
    } catch (error) {
      toast.error(
        extractErrorMessage(error, "Failed to update patient information")
      );
    }
  };

  if (isLoading || isUpdating) {
    return <Loader label="Loading patient profile" />;
  }

  if (!patientData) {
    return (
      <div className="px-4 py-10">
        <Card className="mx-auto max-w-3xl border-red-200 bg-red-50/60">
          <CardHeader>
            <CardTitle className="text-xl text-red-900">Patient not found</CardTitle>
            <CardDescription className="text-red-700">
              We could not find this patient record. Return to the list and try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/receptionist/patients">
              <Button variant="outline">Back to patient list</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formattedDob = patientData.dateOfBirth
    ? new Date(patientData.dateOfBirth).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not provided";

  const profileHighlights = [
    {
      label: "Blood group",
      value: patientData.bloodGroup || "N/A",
      icon: Droplet,
    },
    {
      label: "Gender",
      value: patientData.gender || "Not set",
      icon: UserRound,
    },
    {
      label: "Date of birth",
      value: formattedDob,
      icon: Calendar,
    },
  ];

  const contactFields: Array<{
    name: keyof PatientFormValues;
    label: string;
    type?: "text" | "email" | "date" | "select" | "textarea";
    options?: readonly string[];
  }> = [
    { name: "name", label: "Full name" },
    { name: "phone", label: "Phone *" },
    { name: "email", label: "Email", type: "email" },
    { name: "address", label: "Address" },
    { name: "dateOfBirth", label: "Date of birth", type: "date" },
    { name: "occupation", label: "Occupation" },
  ];

  const demographicsFields: Array<{
    name: keyof PatientFormValues;
    label: string;
    type: "select";
    options: readonly string[];
  }> = [
    { name: "gender", label: "Gender", type: "select", options: GENDER_OPTIONS },
    { name: "bloodGroup", label: "Blood group", type: "select", options: BLOOD_GROUP_OPTIONS },
    { name: "maritalStatus", label: "Marital status", type: "select", options: MARITAL_STATUS_OPTIONS },
  ];

  const emergencyFields: Array<{
    name: keyof PatientFormValues;
    label: string;
    type?: "text";
  }> = [
    { name: "emergencyContactName", label: "Contact name" },
    { name: "relationship", label: "Relationship" },
    { name: "emergencyContactPhone", label: "Contact phone" },
  ];

  const clinicalFields: Array<{
    name: keyof PatientFormValues;
    label: string;
    type?: "textarea";
  }> = [
    { name: "medicalHistory", label: "Medical history", type: "textarea" },
    { name: "allergies", label: "Allergies", type: "textarea" },
    { name: "currentMedications", label: "Current medications", type: "textarea" },
  ];

  const renderField = (
    fieldConfig:
      | {
          name: keyof PatientFormValues;
          label: string;
          type?: "text" | "email" | "date" | "select" | "textarea";
          options?: readonly string[];
        }
  ) => {
    const { name, label, type = "text", options } = fieldConfig;

    return (
      <FormField
        key={name}
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-slate-700">{label}</FormLabel>
            <FormControl>
              {type === "textarea" ? (
                <Textarea {...field} placeholder="" value={field.value ?? ""} className="min-h-[100px]" />
              ) : type === "select" ? (
                <Select onValueChange={(value) => field.onChange(value)} value={field.value ?? ""}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {(options ?? []).map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input {...field} type={type} placeholder="" value={field.value ?? ""} />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <section className="space-y-8 px-4 pb-12 pt-6 lg:px-10">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-950 p-8 text-white shadow-xl shadow-violet-900/25">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <Badge className="w-fit bg-white/15 text-xs uppercase tracking-[0.28em] text-white">
              Patient profile
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                {patientData.name || "Unnamed patient"}
              </h1>
              <p className="text-sm text-purple-100/85">
                Update demographics, emergency contacts, and clinical notes. Changes are saved instantly for care teams.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                <Phone className="h-4 w-4 text-purple-200" />
                {patientData.phone || "No phone on file"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                <MapPin className="h-4 w-4 text-purple-200" />
                {patientData.address || "Address not provided"}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/receptionist/patients">
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10">
                Back to list
              </Button>
            </Link>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              className="bg-white px-5 text-violet-800 hover:bg-violet-50"
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.9fr]">
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="space-y-1 border-b border-slate-100">
            <CardTitle className="text-2xl font-semibold text-slate-900">Edit patient record</CardTitle>
            <CardDescription className="text-slate-600">
              Keep contact, demographic, and emergency details up to date.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <Form {...form}>
              <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Contact</p>
                      <p className="text-xs text-slate-500">Reach the patient or guardian quickly.</p>
                    </div>
                    <Badge variant="outline" className="text-emerald-700 border-emerald-200">
                      Required fields marked with *
                    </Badge>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">{contactFields.map(renderField)}</div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <p className="text-sm font-semibold text-slate-800">Demographics</p>
                  <div className="grid gap-4 md:grid-cols-3">{demographicsFields.map(renderField)}</div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <p className="text-sm font-semibold text-slate-800">Emergency contact</p>
                  <div className="grid gap-4 md:grid-cols-3">{emergencyFields.map(renderField)}</div>
                </div>

                  <Separator />

                <div className="space-y-4">
                  <p className="text-sm font-semibold text-slate-800">Clinical notes</p>
                  <div className="grid gap-4 md:grid-cols-3">
                    {clinicalFields.map((field) => (
                      <div key={field.name} className="md:col-span-3">
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button type="submit" className="rounded-full px-6" disabled={isUpdating}>
                    {isUpdating ? "Saving..." : "Save updates"}
                  </Button>
                  <p className="text-xs text-slate-500">
                    Changes sync instantly to attending doctors and billing.
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg font-semibold">At-a-glance</CardTitle>
              <CardDescription className="text-slate-600">
                Quick facts shared with the care team.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-3">
                {profileHighlights.map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-sm text-slate-700"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      <Icon className="h-4 w-4 text-violet-600" />
                      {label}
                    </div>
                    <p className="mt-2 text-base font-semibold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-violet-700">
                  <ShieldCheck className="h-4 w-4" />
                  ID: {patientData._id}
                </span>
                {patientData.email && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                    <HeartPulse className="h-4 w-4" />
                    {patientData.email}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-amber-200 bg-amber-50/80 shadow-sm">
            <CardContent className="flex items-start gap-3">
              <AlertCircle className="mt-1 h-5 w-5 text-amber-600" />
              <div className="space-y-1 text-sm text-amber-800">
                <p className="font-semibold text-amber-900">Remind patients to update allergies.</p>
                <p>
                  Any medication changes should be added here to keep doctors informed before the next visit.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PatientDetailsPage;
