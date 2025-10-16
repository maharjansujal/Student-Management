// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Student Management App</h1>
      <p className="text-gray-700 mb-4">
        This is a simple full-stack application built with Next.js for the
        frontend and Django as the backend. It demonstrates modern concepts
        like:
      </p>
      <ul className="list-disc pl-6 text-gray-700 mb-4">
        <li>Server-side rendering (SSR) for dynamic data</li>
        <li>Client-side interactivity for adding/editing students</li>
        <li>Reusable React components and form modals</li>
        <li>Type-safe frontend using TypeScript</li>
      </ul>
      <p className="text-gray-700 mb-4">
        Use the navigation above to view the list of students or learn more
        about the app.
      </p>
      <Link
        href="/students"
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go to Students
      </Link>
    </div>
  );
}
