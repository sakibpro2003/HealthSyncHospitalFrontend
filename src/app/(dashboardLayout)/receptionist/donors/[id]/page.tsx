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
  // useGetSinglePatientQuery,
  useUpdatePatientMutation,
} from "@/redux/features/patient/patientApi";
import Loader from "@/components/shared/Loader";
import { useGetSingleDonorQuery, useUpdateDonorMutation } from "@/redux/features/donor/donorApi";

interface IParams {
  params: Promise<{ id: string }>;
}
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
const PatientDetailsPage = ({ params }: IParams) => {
  const { id } = use(params);
  const { data, isLoading, error } = useGetSingleDonorQuery(id);
  const donor = data?.data?.result;
  console.log(donor, "donor");
  const form = useForm();
  const [updateDonor, { isLoading: isUpdating, error: updateError }] =
    useUpdateDonorMutation();

  // useEffect(() => {
  //   if (donor) {
  //     form.reset({
  //       ...donor,
  //       emergencyContactName:
  //         donor.emergencyContact?.emergencyContactName || "",
  //       bloodGroup: donor.bloodGroup || "",
  //       emergencyContactPhone:
  //         donor.emergencyContact?.emergencyContactPhone || "",
  //       relationship: donor.emergencyContact?.relationship || "",
  //       medicalHistory: Array.isArray(donor.medicalHistory)
  //         ? donor.medicalHistory.join(", ")
  //         : donor.medicalHistory || "",
  //       allergies: Array.isArray(donor.allergies)
  //         ? donor.allergies.join(", ")
  //         : donor.allergies || "",
  //       currentMedications: Array.isArray(donor.currentMedications)
  //         ? donor.currentMedications.join(", ")
  //         : donor.currentMedications || "",
  //     });
  //   }
  // }, [donor, form]);

  useEffect(() => {
    if (donor) {
      const resetData: Record<string, any> = {};

      fields.forEach(({ name }) => {
        if (
          name === "emergencyContactName" ||
          name === "emergencyContactPhone" ||
          name === "relationship"
        ) {
          // These come from donor.emergencyContact — skip here since you handle separately below
          return;
        }

        // For fields that might be arrays (medicalHistory, allergies, currentMedications), handle specially
        if (name === "medicalHistory" && donor.medicalHistory) {
          resetData.medicalHistory = Array.isArray(donor.medicalHistory)
            ? donor.medicalHistory.join(", ")
            : donor.medicalHistory;
        } else if (name === "allergies" && donor.allergies) {
          resetData.allergies = Array.isArray(donor.allergies)
            ? donor.allergies.join(", ")
            : donor.allergies;
        } else if (name === "currentMedications" && donor.currentMedications) {
          resetData.currentMedications = Array.isArray(donor.currentMedications)
            ? donor.currentMedications.join(", ")
            : donor.currentMedications;
        } else {
          // Default: copy from donor or empty string
          resetData[name] = donor[name] ?? "";
        }
      });

      // Add emergencyContact fields separately
      resetData.emergencyContactName =
        donor.emergencyContact?.emergencyContactName || "";
      resetData.emergencyContactPhone =
        donor.emergencyContact?.emergencyContactPhone || "";
      resetData.relationship = donor.emergencyContact?.relationship || "";

      // Add bloodGroup specifically if not already present
      if (!resetData.bloodGroup) {
        resetData.bloodGroup = donor.bloodGroup || "";
      }

      form.reset(resetData);
    }
  }, [donor, form, fields]);

  const onSubmit: SubmitHandler<FieldValues> = async (userData) => {
    const  {
      
      
      ...rest
    } = userData;
    

    const updatePayload = {
      ...rest,
     
    };

    //! Caution!!
    try {
      const result2 = await updateDonor({
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
                            value={field.value || ""}
                          />
                        ) : type === "select" ? (
                          <Select
                            onValueChange={(value) => {
                              form.setValue(name, value);
                            }}
                            value={form.getValues(name) || ""}
                          >
                            <SelectTrigger className="w-full">
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

export default PatientDetailsPage;
