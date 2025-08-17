"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Stethoscope,
  HeartPulse,
  Baby,
  Bone,
  Activity,
  Ambulance,
  Microscope,
  Syringe,
  Brain,
} from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      title: "Emergency & Critical Care",
      description:
        "24/7 emergency services, ICU, ambulance support, and trauma care.",
      icon: Ambulance,
    },
    {
      title: "Cardiology",
      description:
        "Comprehensive heart care including diagnostics, surgery, and rehabilitation.",
      icon: HeartPulse,
    },
    {
      title: "Pediatrics",
      description:
        "Specialized healthcare for infants, children, and adolescents.",
      icon: Baby,
    },
    {
      title: "Orthopedics",
      description:
        "Bone, joint, and spine treatments including advanced surgeries.",
      icon: Bone,
    },
    {
      title: "Diagnostics & Laboratory",
      description:
        "State-of-the-art imaging, pathology, and laboratory services.",
      icon: Microscope,
    },
    {
      title: "Preventive Care",
      description:
        "Vaccinations, annual health checkups, and wellness programs.",
      icon: Syringe,
    },
    {
      title: "General Surgery",
      description: "Safe and advanced surgical procedures across specialties.",
      icon: Stethoscope,
    },
    {
      title: "Physiotherapy & Rehabilitation",
      description:
        "Post-surgery recovery, injury management, and rehabilitation care.",
      icon: Activity,
    },
    {
      title: "Neurology",
      description:
        "Advanced treatments for brain, spine, and nervous system disorders.",
      icon: Brain,
    },
  ];

  return (
    <div className="w-11/12 mx-auto py-12 space-y-12">
      {/* Intro */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Our Services</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          At <span className="font-semibold">LifeCare Hospital</span>, we
          provide a wide range of medical services with expert doctors, modern
          facilities, and compassionate care for every patient.
        </p>
      </section>

      {/* Services Grid */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, i) => (
          <Card
            key={i}
            className="shadow-md rounded-2xl hover:shadow-lg transition"
          >
            <CardContent className="p-6 space-y-4 text-center">
              <service.icon className="mx-auto h-12 w-12 text-blue-600" />
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* CTA */}
      <section className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Need Medical Assistance?</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Our dedicated doctors and staff are always ready to serve you. Book an
          appointment today or contact us for emergency care.
        </p>
        <Button size="lg" className="rounded-2xl">
          Book an Appointment
        </Button>
      </section>
    </div>
  );
}
