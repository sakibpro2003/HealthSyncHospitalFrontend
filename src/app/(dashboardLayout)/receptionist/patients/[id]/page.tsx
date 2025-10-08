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
import React, { use, useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useGetSinglePatientQuery,
  useUpdatePatientMutation,
} from "@/redux/features/patient/patientApi";
import Loader from "@/components/shared/Loader";

interface IParams {
  params: Promise<{ id: string }>;
}
const PatientDetailsPage = ({ params }: IParams) => {
  const { id } = use(params);
  const { data, isLoading, error } = useGetSinglePatientQuery(id);
  const patientData = data?.data?.result;
  const form = useForm();
  const [updatePatient, { isLoading: isUpdating, error: updateError }] =
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
        medicalHistory: Array.isArray(patientData.medicalHistory)
          ? patientData.medicalHistory.join(", ")
          : patientData.medicalHistory || "",
        allergies: Array.isArray(patientData.allergies)
          ? patientData.allergies.join(", ")
          : patientData.allergies || "",
        currentMedications: Array.isArray(patientData.currentMedications)
          ? patientData.currentMedications.join(", ")
          : patientData.currentMedications || "",
      });
    }
  }, [patientData, form]);
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

    const updatePayload = {
      ...rest,
      emergencyContact,
    };

    //! Caution!!
    try {
      const result2 = await updatePatient({
        id,
        updatePayload,
      });
      console.log(result2);
      if (result2?.data?.success) {
        toast.success("Patient updated successfully");
      } else if (updateError) {
        console.log(updateError, "pat update page");
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading || isUpdating) {
    return <Loader></Loader>;
  }

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
    {
      name: "maritalStatus",
      label: "Marital Status",
      type: "select",
      options: ["single", "married", "divorced", "widowed"],
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
                            value={(field.value as string) ?? ""}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={`${label}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {(options || []).concat(
                                field.value && options && !options.includes(field.value)
                                  ? [field.value]
                                  : []
                              ).map((option) => (
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
