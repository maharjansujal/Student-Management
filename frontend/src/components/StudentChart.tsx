// src/components/StudentChart.tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

interface Student {
  id: number;
  name: string;
  age: number;
  grade: string;
  email: string;
}

interface StudentChartProps {
  students: Student[];
}

export function StudentChart({ students }: StudentChartProps) {
  // Example: count students per grade
  const chartData = useMemo(() => {
    const dataMap = new Map<string, number>();
    students.forEach((s) => {
      dataMap.set(s.grade, (dataMap.get(s.grade) || 0) + 1);
    });
    return Array.from(dataMap.entries()).map(([grade, count]) => ({
      grade,
      count,
    }));
  }, [students]);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="grade" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#4F46E5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
