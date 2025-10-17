"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/students", label: "Students" },
    { href: "/about", label: "About" },
  ];
  return (
    <nav className="flex justify-center gap-6 p-4 border-b">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`px-2 py-1 rounded-md transition-colors ${
            pathname === link.href
              ? "text-blue-600 font-semibold" // active page
              : "text-gray-700 hover:text-blue-500"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
