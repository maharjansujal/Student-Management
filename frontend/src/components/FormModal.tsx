"use client";
import { useEffect, useRef, useState } from "react";
import Input from "./Input";
import { motion, AnimatePresence } from "framer-motion";
import type { Student } from "@/types/student";

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
    nameRef.current?.focus();
  }, []);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-8 space-y-5"
        >
          <h2 className="text-xl font-semibold text-gray-800">
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

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {student ? "Update" : "Add"}
            </button>
          </div>
        </motion.form>
      </div>
    </AnimatePresence>
  );
}
