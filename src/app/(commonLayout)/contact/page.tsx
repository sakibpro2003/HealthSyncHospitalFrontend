"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  UserRound,
} from "lucide-react";

const contactChannels = [
  {
    title: "Emergency hotline",
    lines: ["+880 123 456 789", "Rapid ambulance coordination"],
    icon: Phone,
    accent: "bg-rose-100 text-rose-600",
  },
  {
    title: "Patient relations",
    lines: ["hello@healthsync.com", "Support within 2 working hours"],
    icon: Mail,
    accent: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Hospital campus",
    lines: ["121 Healthcare Avenue", "Dhaka 1212, Bangladesh"],
    icon: MapPin,
    accent: "bg-violet-100 text-violet-600",
  },
  {
    title: "Visiting hours",
    lines: ["Mon – Fri: 8:00 – 20:00", "Sat – Sun: 9:00 – 17:00"],
    icon: Clock,
    accent: "bg-amber-100 text-amber-600",
  },
];

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(168,85,247,0.2),transparent_40%),radial-gradient(circle_at_82%_12%,rgba(79,70,229,0.22),transparent_38%),radial-gradient(circle_at_50%_80%,rgba(124,58,237,0.15),transparent_40%)]" />
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
          <div className="relative z-10 space-y-4 text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-purple-50">
              We are ready
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                Talk to HealthSync—any hour, any channel
              </h1>
              <p className="max-w-3xl text-base text-purple-100/80 sm:text-lg">
                Urgent transfer, second opinion, or appointment help—our concierge team connects you to the right specialist in minutes, across phone, chat, or email.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-violet-800 shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:bg-purple-50">
                Call the command centre
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-white/30 bg-white/10 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                Book a facility tour
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-purple-100/90">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                <Phone className="h-4 w-4 text-purple-200" />
                Hotline +880 123 456 789
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                <Mail className="h-4 w-4 text-purple-200" />
                hello@healthsync.com
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                <Clock className="h-4 w-4 text-purple-200" />
                24/7 triage
              </span>
            </div>
          </div>

          <Card className="relative z-10 rounded-3xl border border-white/10 bg-white/10 text-white shadow-2xl shadow-purple-900/40 backdrop-blur">
            <CardContent className="space-y-4 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-100">Why patients choose us</p>
              <h2 className="text-xl font-semibold text-white">One connected helpline for clinical, billing, and wellness support.</h2>
              <p className="text-sm text-purple-100/85">
                A dedicated navigator follows every case until it is resolved. If you are unsure where to begin, start here and we will guide you step by step.
              </p>
              <div className="grid gap-2 text-sm text-purple-100/85">
                <span className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2">
                  Specialist matching in minutes
                </span>
                <span className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2">
                  Appointment + billing coordination
                </span>
                <span className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2">
                  Patient-first updates on every channel
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl space-y-16 px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {contactChannels.map(({ title, lines, icon: Icon, accent }) => (
            <Card key={title} className="rounded-3xl border border-white/60 bg-white/85 text-left shadow-lg backdrop-blur">
              <CardContent className="space-y-3 p-6">
                <span className={`inline-flex size-10 items-center justify-center rounded-2xl ${accent}`}>
                  <Icon className="size-5" />
                </span>
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                <ul className="space-y-1 text-sm text-slate-600">
                  {lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="grid gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div className="space-y-5 rounded-[2.5rem] border border-white/60 bg-white/85 p-8 shadow-lg backdrop-blur">
            <div className="space-y-2 text-left">
              <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-violet-700">
                <UserRound className="size-4" />
                Drop us a line
              </span>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">We reply within one business day</h2>
              <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
                Share a few details and our patient relations team will coordinate the next steps — be it medical records, price estimates, or visit planning.
              </p>
            </div>

            <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
              <div className="sm:col-span-1">
                <label className="text-sm font-semibold text-slate-600" htmlFor="contact-name">
                  Full name
                </label>
                <Input
                  id="contact-name"
                  placeholder="Your name"
                  className="mt-2 rounded-xl border-slate-200 bg-white/90 focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="text-sm font-semibold text-slate-600" htmlFor="contact-email">
                  Email address
                </label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="you@example.com"
                  className="mt-2 rounded-xl border-slate-200 bg-white/90 focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="text-sm font-semibold text-slate-600" htmlFor="contact-phone">
                  Phone
                </label>
                <Input
                  id="contact-phone"
                  type="tel"
                  placeholder="(+880)"
                  className="mt-2 rounded-xl border-slate-200 bg-white/90 focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="text-sm font-semibold text-slate-600" htmlFor="contact-subject">
                  Department of interest
                </label>
                <Input
                  id="contact-subject"
                  placeholder="e.g., Cardiology"
                  className="mt-2 rounded-xl border-slate-200 bg-white/90 focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-semibold text-slate-600" htmlFor="contact-message">
                  How can we help?
                </label>
                <Textarea
                  id="contact-message"
                  rows={4}
                  placeholder="Tell us about your request"
                  className="mt-2 rounded-xl border-slate-200 bg-white/90 focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                />
              </div>
              <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
                <Button type="submit" className="rounded-full bg-violet-600 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700">
                  Submit enquiry
                </Button>
                <p className="text-xs text-slate-500 sm:text-sm">
                  By submitting, you agree to our privacy policy. We never share your information without consent.
                </p>
              </div>
            </form>
          </div>

          <div className="space-y-6 rounded-[2.5rem] border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-violet-700">
                <MessageCircle className="size-4" />
                Concierge desk
              </span>
              <p className="text-sm text-slate-600">
                WhatsApp us for quick updates, appointment reminders, or lab report clarifications.
              </p>
              <Button variant="outline" className="w-full rounded-full border-slate-300 text-sm font-semibold text-slate-700 hover:border-violet-400 hover:bg-white">
                Chat on WhatsApp
              </Button>
            </div>
            <div className="h-64 overflow-hidden rounded-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902982020221!2d90.39156317533155!3d23.750885089079573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b048f33c81%3A0x8a59fb4dbb895cec!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1677671111111!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
