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
import React, { use, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useGetSinglePatientQuery,
  useUpdatePatientMutation,
  type IPatient,
} from "@/redux/features/patient/patientApi";
import Loader from "@/components/shared/Loader";

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
    return <Loader></Loader>;
  }

  const fields: Array<{
    name: keyof PatientFormValues;
    label: string;
    type?: "text" | "email" | "date" | "select" | "textarea";
    options?: string[];
  }> = [
    { name: "name", label: "Full Name" },
    { name: "phone", label: "Phone *" },
    { name: "email", label: "Email", type: "email" },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      options: [...GENDER_OPTIONS],
    },
    { name: "address", label: "Address" },
    { name: "dateOfBirth", label: "Date of Birth", type: "date" },
    {
      name: "bloodGroup",
      label: "Blood Group",
      type: "select",
      options: [...BLOOD_GROUP_OPTIONS],
    },
    {
      name: "maritalStatus",
      label: "Marital Status",
      type: "select",
      options: [...MARITAL_STATUS_OPTIONS],
    },
    { name: "emergencyContactName", label: "Emergency Contact Name" },
    { name: "emergencyContactPhone", label: "Emergency Contact Phone" },

    {
      name: "relationship",
      label: "Emergency Contact Relationship",
    },
    { name: "occupation", label: "Occupation" },
    { name: "medicalHistory", label: "Medical History", type: "textarea" },
    { name: "allergies", label: "Allergies" },
    {
      name: "currentMedications",
      label: "Current Medications",
      type: "textarea",
    },
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="mx-auto rounded-lg">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
          Patient Registration
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
                            value={field.value ?? ""}
                          />
                        ) : type === "select" ? (
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value ?? ""}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={`${label}`} />
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
                          <Input
                            {...field}
                            type={type}
                            placeholder=""
                            value={field.value ?? ""}
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

export default PatientDetailsPage;
