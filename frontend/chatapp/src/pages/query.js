import React, { useState } from 'react';
import { FileContext, useFileContext } from '@/context/Auth';
import axios from 'axios';

const Query = () => {
  const { user, role } = useFileContext();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    reason: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    let formErrors = {};

    if (!formData.name.trim()) {
      formErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      formErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = "Email address is invalid";
    }

    if (!formData.reason) {
      formErrors.reason = "Please select a reason";
    }

    if (!formData.message?.trim()) {
      formErrors.message = "Message is required";
    }

    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();

    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await axios.post("/api/queryemail", JSON.stringify(formData), {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        if (response?.status !== 200) {
          return;
        }

        setFormData({ name: '', email: '', message: '', reason: '' });
      } catch (err) {
        console.error(err);
      }
    } else {
      setErrors(formErrors);
    }
  };

  const handleClick = () => {
    try {
      const { name, email, message, reason } = formData;
  
      const recipient = "adityagarg8384@gmail.com";
  
      const body = `
  New Query from ${name}
  
  -----------------------------------
  🔹 Name: ${name}
  🔹 Email: ${email}
  🔹 Reason: ${reason}
  -----------------------------------
  
  📩 Message:
  -----------------------------------
  ${message}
  -----------------------------------
  
  Best Regards,  
  ${name}
      `;
  
      const subject = `Query from ${name} regarding ${reason}`;
      const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
      window.location.href = mailtoLink;
    } catch (err) {
      console.error(err);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-center text-orange-600 mb-4">
          How can I help?
        </h1>
        <p className="text-center text-gray-700 mb-8">
          Do you have a question or are you interested in working with my team and me?
          Just fill out the form fields below.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label htmlFor="reason" className="block text-gray-700 font-semibold mb-2">
              I had like to chat about...
            </label>
            {role === "student" ? (
              <select
                name="reason"
                value={formData?.reason}
                onChange={handleChange}
                required
                className={`w-full border ${errors.reason ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
              >
                <option value="">Select an option</option>
                <option value="Ask a question">Ask a question</option>
                <option value="Give Suggestion">Give Suggestion</option>
                <option value="Complaint Regarding Recruiter">Complaint Regarding Recruiter</option>
                <option value="Complaint Regarding Other Student">Complaint Regarding Other Student</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <select
                name="reason"
                value={formData?.reason}
                onChange={handleChange}
                required
                className={`w-full border ${errors.reason ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
              >
                <option value="">Select an option</option>
                <option value="Ask a question">Ask a question</option>
                <option value="Give Suggestion">Give Suggestion</option>
                <option value="Complaint Regarding Student">Complaint Regarding Student</option>
                <option value="Other">Other</option>
              </select>
            )}

            {errors?.reason && <p className="text-red-500 text-sm">{errors?.reason}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData?.name}
                onChange={handleChange}
                required
                placeholder="Your Name"
                className={`w-full border ${errors?.name ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
              {errors?.name && <p className="text-red-500 text-sm">{errors?.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData?.email}
                onChange={handleChange}
                required
                placeholder="Your Email"
                className={`w-full border ${errors?.email ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
              {errors?.email && <p className="text-red-500 text-sm">{errors?.email}</p>}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={formData?.message}
              onChange={handleChange}
              required
              placeholder="Remember, short & sweet (please)."
              className={`w-full border ${errors?.message ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
              rows="4"
            ></textarea>
            {errors?.message && <p className="text-red-500 text-sm">{errors?.message}</p>}
          </div>

        </form>

        <button
          type="button"
          className="w-full bg-orange-600 text-white font-semibold py-2 rounded-lg hover:bg-orange-700 transition duration-200 mt-4"
          onClick={handleClick}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Query;
