import React, { useRef } from "react";
import { Formik, Field } from "formik"; // We'll use the 'Field' component for simplicity
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from 'axios';

// Reusable Radio Group Component for Tech Selection 
interface RadioGroupProps {
  label: string;
  name: string;
  options: string[];
  otherFieldName: string;
  selectedValue: string;
  error?: string;
  touched?: boolean;
}


const TechRadioGroup: React.FC<RadioGroupProps> = ({ label, name, options, otherFieldName, selectedValue, error, touched }) => ( // Reusable component for tech selection with "Other" option
  // This component renders a group of radio buttons for tech selection
  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
    <label className="font-semibold text-gray-800">{label}:</label>
    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
      {options.map((tech) => (
        <label key={tech} className="flex items-center space-x-2">
          <Field type="radio" name={name} value={tech} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
          <span className="text-gray-700">{tech}</span>
        </label>
      ))}
    </div>
    {/*Conditional Text Input for "Other" */}
    {selectedValue === 'Other' && (
      <Field
        type="text"
        name={otherFieldName}
        placeholder="Please specify"
        className="mt-3 p-2 border border-gray-300 rounded w-full"
      />
    )}
    {error && touched && <div className="text-red-500 text-sm mt-1">{error}</div>}
  </div>
);


const SurveyForm: React.FC = () => { // Main Survey Form Component
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Formik
      initialValues={{
        name: "", email: "", role: "",
        preferredFrontend: "", preferredBackend: "", preferredDatabase: "", preferredHosting: "",
        preferredFrontendOther: "", preferredBackendOther: "", preferredDatabaseOther: "", preferredHostingOther: "",
        file: null as File | null,
      }}
      validationSchema={Yup.object({
        name: Yup.string(),
        email: Yup.string().email("Invalid email"),
        role: Yup.string().required("Role is required"),

        // Validation logic for conditional fields
        preferredFrontend: Yup.string().when('role', {
          is: (role: string) => role === 'frontend' || role === 'fullstack',
          then: (schema) => schema.required('Frontend tech is required'),
          otherwise: (schema) => schema.nullable(),
        }),
        preferredBackend: Yup.string().when('role', {
          is: (role: string) => role === 'backend' || role === 'fullstack',
          then: (schema) => schema.required('Backend tech is required'),
          otherwise: (schema) => schema.nullable(),
        }),
        preferredDatabase: Yup.string().when('role', {
          is: (role: string) => role === 'backend' || role === 'fullstack',
          then: (schema) => schema.required('Database is required'),
          otherwise: (schema) => schema.nullable(),
        }),
        preferredHosting: Yup.string().when('role', {
          is: (role: string) => role === 'frontend' || role === 'fullstack',
          then: (schema) => schema.required('Hosting is required'),
          otherwise: (schema) => schema.nullable(),
        }),
      })}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
            const formData = new FormData();
            // Append all values from the form to FormData
            Object.entries(values).forEach(([key, value]) => {
                if (key === 'file' && value instanceof File) {
                    formData.append(key, value);
                } else if (value !== null && value !== undefined) {
                    formData.append(key, String(value));
                }
            });

            await axios.post("/api/submit", formData, { headers: { 'Content-Type': 'multipart/form-data' } });

            toast.success("Thank you! Your survey has been submitted.");
            resetForm();
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
          toast.error("An error occurred. Please try again.");
          console.error("Submission Error:", error);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {/* We pass the 'values' from Formik to watch for changes */}
      {({ handleSubmit, values, errors, touched, setFieldValue, isSubmitting }) => (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6 w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">
          {/* Name and Email */}
          <div className="flex flex-col space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Developer Tech Survey</h2>
            <Field type="text" name="name" placeholder="Name (optional)" className="p-3 border border-gray-300 rounded-lg"/>
            <Field type="email" name="email" placeholder="Email (optional)" className="p-3 border border-gray-300 rounded-lg"/>
          </div>

          {/* Role Dropdown */}
          <div>
            <label htmlFor="role" className="font-semibold text-gray-800">What is your primary role?</label>
            <Field as="select" name="role" id="role" className="mt-2 p-3 border border-gray-300 rounded-lg w-full bg-white">
                <option value="">Select a Role...</option>
                <option value="frontend">Frontend Developer</option>
                <option value="backend">Backend Developer</option>
                <option value="fullstack">Fullstack Developer</option>
            </Field>
            {errors.role && touched.role && <div className="text-red-500 text-sm mt-1">{errors.role}</div>}
          </div>

          {/* Show Frontend & Hosting for 'frontend' or 'fullstack' roles */}
          {(values.role === 'frontend' || values.role === 'fullstack') && (
            <>
              <TechRadioGroup
                label="Preferred Frontend Tech" name="preferredFrontend"
                options={["React", "Vue", "Angular", "Other"]} otherFieldName="preferredFrontendOther"
                selectedValue={values.preferredFrontend} error={errors.preferredFrontend} touched={touched.preferredFrontend}
              />
              <TechRadioGroup
                label="Preferred Hosting Platform" name="preferredHosting"
                options={["Vercel", "Azure", "Netlify", "Other"]} otherFieldName="preferredHostingOther"
                selectedValue={values.preferredHosting} error={errors.preferredHosting} touched={touched.preferredHosting}
              />
            </>
          )}

          {/* Show Backend & Database for 'backend' or 'fullstack' roles */}
          {(values.role === 'backend' || values.role === 'fullstack') && (
            <>
              <TechRadioGroup
                label="Preferred Backend Tech" name="preferredBackend"
                options={["Node.js", "Python", "Go", "Other"]} otherFieldName="preferredBackendOther"
                selectedValue={values.preferredBackend} error={errors.preferredBackend} touched={touched.preferredBackend}
              />
              <TechRadioGroup
                label="Preferred Database" name="preferredDatabase"
                options={["MongoDB", "PostgreSQL", "CosmosDB", "Other"]} otherFieldName="preferredDatabaseOther"
                selectedValue={values.preferredDatabase} error={errors.preferredDatabase} touched={touched.preferredDatabase}
              />
            </>
          )}

          {/* File upload (always visible) */}
          <div>
            <label className="font-semibold text-gray-800">Upload Resume/Portfolio (PDF only):</label>
            <input type="file" name="file" ref={fileInputRef} accept=".pdf"
                onChange={(event) => { if (event.currentTarget.files) { setFieldValue("file", event.currentTarget.files[0]); } }}
                className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
          </div>

          <button type="submit" className="bg-blue-600 text-white font-bold p-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Survey"}
          </button>
        </form>
      )}
    </Formik>
  );
};

export default SurveyForm;