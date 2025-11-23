import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../api";

export default function TouristProfileDetail({ userId, onComplete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
    from_address: "",
    to_address: "",
    arrival_date: "",
    departure_date: "",
    hotel_name: "",
    hotel_address: "",
    profile_photo: null,
  });

  useEffect(() => {
    // Load existing profile if userId is provided
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const loadProfile = async () => {
    try {
      const response = await api.get(`/profile/tourist/?user_id=${userId}`);
      const profile = response.data;
      setFormData({
        full_name: profile.name || "",
        email: profile.email || "",
        phone_number: profile.phone || "",
        password: "",
        confirm_password: "",
        from_address: profile.from_address || "",
        to_address: profile.to_address || "",
        arrival_date: profile.arrival_date || "",
        departure_date: profile.departure_date || "",
        hotel_name: profile.hotel_name || "",
        hotel_address: profile.hotel_address || "",
        profile_photo: null,
      });
      if (profile.profile_photo) {
        setPhotoPreview(profile.profile_photo);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile_photo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.full_name.trim()) {
      setError("Full Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.phone_number.trim()) {
      setError("Phone Number is required");
      return false;
    }
    if (!formData.from_address.trim()) {
      setError("From Address (Origin) is required");
      return false;
    }
    if (!formData.to_address.trim()) {
      setError("To Address (Destination) is required");
      return false;
    }
    if (!formData.arrival_date) {
      setError("Arrival Date is required");
      return false;
    }
    if (!formData.departure_date) {
      setError("Departure Date is required");
      return false;
    }
    if (!formData.hotel_name.trim()) {
      setError("Hotel Name is required");
      return false;
    }
    if (!formData.hotel_address.trim()) {
      setError("Hotel Address is required");
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
      const submitData = new FormData();
      submitData.append("user_id", userId);
      submitData.append("full_name", formData.full_name);
      submitData.append("email", formData.email);
      submitData.append("phone_number", formData.phone_number);
      submitData.append("from_address", formData.from_address);
      submitData.append("to_address", formData.to_address);
      submitData.append("arrival_date", formData.arrival_date);
      submitData.append("departure_date", formData.departure_date);
      submitData.append("hotel_name", formData.hotel_name);
      submitData.append("hotel_address", formData.hotel_address);
      if (formData.password) {
        submitData.append("password", formData.password);
        submitData.append("confirm_password", formData.confirm_password);
      }
      if (formData.profile_photo) {
        submitData.append("profile_photo", formData.profile_photo);
      }

      const response = await api.put("/profile/tourist/", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Tourist Profile saved successfully!");
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
            Tourist Profile Details
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
            {/* Personal Information Section */}
            <div className="border-b border-gray-700 pb-6">
              <h3 className="text-xl font-semibold mb-4">Personal Information</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Photo Upload *
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer bg-gray-800 border border-gray-700 rounded-lg px-6 py-3 hover:bg-gray-700 transition-colors">
                    <span className="text-white">Choose Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      required={!photoPreview}
                    />
                  </label>
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-24 h-24 rounded-lg object-cover border border-gray-700"
                    />
                  )}
                </div>
              </div>

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
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  placeholder="your.email@example.com"
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
                    setFormData({ ...formData, phone_number: e.target.value })
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

            {/* Travel Details Section */}
            <div className="border-b border-gray-700 pb-6">
              <h3 className="text-xl font-semibold mb-4">Travel Details</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  From Address (Origin) *
                </label>
                <textarea
                  value={formData.from_address}
                  onChange={(e) =>
                    setFormData({ ...formData, from_address: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  rows="3"
                  placeholder="Enter your origin address"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  To Address (Destination) *
                </label>
                <textarea
                  value={formData.to_address}
                  onChange={(e) =>
                    setFormData({ ...formData, to_address: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  rows="3"
                  placeholder="Enter your destination address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Arrival Date *
                  </label>
                  <input
                    type="date"
                    value={formData.arrival_date}
                    onChange={(e) =>
                      setFormData({ ...formData, arrival_date: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Departure Date *
                  </label>
                  <input
                    type="date"
                    value={formData.departure_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        departure_date: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Hotel Name & Address *
                </label>
                <input
                  type="text"
                  value={formData.hotel_name}
                  onChange={(e) =>
                    setFormData({ ...formData, hotel_name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white mb-2"
                  placeholder="Hotel Name"
                  required
                />
                <textarea
                  value={formData.hotel_address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hotel_address: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  rows="3"
                  placeholder="Hotel Address"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Tourist Profile"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

