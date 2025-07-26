import React, { useRef } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addSubmission } from "../lib/surveySlice"; // Make sure this import path is correct

const techOptions = {
  frontend: ["React", "Vue", "Angular", "Other"],
  backend: ["Node.js", "Python", "Go", "Other"],
  database: ["MongoDB", "PostgreSQL", "CosmosDB", "Other"],
  hosting: ["Vercel", "Azure", "Netlify", "Other"],
};

const SurveyForm: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
        role: "",
        preferredFrontend: "",
        preferredBackend: "",
        preferredDatabase: "",
        preferredHosting: "",
        file: null as File | null,
      }}
      validationSchema={Yup.object({
        name: Yup.string(),
        email: Yup.string().email("Invalid email"),
        role: Yup.string().required("Role is required"),
        preferredFrontend: Yup.string().required("Frontend tech is required"),
        preferredBackend: Yup.string().required("Backend tech is required"),
        preferredDatabase: Yup.string().required("Database is required"),
        preferredHosting: Yup.string().required("Hosting is required"),
      })}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          const submission = {
            name: values.name,
            email: values.email,
            role: values.role,
            preferredFrontend: values.preferredFrontend,
            preferredBackend: values.preferredBackend,
            preferredDatabase: values.preferredDatabase,
            preferredHosting: values.preferredHosting,
            // Optionally, you can add file name or URL here if needed
          };

          // Save to localStorage
          const prev = JSON.parse(localStorage.getItem("surveySubmissions") || "[]");
          localStorage.setItem("surveySubmissions", JSON.stringify([...prev, submission]));

          // Send to Redux for admin dashboard
          dispatch(addSubmission(submission));

          // Axios Configuration (send to a backend)
          // const formData = new FormData();
          // Object.entries(values).forEach(([key, value]) => {
          //   if (key === "file" && value) {
          //     formData.append(key, value as File);
          //   } else if (key !== "file") {
          //     formData.append(key, value as string);
          //   }
          // });
          // await axios.post("https://example.com/api/survey", formData, {
          //   headers: { "Content-Type": "multipart/form-data" },
          // });

          toast.success("Survey submitted successfully!");
          resetForm();
          if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
          toast.error("Failed to submit survey.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        handleSubmit,
        handleChange,
        setFieldValue,
        values,
        errors,
        touched,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full max-w-md bg-white p-6 rounded shadow hover:shadow-lg">
          {/* Name and Email at the top */}
          <div className="flex flex-col space-y-2 mb-4">
            <input
              type="text"
              name="name"
              placeholder="Name (optional)"
              value={values.name}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email (optional)"
              value={values.email}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Role dropdown */}
          <select
            name="role"
            value={values.role}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">Select Role</option>
            <option value="frontend">Frontend</option>
            <option value="fullstack">Fullstack</option>
            <option value="backend">Backend</option>
          </select>
          {errors.role && touched.role && <div className="text-red-500">{errors.role}</div>}

          {/* Preferred Techs as radio groups */}
          <div>
            <label className="font-semibold">Preferred Frontend Tech:</label>
            <div className="flex flex-wrap gap-4 mt-1">
              {techOptions.frontend.map((tech) => (
                <label key={tech} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="preferredFrontend"
                    value={tech}
                    checked={values.preferredFrontend === tech}
                    onChange={handleChange}
                  />
                  <span>{tech}</span>
                </label>
              ))}
            </div>
            {errors.preferredFrontend && touched.preferredFrontend && (
              <div className="text-red-500">{errors.preferredFrontend}</div>
            )}
          </div>

          <div>
            <label className="font-semibold">Preferred Backend Tech:</label>
            <div className="flex flex-wrap gap-4 mt-1">
              {techOptions.backend.map((tech) => (
                <label key={tech} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="preferredBackend"
                    value={tech}
                    checked={values.preferredBackend === tech}
                    onChange={handleChange}
                  />
                  <span>{tech}</span>
                </label>
              ))}
            </div>
            {errors.preferredBackend && touched.preferredBackend && (
              <div className="text-red-500">{errors.preferredBackend}</div>
            )}
          </div>

          <div>
            <label className="font-semibold">Preferred Database:</label>
            <div className="flex flex-wrap gap-4 mt-1">
              {techOptions.database.map((tech) => (
                <label key={tech} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="preferredDatabase"
                    value={tech}
                    checked={values.preferredDatabase === tech}
                    onChange={handleChange}
                  />
                  <span>{tech}</span>
                </label>
              ))}
            </div>
            {errors.preferredDatabase && touched.preferredDatabase && (
              <div className="text-red-500">{errors.preferredDatabase}</div>
            )}
          </div>

          <div>
            <label className="font-semibold">Preferred Hosting:</label>
            <div className="flex flex-wrap gap-4 mt-1">
              {techOptions.hosting.map((tech) => (
                <label key={tech} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="preferredHosting"
                    value={tech}
                    checked={values.preferredHosting === tech}
                    onChange={handleChange}
                  />
                  <span>{tech}</span>
                </label>
              ))}
            </div>
            {errors.preferredHosting && touched.preferredHosting && (
              <div className="text-red-500">{errors.preferredHosting}</div>
            )}
          </div>

          {/* File upload */}
          <input
            type="file"
            name="file"
            ref={fileInputRef}
            accept=".pdf"
            onChange={(event) => {
              if (event.currentTarget.files && event.currentTarget.files[0]) {
                setFieldValue("file", event.currentTarget.files[0]);
              }
            }}
            className="p-2 border border-gray-300 rounded"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}
    </Formik>
  );
};

export default SurveyForm;