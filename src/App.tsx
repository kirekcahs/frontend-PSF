
import { useAuth } from "./assets/lib/authSlice";
import Login from "./assets/components/Login";
import SurveyForm from "./assets/components/SurveyForm";
import AdminDashboard from "./assets/components/AdminDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App () {
  const { isAuthenticated, logoutUser, user } = useAuth();

  // Redirect logic: show dashboard if admin, else show survey form if authenticated, else show login
  const isAdmin = user && user.name === "admin"; // Adjust as needed for your admin logic

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Public Survey Form</h1>
      {!isAuthenticated ? (
        <Login />
      ) : isAdmin ? (
        <div className="w-full flex flex-col items-center">
          <AdminDashboard />
          <button
            onClick={() => logoutUser()}
            className="mt-6 bg-red-500 text-white p-2 rounded-lg border border-red-600 hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          <SurveyForm />
          <button
            onClick={() => logoutUser()}
            className="mt-6 bg-red-500 text-white p-2 rounded-lg border border-red-600 hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}
      <ToastContainer />
    </div>    
  );
}

export default App;
