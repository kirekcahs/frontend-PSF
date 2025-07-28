import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
}
// StatCard component to display statistics in the Admin Dashboard
const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <h4 className="text-gray-500 text-sm font-medium">{title}</h4>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
};

export default StatCard;