import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/authSlice';

const AdminLayout: React.FC = () => {
  const { logoutUser } = useAuth();

  // Function to get the class names for the navigation links
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'
    }`;

  return ( // Main container for the Admin Layout
    <div className="w-full max-w-5xl">
      <header className="flex justify-between items-center w-full mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button
          onClick={() => logoutUser()}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm font-medium"
        >
          Logout
        </button>
      </header>

      {/* Admin Navigation */}
      <nav className="flex items-center space-x-4 mb-8 p-2 bg-white rounded-lg shadow-md">
        <NavLink to="/admin/dashboard" end className={getNavLinkClass}>
          Dashboard Overview
        </NavLink>
        <NavLink to="/admin/submissions" className={getNavLinkClass}>
          Submissions List
        </NavLink>
      </nav>

      <main className="w-full">
        {/* The Outlet component will render the specific page (Dashboard or List) */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;