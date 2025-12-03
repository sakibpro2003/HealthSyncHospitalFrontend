import RegisterForm from "@/components/modules/auth/register/RegisterForm";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, ClipboardList, Clock4, ShieldCheck, Users2 } from "lucide-react";
import Link from "next/link";

const highlights = [
  { label: "Avg. registration time", value: "4m 15s" },
  { label: "Same-day admissions", value: "86%" },
  { label: "Returning patients", value: "42%" },
];

const checklist = [
  "Verify government ID or insurance card",
  "Confirm allergy & medication updates",
  "Attach existing case file (if any)",
  "Capture emergency contact consent",
];

const reminders = [
  { title: "Insurance verified", detail: "Upload policy proof when available." },
  { title: "Consent updated", detail: "Ask patient to re-sign if data changed." },
  { title: "Clinical alerts", detail: "Flag critical notes for attending doctor." },
];

type RegisterPatientProps = {
  baseSegment?: string;
};

const RegisterPatientScreen = ({ baseSegment = "receptionist" }: RegisterPatientProps) => {
  const patientsPath = `/${baseSegment}/patients`;

  return (
    <section className="space-y-8 px-4 pb-12 pt-6 lg:px-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-xl">
            <CardHeader className="space-y-4">
              <Badge className="w-fit bg-white/20 text-xs uppercase tracking-[0.2em] text-white">
                Patient desk
              </Badge>
              <CardTitle className="text-3xl font-semibold">
                Seamless patient onboarding
              </CardTitle>
              <CardDescription className="text-base text-white/80">
                Capture complete profiles, verify consent, and sync patient data across
                HealthSync Hospital in minutes.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm"
                >
                  <p className="text-sm uppercase tracking-wide text-white/70">
                    {item.label}
                  </p>
                  <p className="text-2xl font-semibold">{item.value}</p>
                </div>
              ))}
              <div className="rounded-2xl border border-white/20 bg-slate-900/30 p-4 backdrop-blur-sm md:col-span-2">
                <p className="text-sm text-white/70">Need to find an existing file?</p>
                <p className="text-sm font-semibold text-white">
                  Search patients from the list and prefill this form with one click.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="text-lg font-semibold">
                Intake checklist
              </CardTitle>
              <CardDescription>
                Tick these off while capturing the patient record.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm text-slate-600">
                {checklist.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3"
                  >
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Separator />
              <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-700">
                <ClipboardList className="h-4 w-4" />
                All patient submissions sync automatically with the EMR dashboard.
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Reception reminders
              </CardTitle>
              <CardDescription>
                Keep the process transparent from lobby to discharge.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reminders.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4"
                >
                  <Clock4 className="mt-0.5 h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-600">{item.detail}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="border border-slate-200 shadow-xl">
          <CardHeader className="space-y-4 border-b border-slate-100 pb-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">Register a patient</CardTitle>
                <CardDescription>
                  All sections are required unless marked optional.
                </CardDescription>
              </div>
              <Link href={patientsPath}>
                <Badge
                  variant="outline"
                  className="flex items-center gap-2 border-emerald-200 bg-emerald-50 text-emerald-700"
                >
                  Patient list <ArrowRight className="h-3.5 w-3.5" />
                </Badge>
              </Link>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                <Users2 className="h-4 w-4 text-emerald-600" /> Walk-in & appointment patients
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                <Clock4 className="h-4 w-4 text-emerald-600" /> Autosaves every step
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-6 pt-6">
            <RegisterForm showHeading={false} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RegisterPatientScreen;
