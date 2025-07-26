import React, { useState } from "react";
import { useAuth } from "../lib/authSlice";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const { loginUser } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow hover:shadow-lg ">
      <h2 className="text-xl font-bold mb-4">{isRegister ? "Create Account" : "Login"}</h2>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={Yup.object({
          username: Yup.string().required("Username is required"),
          password: Yup.string().required("Password is required"),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            if (isRegister) {
              // Save new user to localStorage
              const users = JSON.parse(localStorage.getItem("users") || "[]");
              const exists = users.find((u: { username: string; }) => u.username === values.username);
              if (exists) {
                toast.error("Username already exists");
              } else {
                users.push({ username: values.username, password: values.password });
                localStorage.setItem("users", JSON.stringify(users));
                toast.success("Account created! You can now log in.");
                setIsRegister(false);
              }
            } else {
              // Hardcoded admin login
              if (values.username === "admin" && values.password === "admin123") {
                loginUser({ id: "1", name: "admin" });
                toast.success("Admin login successful!");
              } else {
                // Check localStorage for public user
                const users = JSON.parse(localStorage.getItem("users") || "[]");
                const found = users.find(
                  (u: { username: string; password: string; }) => u.username === values.username && u.password === values.password
                );
                if (found) {
                  loginUser({ id: found.username, name: found.username });
                  toast.success("Login successful!");
                } else {
                  toast.error("Invalid credentials");
                }
              }
            }
          } catch (error) {
            toast.error("An error occurred");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ handleSubmit, handleChange, values, errors, touched }) => (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={values.username}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-lg"
            />
            {errors.username && touched.username && <div className="text-red-500">{errors.username}</div>}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-lg"
            />
            {errors.password && touched.password && <div className="text-red-500">{errors.password}</div>}

            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-lg border border-blue-600 hover:bg-blue-600 transition"
            >
              {isRegister ? "Create Account" : "Login"}
            </button>
          </form>
        )}
      </Formik>
      <div className="mt-4 text-center">
        <button
          className="text-blue-600 hover:underline"
          onClick={() => setIsRegister((prev) => !prev)}
        >
          {isRegister ? "Back to Login" : "Create an account"}
        </button>
  
      </div>
    </div>
  );
};

export default Login;