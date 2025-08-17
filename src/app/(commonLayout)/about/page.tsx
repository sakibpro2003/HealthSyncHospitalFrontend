"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartPulse, Users, Award, Hospital } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="w-11/12 mx-auto py-12 space-y-12">
      {/* Intro */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">About Our Hospital</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Caring for your health since 1990, <span className="font-semibold">LifeCare Hospital</span> is a leading healthcare provider in Bangladesh offering advanced medical services, compassionate care, and cutting-edge technology.
        </p>
      </section>

      {/* Mission, Vision, Values */}
      <section className="grid md:grid-cols-3 gap-6">
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-6 space-y-2">
            <h2 className="text-xl font-semibold">Our Mission</h2>
            <p className="text-gray-600">To provide affordable, world-class healthcare with compassion and integrity.</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-6 space-y-2">
            <h2 className="text-xl font-semibold">Our Vision</h2>
            <p className="text-gray-600">To be the most trusted hospital, setting new standards in patient care and innovation.</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-6 space-y-2">
            <h2 className="text-xl font-semibold">Our Values</h2>
            <p className="text-gray-600">Compassion, Integrity, Innovation, Excellence, and Patient-first approach.</p>
          </CardContent>
        </Card>
      </section>

      {/* History */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Our Journey</h2>
        <p className="text-gray-600">
          Established in 1990, LifeCare Hospital began as a small community clinic and has grown into a 500-bed multi-specialty hospital serving thousands of patients annually. Over the years, we have achieved milestones in medical excellence and community service.
        </p>
      </section>

      {/* Stats */}
      <section className="grid md:grid-cols-4 gap-6 text-center">
        <div className="p-6 bg-gray-50 rounded-2xl shadow">
          <Hospital className="mx-auto h-10 w-10 text-blue-600" />
          <h3 className="text-2xl font-bold mt-2">500+</h3>
          <p className="text-gray-600">Beds</p>
        </div>
        <div className="p-6 bg-gray-50 rounded-2xl shadow">
          <Users className="mx-auto h-10 w-10 text-green-600" />
          <h3 className="text-2xl font-bold mt-2">200+</h3>
          <p className="text-gray-600">Doctors</p>
        </div>
        <div className="p-6 bg-gray-50 rounded-2xl shadow">
          <HeartPulse className="mx-auto h-10 w-10 text-red-600" />
          <h3 className="text-2xl font-bold mt-2">1M+</h3>
          <p className="text-gray-600">Patients Served</p>
        </div>
        <div className="p-6 bg-gray-50 rounded-2xl shadow">
          <Award className="mx-auto h-10 w-10 text-yellow-500" />
          <h3 className="text-2xl font-bold mt-2">50+</h3>
          <p className="text-gray-600">Awards & Accreditations</p>
        </div>
      </section>

      {/* Doctors */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Meet Our Specialists</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Dr. Ayesha Rahman", role: "Cardiologist" },
            { name: "Dr. Tanvir Ahmed", role: "Oncologist" },
            { name: "Dr. Nusrat Jahan", role: "Pediatrician" },
          ].map((doc, i) => (
            <Card key={i} className="shadow-md rounded-2xl">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-200"></div>
                <h3 className="mt-4 font-semibold">{doc.name}</h3>
                <p className="text-gray-600">{doc.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Your Health, Our Priority</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          We are committed to serving our community with the best healthcare services. Book your appointment today and take a step towards better health.
        </p>
        <Button size="lg" className="rounded-2xl">Book an Appointment</Button>
      </section>
    </div>
  );
}
