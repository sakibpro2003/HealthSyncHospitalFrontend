"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useGetSinglePatientQuery,
  useUpdateMedicalHistoryMutation,
} from "@/redux/features/patient/patientApi";
import {
  Loader2,
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
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-gradient-to-br from-violet-700 via-indigo-600 to-sky-600 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.12),transparent_32%)]" aria-hidden />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
              Patient dashboard
            </span>
            <h1 className="text-3xl font-black leading-tight sm:text-4xl">
              Hello{greetingName ? `, ${greetingName}` : ""} — keep your records up to date
            </h1>
            <p className="max-w-2xl text-sm text-white/85">
              Review your health profile, emergency contact, and medications in one place. Updates sync instantly with your care team.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-left shadow-sm backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">Care status</p>
                <p className="text-lg font-semibold">{formatReleaseStatus(patient?.releaseStatus)}</p>
              </div>
              <div className="rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-left shadow-sm backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">Last update</p>
                <p className="text-lg font-semibold">{formatDateValue(patient?.updatedAt ?? patient?.createdAt ?? null)}</p>
              </div>
            </div>
          </div>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-violet-700 shadow-lg transition hover:bg-violet-50">
                Update Medical History
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="text-xl font-semibold text-gray-800">
                  Edit Medical History
                </SheetTitle>
                <SheetDescription>
                  Separate each entry with commas or new lines. We’ll keep things organized for you.
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
      </div>

      {(isLoading || isFetching) && (
        <div className="flex items-center gap-2 rounded-2xl border border-violet-100 bg-white/80 px-4 py-3 text-slate-600 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-violet-500" /> Loading your records...
        </div>
      )}

      {!isLoading && !isFetching && (
        <div className="flex flex-col gap-8">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map(({ label, value, helper, icon: Icon, accent }, index) => (
              <article
                key={`${label}-${index}`}
                className="group relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-white/95 via-white to-violet-50/70 p-5 shadow-lg ring-1 ring-violet-100/70 transition hover:-translate-y-1 hover:shadow-xl hover:ring-violet-200"
              >
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-400" aria-hidden />
                <div className="flex items-center gap-3">
                  <span className={`flex size-10 items-center justify-center rounded-xl border ${accent}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                      {label}
                    </p>
                    <p className="text-lg font-semibold text-slate-900">{value}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-500">{helper}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            {infoSections.map((infoSection) => (
              <article
                key={infoSection.title}
                className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-lg ring-1 ring-violet-100/60 backdrop-blur"
              >
                <header className="space-y-1">
                  <h2 className="text-lg font-semibold text-slate-900">{infoSection.title}</h2>
                  <p className="text-sm text-slate-600">{infoSection.description}</p>
                </header>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  {infoSection.items.map((item) => (
                    <div
                      key={`${infoSection.title}-${item.label}`}
                      className="rounded-xl border border-violet-50 bg-violet-50/40 px-4 py-3"
                    >
                      <dt className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                        {item.label}
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-900">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </section>

          <section className="rounded-3xl border border-rose-100 bg-gradient-to-r from-rose-50 to-orange-50 p-6 shadow-lg">
            <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-white/70 text-rose-500 ring-1 ring-white/50">
                  <PhoneCall className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Emergency Contact</h2>
                  <p className="text-sm text-rose-700">
                    We will reach out to them first during urgent situations.
                  </p>
                </div>
              </div>
            </header>
            <dl className="mt-4 grid gap-4 sm:grid-cols-3">
              {emergencyDetails.map((detail) => (
                <div
                  key={detail.label}
                  className="rounded-xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm"
                >
                  <dt className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                    {detail.label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-900">
                    {detail.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            <article className="rounded-3xl border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-white p-6 shadow-lg">
              <header className="flex items-center gap-3 text-sky-700">
                <Stethoscope className="h-6 w-6" />
                <h2 className="text-lg font-semibold">Chronic Conditions</h2>
              </header>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {toDisplayList(patient?.medicalHistory).map((item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="rounded-lg border border-sky-100 bg-white/80 px-3 py-2"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-3xl border border-amber-100 bg-gradient-to-br from-white via-amber-50 to-white p-6 shadow-lg">
              <header className="flex items-center gap-3 text-amber-600">
                <ShieldAlert className="h-6 w-6" />
                <h2 className="text-lg font-semibold">Allergies</h2>
              </header>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {toDisplayList(patient?.allergies).map((item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="rounded-lg border border-amber-100 bg-white/80 px-3 py-2"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50 to-white p-6 shadow-lg">
              <header className="flex items-center gap-3 text-emerald-600">
                <Pill className="h-6 w-6" />
                <h2 className="text-lg font-semibold">Current Medications</h2>
              </header>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {toDisplayList(patient?.currentMedications).map((item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="rounded-lg border border-emerald-100 bg-white/80 px-3 py-2"
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

