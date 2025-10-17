import Link from "next/link";
import StudentChartWrapper from "../components/StudentChartWrapper";

export default function HomePage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Student Management App</h1>
      <p className="text-gray-700">
        This is a simple full-stack application built with Next.js and Django.
        It demonstrates:
      </p>
      <ul className="list-disc pl-6 text-gray-700">
        <li>Server-side rendering (SSR) for dynamic data</li>
        <li>Client-side interactivity for adding/editing students</li>
        <li>Reusable React components and form modals</li>
        <li>Type-safe frontend using TypeScript</li>
      </ul>
      <StudentChartWrapper /> {/* SSR + client chart */}
      <Link
        href="/students"
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go to Students
      </Link>
    </div>
  );
}
