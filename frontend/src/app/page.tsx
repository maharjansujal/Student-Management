"use client";
import { useEffect, useState } from "react";

interface Student {
  id: number;
  name: string;
  age: number;
  grade: string;
  email: string;
}

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);

  async function deleteStudent(id: number) {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/students/${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      // Remove the student from local state so UI updates
      setStudents(students.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  async function editStudent(id: number, updatedStudent: Partial<Student>) {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/students/${id}/`, {
        method: "PATCH", // or PUT if updating all fields
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStudent),
      });
      if (!res.ok) throw new Error("Failed to edit");
      const data = await res.json();
      // Update state
      setStudents(students.map((s) => (s.id === id ? data : s)));
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    async function fetchStudents() {
      const res = await fetch("http://127.0.0.1:8000/api/students/");
      const data = await res.json();
      setStudents(data);
      console.log(data);
    }
    fetchStudents();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Students List</h1>
      <ul className="list-disc pl-5">
        {students.map((student) => (
          <li key={student.id}>
            Name: {student.name}, Age: {student.age}, Grade: {student.grade},
            Email: {student.email}
            <button
              className="ml-2 text-green-500"
              onClick={() => editStudent(student.id, student)}
            >
              Edit
            </button>
            <button
              className="ml-2 text-red-500"
              onClick={() => deleteStudent(student.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
