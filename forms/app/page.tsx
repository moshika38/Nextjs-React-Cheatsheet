'use client'
import { useState } from "react";


export default function Home() {

  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    email: ""
  })

  const [errors, setErrors] = useState({
    nameError: "",
    dobError: "",
    genderError: "",
    emailError: ""
  });

  const validate = () => {
    const newErrors = {
      nameError: "",
      dobError: "",
      genderError: "",
      emailError: ""
    };

    if (formData.fullName.trim() === "") {
      newErrors.nameError = "Please enter your full name";
    }

    if (formData.dateOfBirth === "") {
      newErrors.dobError = "Please enter your date of birth";
    }

    if (formData.gender === "") {
      newErrors.genderError = "Please select your gender";
    }

    if (formData.email.trim() === "") {
      newErrors.emailError = "Please enter your email address";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmitForm = () => {
    if (!validate()) {
      return;
    }

    console.log(formData);
    alert("Form Submitted");
  }



  return (
    <>
      <div className="flex flex-col w-screen h-screen items-center justify-center bg-gray-200 font-sans">
        <div className="w-112.5 bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">

          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Bio Data</h1>
            <p className="text-sm text-gray-500 mt-1">Please enter your basic information</p>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-4">

            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">Full Name</label>
              <input
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
              {errors.nameError && <span className="text-xs text-red-500 font-medium">{errors.nameError}</span>}
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">Date of Birth</label>
              <input
                type="date"
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
              {errors.dobError && <span className="text-xs text-red-500 font-medium">{errors.dobError}</span>}
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">Gender</label>
              <select
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.genderError && <span className="text-xs text-red-500 font-medium">{errors.genderError}</span>}
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">Email Address</label>
              <input
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                type="email"
                placeholder="johndoe@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
              {errors.emailError && <span className="text-xs text-red-500 font-medium">{errors.emailError}</span>}
            </div>

          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitForm}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition duration-200 shadow-md">
            Save Bio Data
          </button>

        </div>
      </div>
    </>
  );
}