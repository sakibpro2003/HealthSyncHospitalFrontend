"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useGetSinglePatientQuery,
  useUpdateMedicalHistoryMutation,
} from "@/redux/features/patient/patientApi";
import { Loader2, Sparkles, Stethoscope, Pill, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useClientUser } from "@/hooks/useClientUser";

const toDisplayList = (items?: string[]) => {
  if (!items || !items.length) {
    return ["Not specified yet"];
  }

  return items;
};

const parseInputList = (value: string) =>
  value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);

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

const PatientDashboardPage = () => {
  const { user } = useClientUser();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [formState, setFormState] = useState({
    medicalHistory: "",
    allergies: "",
    currentMedications: "",
  });

  const patientId = useMemo(
    () => user?.userId ?? user?._id ?? "",
    [user]
  );

  const {
    data: patientData,
    isLoading,
    isFetching,
    refetch,
  } = useGetSinglePatientQuery(patientId, {
    skip: !patientId,
  });

  const [updateMedicalHistory, { isLoading: isUpdating }] =
    useUpdateMedicalHistoryMutation();

  const patient = patientData?.data?.result;

  useEffect(() => {
    if (patient) {
      setFormState({
        medicalHistory: (patient.medicalHistory ?? []).join("\n"),
        allergies: (patient.allergies ?? []).join("\n"),
        currentMedications: (patient.currentMedications ?? []).join("\n"),
      });
    }
  }, [patient, sheetOpen]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const effectiveId = patient?._id ?? patientId;

    if (!effectiveId) {
      toast.error("You need to log in to update medical history");
      return;
    }

    const payload = {
      medicalHistory: parseInputList(formState.medicalHistory),
      allergies: parseInputList(formState.allergies),
      currentMedications: parseInputList(formState.currentMedications),
      email: patient?.email ?? user?.email,
    };

    try {
      await updateMedicalHistory({
        id: effectiveId,
        payload,
      }).unwrap();
      toast.success("Medical history updated");
      setSheetOpen(false);
      refetch();
    } catch (error: unknown) {
      toast.error(
        extractErrorMessage(
          error,
          "Unable to update medical history right now"
        )
      );
    }
  };

  return (
    <div className="p-6 bg-gradient-to-tr from-sky-50 via-white to-blue-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Hello{patient?.name ? `, ${patient.name}` : ""}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Keep your medical history current so our doctors can tailor the best
            care for you.
          </p>
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="default">
              <Sparkles className="w-4 h-4 mr-1" /> Update Medical History
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="text-xl font-semibold text-gray-800">
                Edit Medical History
              </SheetTitle>
              <SheetDescription>
                Separate each entry with commas or new lines. We’ll keep things
                organized for you.
              </SheetDescription>
            </SheetHeader>
            <form className="flex flex-col gap-4 p-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="medical-history">Chronic Conditions</Label>
                <Textarea
                  id="medical-history"
                  rows={4}
                  placeholder="E.g., Hypertension, Type 2 Diabetes"
                  value={formState.medicalHistory}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      medicalHistory: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  rows={4}
                  placeholder="E.g., Penicillin, Peanuts"
                  value={formState.allergies}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      allergies: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  rows={4}
                  placeholder="E.g., Metformin 500mg, Lisinopril 10mg"
                  value={formState.currentMedications}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      currentMedications: event.target.value,
                    }))
                  }
                />
              </div>
              <Button type="submit" disabled={isUpdating} className="w-full">
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {(isLoading || isFetching) && (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="animate-spin w-5 h-5" /> Loading your records...
        </div>
      )}

      {!isLoading && !isFetching && (
        <div className="grid gap-6 md:grid-cols-3">
          <section className="bg-white/90 border border-sky-100 rounded-2xl shadow-sm p-6 flex flex-col gap-4">
            <header className="flex items-center gap-3 text-sky-700">
              <Stethoscope className="w-6 h-6" />
              <h2 className="text-lg font-semibold">Chronic Conditions</h2>
            </header>
            <ul className="space-y-2 text-sm text-gray-700">
              {toDisplayList(patient?.medicalHistory).map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="bg-sky-50 border border-sky-100 rounded-lg px-3 py-2"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white/90 border border-amber-100 rounded-2xl shadow-sm p-6 flex flex-col gap-4">
            <header className="flex items-center gap-3 text-amber-600">
              <ShieldAlert className="w-6 h-6" />
              <h2 className="text-lg font-semibold">Allergies</h2>
            </header>
            <ul className="space-y-2 text-sm text-gray-700">
              {toDisplayList(patient?.allergies).map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white/90 border border-emerald-100 rounded-2xl shadow-sm p-6 flex flex-col gap-4">
            <header className="flex items-center gap-3 text-emerald-600">
              <Pill className="w-6 h-6" />
              <h2 className="text-lg font-semibold">Current Medications</h2>
            </header>
            <ul className="space-y-2 text-sm text-gray-700">
              {toDisplayList(patient?.currentMedications).map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
};

export default PatientDashboardPage;
