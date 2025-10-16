"use client";
import { useEffect, useRef, useState } from "react";
import Input from "./Input";

interface Student {
  id?: number;
  name: string;
  age: number;
  grade: string;
  email: string;
}

interface FormModalProps {
  onClose: () => void;
  onSave: (data: Omit<Student, "id">, id?: number) => void;
  student?: Student | null;
}

export default function FormModal({
  onClose,
  onSave,
  student,
}: FormModalProps) {
  const [form, setForm] = useState<Omit<Student, "id">>({
    name: student?.name || "",
    age: student?.age || 0,
    grade: student?.grade || "",
    email: student?.email || "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "age" ? Number(value) : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form, student?.id);
  }

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus(); // ✅ auto-focus when modal opens
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96 space-y-4"
      >
        <h2 className="text-lg font-semibold mb-2">
          {student ? "Edit Student" : "Add Student"}
        </h2>

        <Input
          ref={nameRef}
          id="name"
          name="name"
          label="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <Input
          id="age"
          name="age"
          label="Age"
          type="number"
          value={form.age}
          onChange={handleChange}
          required
        />

        <Input
          id="grade"
          name="grade"
          label="Grade"
          value={form.grade}
          onChange={handleChange}
          required
        />

        <Input
          id="email"
          name="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {student ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
