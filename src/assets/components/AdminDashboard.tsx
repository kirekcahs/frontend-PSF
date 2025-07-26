import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type Submission = {
  preferredFrontend: string;
  preferredBackend: string;
  preferredDatabase: string;
};

const AdminDashboard: React.FC = () => {
  const submissions = useSelector((state: RootState) => state.survey.submissions as Submission[]);

  const totalSubmissions = submissions.length;

  const countValues = (field: keyof Submission): Record<string, number> => {
    const counts: Record<string, number> = {};
    submissions.forEach((submission) => {
      const value = submission[field];
      if (value) counts[value] = (counts[value] || 0) + 1;
    });
    return counts;
  };

  const frontendCounts = countValues("preferredFrontend");
  const backendCounts = countValues("preferredBackend");
  const databaseCounts = countValues("preferredDatabase");

  // Get all unique tech names
  const allTechs = Array.from(
    new Set([
      ...Object.keys(frontendCounts),
      ...Object.keys(backendCounts),
      ...Object.keys(databaseCounts),
    ])
  );

  // Merge into chart data
  const chartData = allTechs.map((tech) => ({
    tech,
    Frontend: frontendCounts[tech] || 0,
    Backend: backendCounts[tech] || 0,
    Database: databaseCounts[tech] || 0,
  }));

  return (
    <div className="w-full max-w-4xl bg-white p-6 rounded shadow shadow-lg">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
      <div className="mb-4">
        <p><strong>Total Submissions:</strong> {totalSubmissions}</p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Tech Stack Chart</h3>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tech" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Frontend" fill="#8884d8" />
              <Bar dataKey="Backend" fill="#82ca9d" />
              <Bar dataKey="Database" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
