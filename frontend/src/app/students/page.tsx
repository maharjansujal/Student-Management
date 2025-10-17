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
      const payload = { ...studentData, age: Number(studentData.age) };

      // Check if no changes were made
      if (id) {
        const original = students.find((s) => s.id === id);
        if (
          original &&
          original.name === payload.name &&
          original.age === payload.age &&
          original.grade === payload.grade &&
          original.email === payload.email
        ) {
          dialog.warn("No Changes Detected", "You haven't made any changes.");
          return;
        }
      }

      let res: Response;

      if (id) {
        res = await fetch(`http://127.0.0.1:8000/api/students/${id}/`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("http://127.0.0.1:8000/api/students/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        const firstErrorField = Object.keys(data)[0];
        const message = data[firstErrorField]?.[0] || "Something went wrong";
        dialog.error("Validation Error", message);
        return;
      }

      await fetchStudents();
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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Students List</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">
                Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">
                Age
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">
                Grade
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">
                Email
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="border border-gray-300 text-center p-4 text-gray-500 italic"
                >
                  No students found.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="border border-gray-200 px-4 py-3">
                    {student.name}
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    {student.age}
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    {student.grade}
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    {student.email}
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-right space-x-3">
                    <div className="flex justify-end gap-2">
                      <button
                        className="text-blue-600 hover:bg-blue-100 hover:text-blue-700 px-3 py-1 cursor-pointer rounded transition"
                        onClick={() => {
                          setEditingStudent(student);
                          setIsModalOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:bg-red-100 hover:text-red-700 px-3 py-1 cursor-pointer rounded transition"
                        onClick={() => deleteStudent(student.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full px-5 py-3 shadow-lg hover:bg-blue-700 transition"
        onClick={() => {
          setEditingStudent(null);
          setIsModalOpen(true);
        }}
        aria-label="Add Student"
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
