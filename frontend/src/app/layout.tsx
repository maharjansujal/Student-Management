import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "My Next.js App",
  description: "Demo app for interview",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-blue-600 text-white p-4 flex gap-4">
          <Link href="/students" className="hover:underline">
            Students
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
