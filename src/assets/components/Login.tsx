import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/authSlice';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
  const { login, status } = useAuth();
  const navigate = useNavigate();

  return ( // Login component for the Admin Panel
    <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow hover:shadow-lg">
      <h2 className="text-xl font-bold mb-4">Admin Login</h2>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={Yup.object({
          username: Yup.string().email('Must be a valid email').required('Admin email is required'),
          password: Yup.string().required('Password is required'),
        })}
        onSubmit={(values) => {
          login(values).unwrap()
            .then(() => {
              toast.success('Admin login successful!');
              // Redirect to the admin dashboard
              navigate('/admin/dashboard');
            })
            .catch((err) => {
              toast.error(err || 'Invalid Admin Credentials');
            });
        }}
      > 
        {({ handleSubmit, handleChange, values, errors, touched }) => (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input
              type="text"
              name="username"
              placeholder="admin@example.com"
              value={values.username}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-lg"
            />
            {errors.username && touched.username && <div className="text-red-500 text-sm">{errors.username}</div>}

            <input
              type="password"
              name="password"
              placeholder="password123"
              value={values.password}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-lg"
            />
            {errors.password && touched.password && <div className="text-red-500 text-sm">{errors.password}</div>}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-blue-500 text-white p-2 rounded-lg border border-blue-600 hover:bg-blue-600 transition disabled:bg-gray-400"
            >
              {status === 'loading' ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Login;