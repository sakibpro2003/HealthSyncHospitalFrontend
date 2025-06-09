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

const RegisterForm = () => {
  const [register, { data, error }] = useRegisterMutation();
  const form = useForm();
  const onSubmit: SubmitHandler<FieldValues> = async (userData) => {
    const {
      emergencyContactName,
      emergencyContactPhone,
      relationship,
      ...rest
    } = userData;
    // console.log(result, "result");
    const emergencyContact = {
      emergencyContactName: emergencyContactName,
      relationship: relationship,
      emergencyContactPhone: emergencyContactPhone,
    };

    const modifiedData = {
      ...rest,
      emergencyContact,
    };
try{
    const result = await register(modifiedData);
    if(result.data.success){
      
    }
}    
    console.log(modifiedData, "moddata");
    console.log(result, "result");
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
    <div className="min-h-screen w-full bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6 md:p-10">
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

export default RegisterForm;
