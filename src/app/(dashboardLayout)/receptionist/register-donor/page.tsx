"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRegisterDonorMutation, type DonorPayload } from "@/redux/features/donor/donorApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENDERS = ["male", "female", "other"];

type DonorFormState = {
  name: string;
  bloodGroup: string;
  quantity: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  lastDonationDate: string;
};

const initialFormState: DonorFormState = {
  name: "",
  bloodGroup: "",
  quantity: "1",
  age: "",
  gender: "",
  phone: "",
  email: "",
  address: "",
  lastDonationDate: "",
};

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

const RegisterDonorPage = () => {
  const [registerDonor, { isLoading }] = useRegisterDonorMutation();
  const [form, setForm] = useState<DonorFormState>(initialFormState);

  const handleChange = <Key extends keyof DonorFormState>(
    key: Key,
    value: DonorFormState[Key],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const payload: DonorPayload = {
        ...form,
        quantity: Number(form.quantity),
        age: form.age ? Number(form.age) : undefined,
        lastDonationDate: form.lastDonationDate || undefined,
      };
      await registerDonor(payload).unwrap();
      toast.success("Donor registered successfully");
      setForm(initialFormState);
    } catch (error) {
      toast.error(
        extractErrorMessage(error, "Unable to register donor at the moment")
      );
    }
  };

  return (
    <div className="space-y-8 p-6">
      <Card className="border border-slate-200/70 shadow-sm">
        <CardHeader>
          <CardTitle>Register donor</CardTitle>
          <p className="text-sm text-slate-500">
            Capture donor information so the admin can manage eligibility and inventory.
          </p>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(event) => handleChange("name", event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Blood group</Label>
              <Select
                value={form.bloodGroup}
                onValueChange={(value) => handleChange("bloodGroup", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {BLOOD_GROUPS.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Units pledged</Label>
              <Input
                type="number"
                min={1}
                value={form.quantity}
                onChange={(event) => handleChange("quantity", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Age</Label>
              <Input
                type="number"
                min={18}
                value={form.age}
                onChange={(event) => handleChange("age", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                value={form.gender}
                onValueChange={(value) => handleChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(event) => handleChange("email", event.target.value)}
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Address</Label>
              <Input
                value={form.address}
                onChange={(event) => handleChange("address", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Last donation date</Label>
              <Input
                type="date"
                value={form.lastDonationDate}
                onChange={(event) =>
                  handleChange("lastDonationDate", event.target.value)
                }
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" disabled={isLoading}>
                Register donor
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterDonorPage;
