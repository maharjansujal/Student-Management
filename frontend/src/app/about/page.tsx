// app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">About This App</h1>
      <p className="mb-2">
        This is a simple Student Management application built using Next.js and
        Django. It demonstrates modern web development concepts such as:
      </p>
      <ul className="list-disc pl-6 mb-2">
        <li>File-based routing and Layouts in Next.js</li>
        <li>Server-side rendering (SSR) for fetching student data</li>
        <li>Client-side rendering for CRUD operations</li>
        <li>Reusable React components and form modals</li>
        <li>TypeScript type safety for frontend components</li>
      </ul>
      The app allows adding, editing, and deleting student records while showing
      a clear separation between client-side interactivity and server-rendered
      data.
    </div>
  );
}
