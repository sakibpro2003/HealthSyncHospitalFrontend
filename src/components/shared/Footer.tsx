// components/Footer.tsx
"use client";

import Link from "next/link";
import Logo from "../ui/Logo";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 py-10 mt-16 border-t">
      <div className="w-11/12 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo and short description */}
        <div>
          <h1 className="text-xl font-bold text-primary mb-2">
            <Logo></Logo>
          </h1>
          <p className="text-sm">
            Your trusted online medicine partner. Safe and fast delivery at your doorstep.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
          <ul className="space-y-1 text-sm">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li><Link href="/about" className="hover:text-blue-600">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-blue-600">Contact</Link></li>
            <li><Link href="/blogs" className="hover:text-blue-600">Blog</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Contact</h2>
          <p className="text-sm">Email: support@medimart.com</p>
          <p className="text-sm">Phone: +880 1234 567890</p>
          <div className="flex gap-4 mt-2 text-sm">
            <a href="#" className="hover:text-blue-600">Facebook</a>
            <a href="#" className="hover:text-blue-600">Instagram</a>
            <a href="#" className="hover:text-blue-600">LinkedIn</a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 mt-8 pt-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} MediMart. All rights reserved.
      </div>
    </footer>
  );
}
