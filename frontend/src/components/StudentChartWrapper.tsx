import { StudentChart } from "./StudentChart";

async function getStudents() {
  const res = await fetch("http://127.0.0.1:8000/api/students/", {
    cache: "no-store", // ensures SSR
  });
  if (!res.ok) throw new Error("Failed to fetch students");
  return res.json();
}

export default async function StudentChartWrapper() {
  const students = await getStudents();
  return <StudentChart students={students} />;
}
