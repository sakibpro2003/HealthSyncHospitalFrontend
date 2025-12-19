import { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageSquare, PhoneCall } from "lucide-react";
import Link from "next/link";

const AccordioSection = () => {
  const faqs = useMemo(
    () => [
      {
        id: "visiting-hours",
        question: "What are the visiting hours for inpatients?",
        answer:
          "General visiting hours run from 10:00 AM to 8:00 PM daily. Critical care units have specialised schedules—our reception desk can help you confirm exact times before you arrive.",
      },
      {
        id: "appointment-booking",
        question: "How can I book or reschedule an appointment?",
        answer:
          "Book directly through the HealthSync portal, or call our care coordination team at +880-XXXX-XXXXXX. Our system sends automatic reminders and lets you reschedule with just a few taps.",
      },
      {
        id: "insurance",
        question: "Do you support health insurance and corporate plans?",
        answer:
          "Yes. We work with the majority of national and international insurers. Bring your card on check-in and our billing specialists will handle the rest. Corporate partner discounts are applied automatically.",
      },
      {
        id: "emergency",
        question: "Is emergency care available around the clock?",
        answer:
          "Absolutely. Our emergency and trauma centre operates 24/7 with dedicated physicians, surgical teams, and diagnostic services ready at a moment’s notice.",
      },
      {
        id: "records",
        question: "How do I access my medical records and lab results?",
        answer:
          "Log in to the HealthSync patient portal to download reports, review visit summaries, and share records securely with other providers whenever needed.",
      },
      {
        id: "support",
        question: "Who can I contact for personalised support?",
        answer:
          "Our concierge team is available from 8:00 AM to 10:00 PM at concierge@healthsync.com or +880-YYYY-YYYYY. You can also use the live chat widget for instant assistance.",
      },
    ],
    [],
  );

  return (
    <section className="relative isolate mx-auto mt-20 w-full overflow-hidden rounded-[2.5rem] border border-white/15 bg-linear-to-br from-white/95 via-white/85 to-indigo-50/80 px-4 py-14 shadow-[0_35px_80px_-40px_rgba(79,70,229,0.45)] backdrop-blur sm:px-6 lg:px-10">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(124,58,237,0.1),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.08),transparent_32%),radial-gradient(circle_at_10%_80%,rgba(99,102,241,0.08),transparent_30%)]"
        aria-hidden
      />
      <div className="absolute -right-28 top-0 h-60 w-60 rounded-full bg-violet-200/55 blur-3xl" aria-hidden />
      <div className="absolute -left-24 bottom-0 h-48 w-48 rounded-full bg-indigo-200/50 blur-3xl" aria-hidden />

      <div className="relative z-10 flex flex-col gap-12 md:flex-row md:gap-16">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-violet-700 ring-1 ring-violet-200/80">
            <HelpCircle className="size-4" />
            Support Hub
          </span>

          <h3 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
            Frequently asked questions
          </h3>

          <p className="text-base text-slate-600">
            Answers curated by our care coordinators so you can focus on what
            matters—feeling better. Need a human touch? We’re one call or chat away.
          </p>

          <div className="grid gap-3 text-sm text-slate-600">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-violet-100 bg-white/90 px-4 py-3 shadow-sm">
              <span className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700 ring-1 ring-violet-200/60">
                <PhoneCall className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-slate-900">Care Line</p>
                <p>+880-XXXX-XXXXXX (24/7 emergency) | +880-YYYY-YYYYY (general)</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-3 rounded-2xl border border-violet-100 bg-white/90 px-4 py-3 shadow-sm">
              <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200/60">
                <MessageSquare className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-slate-900">Live chat & concierge</p>
                <p>Start a chat in the portal or email concierge@healthsync.com</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href={"/services"}  className="rounded-full bg-violet-600 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700">
              Connect with support
            </Link>
           
          </div>
        </div>

        <div className="flex-1">
          <Accordion
            type="single"
            collapsible
            className="rounded-3xl border border-violet-100/80 bg-white/90 p-4 shadow-lg shadow-violet-200/50"
          >
            {faqs.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="rounded-2xl border-none px-2">
                <AccordionTrigger className="text-left text-base font-semibold text-slate-900 hover:no-underline data-[state=open]:text-violet-600">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-relaxed text-slate-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default AccordioSection;
