import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './assets/lib/authSlice';
import Login from './assets/components/Login';
import SurveyForm from './assets/components/SurveyForm';
import AdminDashboard from './assets/components/AdminDashboard';
import SurveyList from './assets/components/SurveyList'; // <-- Import SurveyList
import AdminLayout from './assets/components/AdminLayout'; // <-- Import the new Layout
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// A custom component to protect the ENTIRE admin section
const ProtectedAdminRoutes = () => {
  const { isAuthenticated } = useAuth();
  // If authenticated, render the AdminLayout which contains the nested routes.
  // Otherwise, navigate to the login page.
  return isAuthenticated ? <AdminLayout /> : <Navigate to="/admin/login" />;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
        <header className="w-full max-w-5xl flex justify-between items-center mb-6">
          <Link to="/" className="text-2xl font-bold">Developer Tech Survey</Link>
          {!isAuthenticated && (
            <Link to="/admin/login" className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm font-medium">
              Admin Login
            </Link>
          )}
        </header>

        <main className="w-full flex justify-center">
          <Routes>
            {/* --- Public Route --- */}
            <Route path="/" element={<SurveyForm />} />
            
            {/* --- Admin Routes --- */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedAdminRoutes />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="submissions" element={<SurveyList />} />
              {/* Redirect /admin to /admin/dashboard by default */}
              <Route index element={<Navigate to="dashboard" />} />
            </Route>

          </Routes>
        </main>
        
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
      </div>
    </Router>
  );
}

export default App;