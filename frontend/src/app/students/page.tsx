"use client";
import { useEffect, useState } from "react";
import FormModal from "@/components/FormModal";
import DialogProvider, { useDialog } from "@/components/Dialog";

interface Student {
  id: number;
  name: string;
  age: number;
  grade: string;
  email: string;
}

function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  async function fetchStudents() {
    const res = await fetch("http://127.0.0.1:8000/api/students/");
    const data = await res.json();
    setStudents(data);
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  const dialog = useDialog();

  async function handleSave(studentData: Omit<Student, "id">, id?: number) {
    try {
      // Ensure age is number
      const payload = { ...studentData, age: Number(studentData.age) };
      let res: Response;

      if (id) {
        // Edit student
        res = await fetch(`http://127.0.0.1:8000/api/students/${id}/`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Add new student
        res = await fetch("http://127.0.0.1:8000/api/students/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        // Check for field-specific errors
        const firstErrorField = Object.keys(data)[0];
        const message = data[firstErrorField]?.[0] || "Something went wrong";
        dialog.error("Validation Error", message);
        return;
      }

      // Success
      await fetchStudents(); // refresh your student list
      setIsModalOpen(false);
      setEditingStudent(null);
      dialog.success(
        "Success!",
        id ? "Student updated successfully." : "Student added successfully."
      );
    } catch (err) {
      console.error(err);
      dialog.error("Network Error", "Could not reach the server.");
    }
  }

  async function deleteStudent(id: number) {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/students/${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setStudents(students.filter((s) => s.id !== id));
      dialog.success("Deleted!", "Student record has been deleted.");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Students List</h1>

      <ul className="divide-y divide-gray-300 border rounded-md">
        {students.map((student) => (
          <li
            key={student.id}
            className="flex justify-between items-center p-3 hover:bg-gray-50"
          >
            <div>
              <p className="font-medium">{student.name}</p>
              <p className="text-sm text-gray-600">
                Age: {student.age}, Grade: {student.grade}, Email:{" "}
                {student.email}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="text-blue-500 hover:underline"
                onClick={() => {
                  setEditingStudent(student);
                  setIsModalOpen(true);
                }}
              >
                Edit
              </button>
              <button
                className="text-red-500 hover:underline"
                onClick={() => deleteStudent(student.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full px-4 py-3 shadow-md hover:bg-blue-700 transition"
        onClick={() => {
          setEditingStudent(null);
          setIsModalOpen(true);
        }}
      >
        + Add Student
      </button>

      {isModalOpen && (
        <FormModal
          onClose={() => {
            setIsModalOpen(false);
            setEditingStudent(null);
          }}
          onSave={handleSave}
          student={editingStudent}
        />
      )}
    </div>
  );
}

export default function StudentsPage() {
  return (
    <DialogProvider>
      <Students />
    </DialogProvider>
  );
}
