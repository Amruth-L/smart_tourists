import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../api";

export default function AuthorityProfileDetail({ userId, onComplete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    official_email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
    officer_id: "",
  });

  useEffect(() => {
    // Load existing profile if userId is provided
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const loadProfile = async () => {
    try {
      const response = await api.get(`/profile/authority/?user_id=${userId}`);
      const profile = response.data;
      setFormData({
        full_name: profile.full_name || "",
        official_email: profile.official_email || "",
        phone_number: profile.phone || "",
        password: "",
        confirm_password: "",
        officer_id: profile.authority_id || "",
      });
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  };

  const validateForm = () => {
    if (!formData.full_name.trim()) {
      setError("Full Name is required");
      return false;
    }
    if (!formData.official_email.trim()) {
      setError("Official Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.official_email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.phone_number.trim()) {
      setError("Phone Number is required");
      return false;
    }
    if (!formData.officer_id.trim()) {
      setError("Officer ID is required");
      return false;
    }
    if (formData.password && formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        user_id: userId,
        full_name: formData.full_name,
        official_email: formData.official_email,
        phone_number: formData.phone_number,
        officer_id: formData.officer_id,
      };

      if (formData.password) {
        submitData.password = formData.password;
        submitData.confirm_password = formData.confirm_password;
      }

      const response = await api.put("/profile/authority/", submitData);

      setSuccess("Authority Profile saved successfully!");
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to save profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-2xl shadow-2xl p-8"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">
            Authority Profile Details
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-600 rounded-lg text-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-900/50 border border-green-600 rounded-lg text-green-200">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Official Contact Information Section */}
            <div className="border-b border-gray-700 pb-6">
              <h3 className="text-xl font-semibold mb-4">
                Official Contact Information
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  placeholder="John Smith"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Official Email *
                </label>
                <input
                  type="email"
                  value={formData.official_email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      official_email: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  placeholder="officer@police.gov"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone_number: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  placeholder="+1234567890"
                  required
                />
              </div>
            </div>

            {/* Security Section */}
            <div className="border-b border-gray-700 pb-6">
              <h3 className="text-xl font-semibold mb-4">Security (Login Details)</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Password {userId ? "(Leave blank to keep current)" : "*"}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white pr-12"
                      placeholder="Enter password"
                      required={!userId}
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Confirm Password {userId ? "(Leave blank to keep current)" : "*"}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirm_password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirm_password: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white pr-12"
                      placeholder="Confirm password"
                      required={!userId}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Identification Section */}
            <div className="pb-6">
              <h3 className="text-xl font-semibold mb-4">Identification</h3>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Officer ID *
                </label>
                <input
                  type="text"
                  value={formData.officer_id}
                  onChange={(e) =>
                    setFormData({ ...formData, officer_id: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  placeholder="AUTH-12345"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Authority Profile"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

