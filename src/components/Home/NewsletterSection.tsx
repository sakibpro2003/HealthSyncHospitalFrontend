"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSubscribeMutation } from "@/redux/features/newsletter/newsletterApi";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [subscribe, { isLoading, error }] = useSubscribeMutation();
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    console.log(error,"error")
    console.log(email, "Email");
    const data = {
      email,
    };
    const result = subscribe(data);
    console.log(result);
    toast.success("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat py-24 px-6 md:px-10"
      style={{ backgroundImage: "url('/newsletter-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-3xl mx-auto bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md shadow-2xl rounded-2xl px-6 py-12 md:px-12 text-center">
        <h2 className="text-4xl font-extrabold text-blue-700 dark:text-blue-400 mb-4">
          Subscribe to HealthSync Updates
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg">
          Get the latest health tips, hospital updates, and appointment alerts
          delivered straight to your inbox.
        </p>

        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:w-2/3 rounded-lg px-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
          />
          <Button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >
            {isLoading ? "Subscribe" : "Loading"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
