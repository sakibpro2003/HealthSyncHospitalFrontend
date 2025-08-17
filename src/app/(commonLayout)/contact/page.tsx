"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="w-11/12 mx-auto py-12 space-y-12">
      {/* Intro */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We are here to help you with appointments, emergency assistance, or any questions you may have. Reach out to us anytime.
        </p>
      </section>

      {/* Contact Info */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md rounded-2xl text-center">
          <CardContent className="p-6 space-y-2">
            <Phone className="mx-auto h-10 w-10 text-blue-600" />
            <h3 className="text-lg font-semibold">Phone</h3>
            <p className="text-gray-600">+880 123 456 789</p>
            <p className="text-gray-600">+880 987 654 321</p>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-2xl text-center">
          <CardContent className="p-6 space-y-2">
            <Mail className="mx-auto h-10 w-10 text-green-600" />
            <h3 className="text-lg font-semibold">Email</h3>
            <p className="text-gray-600">info@lifecarehospital.com</p>
            <p className="text-gray-600">support@lifecarehospital.com</p>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-2xl text-center">
          <CardContent className="p-6 space-y-2">
            <MapPin className="mx-auto h-10 w-10 text-red-600" />
            <h3 className="text-lg font-semibold">Address</h3>
            <p className="text-gray-600">123 Main Street</p>
            <p className="text-gray-600">Dhaka, Bangladesh</p>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-2xl text-center">
          <CardContent className="p-6 space-y-2">
            <Clock className="mx-auto h-10 w-10 text-yellow-500" />
            <h3 className="text-lg font-semibold">Working Hours</h3>
            <p className="text-gray-600">Mon - Fri: 8:00 AM - 8:00 PM</p>
            <p className="text-gray-600">Sat - Sun: 9:00 AM - 5:00 PM</p>
          </CardContent>
        </Card>
      </section>

      {/* Contact Form */}
      <section className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-center">Send Us a Message</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Message</label>
            <textarea
              placeholder="Your Message"
              rows={4}
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <Button type="submit" size="lg" className="rounded-2xl w-full">
            Send Message
          </Button>
        </form>
      </section>

      {/* Map (Optional) */}
      <section className="w-full h-64 rounded-2xl overflow-hidden shadow-md">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902982020221!2d90.39156317533155!3d23.750885089079573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b048f33c81%3A0x8a59fb4dbb895cec!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1677671111111!5m2!1sen!2sbd"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
        ></iframe>
      </section>
    </div>
  );
}