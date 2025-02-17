"use client";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { BookOpen } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Topics", href: "/Topics" },
  { name: "Saved Papers", href: "#" },
  { name: "About", href: "#" },
  { name: "News", href: "/news" },

];

export default function Navbar() {
  return (
    <Disclosure as="nav" className="bg-white shadow-sm">
      {({ open }) => (
        <>
          <div className="px-4 lg:px-6 h-14 flex items-center justify-between">
            {/* Logo */}
            <Link className="flex items-center justify-center" href="#">
              <BookOpen className="h-6 w-6" />
              <span className="ml-2 text-lg font-bold">ResearchPulse</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex sm:gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  className="text-sm font-medium hover:underline underline-offset-4"
                  href={item.href}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden">
              <DisclosureButton className="inline-flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded-md focus:outline-hidden focus:ring-2 focus:ring-gray-200">
                {open ? (
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                )}
              </DisclosureButton>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <DisclosurePanel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
