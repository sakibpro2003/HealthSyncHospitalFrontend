"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useGetSinglePatientQuery,
  useUpdateMedicalHistoryMutation,
} from "@/redux/features/patient/patientApi";
import {
  Loader2,
  Sparkles,
  Stethoscope,
  Pill,
  ShieldAlert,
  IdCard,
  Droplet,
  HeartPulse,
  CalendarDays,
  PhoneCall,
} from "lucide-react";
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

const FALLBACK_TEXT = "Not specified yet";

const formatTextValue = (value?: string | null, fallback = FALLBACK_TEXT) => {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : fallback;
};

const formatSentenceValue = (value?: string | null) => {
  if (typeof value !== "string") {
    return FALLBACK_TEXT;
  }

  const trimmed = value.trim();
  if (!trimmed.length) {
    return FALLBACK_TEXT;
  }

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

const formatDateValue = (value?: string | Date | null) => {
  if (!value) {
    return FALLBACK_TEXT;
  }

  const date =
    value instanceof Date ? value : new Date(typeof value === "string" ? value : "");

  if (Number.isNaN(date.getTime())) {
    return formatTextValue(typeof value === "string" ? value : "", FALLBACK_TEXT);
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatReleaseStatus = (status?: boolean | null) => {
  if (status === true) {
    return "Cleared for discharge";
  }
  if (status === false) {
    return "Under active care";
  }
  return FALLBACK_TEXT;
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
  const greetingName = patient?.name ?? user?.name;

  const summaryCards = [
    {
      label: "Patient ID",
      value: formatTextValue(
        patient?._id ?? user?.userId ?? user?._id ?? "",
        "Pending assignment"
      ),
      helper: "Share this reference with the reception or care team.",
      icon: IdCard,
      accent: "bg-sky-50 text-sky-600 border-sky-100",
    },
    {
      label: "Blood Group",
      value: formatTextValue(patient?.bloodGroup ?? ""),
      helper: "Critical for transfusions and surgical planning.",
      icon: Droplet,
      accent: "bg-rose-50 text-rose-600 border-rose-100",
    },
    {
      label: "Care Status",
      value: formatReleaseStatus(patient?.releaseStatus),
      helper:
        typeof patient?.releaseStatus === "boolean"
          ? patient.releaseStatus
            ? "You have been cleared for discharge."
            : "Our doctors are still actively monitoring you."
          : "This will update after your care team reviews your case.",
      icon: HeartPulse,
      accent: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      label: "Record Updated",
      value: formatDateValue(patient?.updatedAt ?? patient?.createdAt ?? null),
      helper: patient?.updatedAt
        ? "Latest update applied by your care team."
        : "Records sync the moment your clinicians make a change.",
      icon: CalendarDays,
      accent: "bg-amber-50 text-amber-600 border-amber-100",
    },
  ];

  const infoSections = [
    {
      title: "Personal Details",
      description:
        "Your demographic profile helps our clinicians tailor diagnostics.",
      items: [
        {
          label: "Full Name",
          value: formatTextValue(greetingName ?? ""),
        },
        {
          label: "Gender",
          value: formatSentenceValue(patient?.gender),
        },
        {
          label: "Date of Birth",
          value: formatDateValue(patient?.dateOfBirth),
        },
        {
          label: "Marital Status",
          value: formatSentenceValue(patient?.maritalStatus),
        },
      ],
    },
    {
      title: "Contact & Lifestyle",
      description: "Where and how we can reach you between appointments.",
      items: [
        {
          label: "Primary Email",
          value: formatTextValue(patient?.email ?? user?.email ?? ""),
        },
        {
          label: "Phone Number",
          value: formatTextValue(patient?.phone),
        },
        {
          label: "Occupation",
          value: formatTextValue(patient?.occupation),
        },
        {
          label: "Home Address",
          value: formatTextValue(patient?.address),
        },
      ],
    },
  ];

  const emergencyDetails = [
    {
      label: "Contact Person",
      value: formatTextValue(patient?.emergencyContact?.emergencyContactName),
    },
    {
      label: "Relationship",
      value: formatSentenceValue(patient?.emergencyContact?.relationship),
    },
    {
      label: "Phone",
      value: formatTextValue(
        patient?.emergencyContact?.emergencyContactPhone
      ),
    },
  ];

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
            Hello{greetingName ? `, ${greetingName}` : ""}
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
        <div className="flex flex-col gap-6">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map(({ label, value, helper, icon: Icon, accent }, index) => (
              <article
                key={`${label}-${index}`}
                className="bg-white/90 border border-gray-100 rounded-2xl shadow-sm p-4 flex flex-col justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className={`p-2 rounded-xl border ${accent}`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      {label}
                    </p>
                    <p className="text-lg font-semibold text-gray-800">{value}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">{helper}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            {infoSections.map((infoSection) => (
              <article
                key={infoSection.title}
                className="bg-white/90 border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col gap-4"
              >
                <header>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {infoSection.title}
                  </h2>
                  <p className="text-sm text-gray-500">{infoSection.description}</p>
                </header>
                <dl className="grid gap-4 sm:grid-cols-2">
                  {infoSection.items.map((item) => (
                    <div
                      key={`${infoSection.title}-${item.label}`}
                      className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100"
                    >
                      <dt className="text-xs uppercase tracking-wide text-gray-500">
                        {item.label}
                      </dt>
                      <dd className="text-sm font-medium text-gray-800 mt-1">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </section>

          <section className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-100 rounded-2xl shadow-sm p-6">
            <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-rose-600">
              <div className="flex items-center gap-3">
                <PhoneCall className="w-5 h-5" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Emergency Contact
                  </h2>
                  <p className="text-sm text-gray-600">
                    We will reach out to them first during urgent situations.
                  </p>
                </div>
              </div>
            </header>
            <dl className="grid gap-4 sm:grid-cols-3 mt-4">
              {emergencyDetails.map((detail) => (
                <div
                  key={detail.label}
                  className="bg-white/80 border border-white rounded-xl px-4 py-3"
                >
                  <dt className="text-xs uppercase tracking-wide text-gray-500">
                    {detail.label}
                  </dt>
                  <dd className="text-sm font-medium text-gray-800 mt-1">
                    {detail.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            <article className="bg-white/90 border border-sky-100 rounded-2xl shadow-sm p-6 flex flex-col gap-4">
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
            </article>

            <article className="bg-white/90 border border-amber-100 rounded-2xl shadow-sm p-6 flex flex-col gap-4">
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
            </article>

            <article className="bg-white/90 border border-emerald-100 rounded-2xl shadow-sm p-6 flex flex-col gap-4">
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
            </article>
          </section>
        </div>
      )}
    </div>
  );
};

export default PatientDashboardPage;

