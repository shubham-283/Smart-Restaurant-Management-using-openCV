"use client";

import { Box } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  {
    name: "Mon",
    produce: 24,
    dairy: 18,
    meat: 12,
    dry: 30,
  },
  {
    name: "Tue",
    produce: 22,
    dairy: 16,
    meat: 10,
    dry: 28,
  },
  {
    name: "Wed",
    produce: 28,
    dairy: 20,
    meat: 15,
    dry: 32,
  },
  {
    name: "Thu",
    produce: 26,
    dairy: 19,
    meat: 14,
    dry: 30,
  },
  {
    name: "Fri",
    produce: 32,
    dairy: 22,
    meat: 18,
    dry: 34,
  },
  {
    name: "Sat",
    produce: 38,
    dairy: 26,
    meat: 22,
    dry: 38,
  },
  {
    name: "Sun",
    produce: 30,
    dairy: 20,
    meat: 16,
    dry: 32,
  },
];

export function Overview() {
  return (
    <Box sx={{ p: 10 }}>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip />
          <Bar dataKey="produce" fill="#4ade80" radius={[4, 4, 0, 0]} />
          <Bar dataKey="dairy" fill="#60a5fa" radius={[4, 4, 0, 0]} />
          <Bar dataKey="meat" fill="#f87171" radius={[4, 4, 0, 0]} />
          <Bar dataKey="dry" fill="#fbbf24" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
