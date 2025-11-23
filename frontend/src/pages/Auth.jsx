import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";

export default function Auth({ setRoute, setUserId, setUserType: setUserTypeProp }) {
  const [activeTab, setActiveTab] = useState("login"); // "login" or "register"
  const [userType, setUserType] = useState("tourist"); // "tourist" or "authority"
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Tourist Registration Form State
  const [touristReg, setTouristReg] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    nationality: "",
    currentLocation: "",
    profilePhoto: null,
    termsAccepted: false,
  });

  // Tourist Login Form State
  const [touristLogin, setTouristLogin] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Authority Registration Form State
  const [authorityReg, setAuthorityReg] = useState({
    fullName: "",
    officialEmail: "",
    password: "",
    confirmPassword: "",
    agencyType: "",
    agencyName: "",
    authorityId: "",
  });

  // Authority Login Form State
  const [authorityLogin, setAuthorityLogin] = useState({
    officialEmail: "",
    password: "",
  });

  // Profile photo preview
  const [photoPreview, setPhotoPreview] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTouristReg({ ...touristReg, profilePhoto: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateTouristRegistration = () => {
    if (!touristReg.fullName.trim()) {
      setError("Full Name is required");
      return false;
    }
    if (!touristReg.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(touristReg.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (touristReg.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (touristReg.password !== touristReg.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!touristReg.nationality) {
      setError("Nationality is required");
      return false;
    }
    if (!touristReg.currentLocation.trim()) {
      setError("Current Location is required");
      return false;
    }
    if (!touristReg.profilePhoto) {
      setError("Profile Photo is required");
      return false;
    }
    if (!touristReg.termsAccepted) {
      setError("You must accept the Terms & Conditions");
      return false;
    }
    return true;
  };

  const validateAuthorityRegistration = () => {
    if (!authorityReg.fullName.trim()) {
      setError("Full Name is required");
      return false;
    }
    if (!authorityReg.officialEmail.trim()) {
      setError("Official Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorityReg.officialEmail)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (authorityReg.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (authorityReg.password !== authorityReg.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!authorityReg.agencyType) {
      setError("Agency Type is required");
      return false;
    }
    if (!authorityReg.agencyName.trim()) {
      setError("Agency/Station Name is required");
      return false;
    }
    if (!authorityReg.authorityId.trim()) {
      setError("Authority ID / Badge Number is required");
      return false;
    }
    return true;
  };

  const handleTouristRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateTouristRegistration()) {
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("full_name", touristReg.fullName);
      formData.append("email", touristReg.email);
      formData.append("password", touristReg.password);
      formData.append("nationality", touristReg.nationality);
      formData.append("current_location", touristReg.currentLocation);
      formData.append("profile_photo", touristReg.profilePhoto);

      const response = await api.post("/auth/tourist/register/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Registration complete! Welcome to the Tourist Safety Portal.");
      // Store user ID and redirect to profile detail
      if (response.data.user_id && setUserId) {
        setUserId(response.data.user_id);
        if (setUserTypeProp) setUserTypeProp("tourist");
        setTimeout(() => {
          setRoute("tourist-profile");
        }, 2000);
      } else {
        setTimeout(() => {
          setActiveTab("login");
          setSuccess("");
        }, 3000);
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTouristLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!touristLogin.email || !touristLogin.password) {
      setError("Email and Password are required");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/tourist/login/", {
        email: touristLogin.email,
        password: touristLogin.password,
      });

      setSuccess("Login successful! Redirecting...");
      // Store token if provided
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userType", "tourist");
      }
      // Store user ID
      if (response.data.user?.id && setUserId) {
        setUserId(response.data.user.id);
        if (setUserTypeProp) setUserTypeProp("tourist");
      }
      setTimeout(() => {
        setRoute("dashboard");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorityRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateAuthorityRegistration()) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/authority/register/", {
        full_name: authorityReg.fullName,
        official_email: authorityReg.officialEmail,
        password: authorityReg.password,
        agency_type: authorityReg.agencyType,
        agency_name: authorityReg.agencyName,
        authority_id: authorityReg.authorityId,
      });

      setSuccess(
        "Access request submitted. Your details will be verified by an administrator shortly."
      );
      // Store user ID and redirect to profile detail
      if (response.data.user_id && setUserId) {
        setUserId(response.data.user_id);
        if (setUserTypeProp) setUserTypeProp("authority");
        setTimeout(() => {
          setRoute("authority-profile");
        }, 2000);
      } else {
        setTimeout(() => {
          setActiveTab("login");
          setSuccess("");
        }, 3000);
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorityLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!authorityLogin.officialEmail || !authorityLogin.password) {
      setError("Official Email and Password are required");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/authority/login/", {
        official_email: authorityLogin.officialEmail,
        password: authorityLogin.password,
      });

      setSuccess("Login successful! Redirecting...");
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userType", "authority");
      }
      // Store user ID
      if (response.data.user?.id && setUserId) {
        setUserId(response.data.user.id);
        if (setUserTypeProp) setUserTypeProp("authority");
      }
      setTimeout(() => {
        setRoute("dashboard");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  const nationalities = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Japan",
    "China",
    "India",
    "Brazil",
    "Mexico",
    "Other",
  ];

  const agencyTypes = [
    "Police",
    "Hospital/Medical",
    "Embassy",
    "Fire Department",
    "Tourism Authority",
    "Emergency Services",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">
            Tourist Safety Portal
          </h1>
          <p className="text-gray-400">Secure Authentication</p>
        </div>

        {/* Main Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => {
                setActiveTab("login");
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === "login"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setActiveTab("register");
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === "register"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              Register
            </button>
          </div>

          {/* User Type Selection */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setUserType("tourist");
                  setError("");
                  setSuccess("");
                }}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  userType === "tourist"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Tourist
              </button>
              <button
                onClick={() => {
                  setUserType("authority");
                  setError("");
                  setSuccess("");
                }}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  userType === "authority"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Authority
              </button>
            </div>
          </div>

          {/* Forms */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-4 bg-red-900/50 border border-red-600 rounded-lg text-red-200"
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-4 bg-green-900/50 border border-green-600 rounded-lg text-green-200"
                >
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tourist Login */}
            {activeTab === "login" && userType === "tourist" && (
              <motion.form
                key="tourist-login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleTouristLogin}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={touristLogin.email}
                    onChange={(e) =>
                      setTouristLogin({ ...touristLogin, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={touristLogin.password}
                      onChange={(e) =>
                        setTouristLogin({
                          ...touristLogin,
                          password: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white pr-12"
                      placeholder="Enter your password"
                      required
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

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={touristLogin.rememberMe}
                      onChange={(e) =>
                        setTouristLogin({
                          ...touristLogin,
                          rememberMe: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">Remember Me</span>
                  </label>
                  <a
                    href="#"
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Logging in..." : "Login to Safety Portal"}
                </button>
              </motion.form>
            )}

            {/* Tourist Registration */}
            {activeTab === "register" && userType === "tourist" && (
              <motion.form
                key="tourist-register"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleTouristRegister}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={touristReg.fullName}
                    onChange={(e) =>
                      setTouristReg({ ...touristReg, fullName: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address (Username) *
                  </label>
                  <input
                    type="email"
                    value={touristReg.email}
                    onChange={(e) =>
                      setTouristReg({ ...touristReg, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Password (Min. 8 characters) *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={touristReg.password}
                        onChange={(e) =>
                          setTouristReg({
                            ...touristReg,
                            password: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white pr-12"
                        placeholder="Enter password"
                        required
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
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={touristReg.confirmPassword}
                        onChange={(e) =>
                          setTouristReg({
                            ...touristReg,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white pr-12"
                        placeholder="Confirm password"
                        required
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

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nationality *
                  </label>
                  <select
                    value={touristReg.nationality}
                    onChange={(e) =>
                      setTouristReg({ ...touristReg, nationality: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    required
                  >
                    <option value="">Select Nationality</option>
                    {nationalities.map((nat) => (
                      <option key={nat} value={nat}>
                        {nat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Location / Travel Status *
                  </label>
                  <input
                    type="text"
                    value={touristReg.currentLocation}
                    onChange={(e) =>
                      setTouristReg({
                        ...touristReg,
                        currentLocation: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="e.g., Paris, France"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Upload Profile Photo * (Mandatory)
                  </label>
                  <p className="text-sm text-gray-400 mb-3">
                    Your photo is crucial for emergency verification and
                    identification.
                  </p>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-gray-800 border border-gray-700 rounded-lg px-6 py-3 hover:bg-gray-700 transition-colors">
                      <span className="text-white">Choose File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                        required
                      />
                    </label>
                    {photoPreview && (
                      <div className="relative">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="w-20 h-20 rounded-lg object-cover border border-gray-700"
                        />
                      </div>
                    )}
                  </div>
                  {touristReg.profilePhoto && (
                    <p className="text-sm text-green-400 mt-2">
                      ✓ Photo selected: {touristReg.profilePhoto.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      checked={touristReg.termsAccepted}
                      onChange={(e) =>
                        setTouristReg({
                          ...touristReg,
                          termsAccepted: e.target.checked,
                        })
                      }
                      className="mt-1 mr-2"
                      required
                    />
                    <span className="text-sm">
                      I accept the{" "}
                      <a href="#" className="text-blue-400 hover:text-blue-300">
                        Terms & Conditions
                      </a>{" "}
                      *
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Registering..." : "Register Safely"}
                </button>
              </motion.form>
            )}

            {/* Authority Login */}
            {activeTab === "login" && userType === "authority" && (
              <motion.form
                key="authority-login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleAuthorityLogin}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={authorityLogin.officialEmail}
                    onChange={(e) =>
                      setAuthorityLogin({
                        ...authorityLogin,
                        officialEmail: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="officer@police.gov"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={authorityLogin.password}
                    onChange={(e) =>
                      setAuthorityLogin({
                        ...authorityLogin,
                        password: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="text-right">
                  <a
                    href="#"
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Logging in..." : "Authority Login"}
                </button>
              </motion.form>
            )}

            {/* Authority Registration */}
            {activeTab === "register" && userType === "authority" && (
              <motion.form
                key="authority-register"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleAuthorityRegister}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={authorityReg.fullName}
                    onChange={(e) =>
                      setAuthorityReg({
                        ...authorityReg,
                        fullName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="John Smith"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Official Email (Username) *
                  </label>
                  <input
                    type="email"
                    value={authorityReg.officialEmail}
                    onChange={(e) =>
                      setAuthorityReg({
                        ...authorityReg,
                        officialEmail: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="officer@police.gov"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Must be an official email (e.g., @police.gov, @hospital.org)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Password (Min. 8 characters) *
                    </label>
                    <input
                      type="password"
                      value={authorityReg.password}
                      onChange={(e) =>
                        setAuthorityReg({
                          ...authorityReg,
                          password: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      placeholder="Enter password"
                      required
                      minLength={8}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      value={authorityReg.confirmPassword}
                      onChange={(e) =>
                        setAuthorityReg({
                          ...authorityReg,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      placeholder="Confirm password"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Agency Type *
                  </label>
                  <select
                    value={authorityReg.agencyType}
                    onChange={(e) =>
                      setAuthorityReg({
                        ...authorityReg,
                        agencyType: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    required
                  >
                    <option value="">Select Agency Type</option>
                    {agencyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Agency/Station Name *
                  </label>
                  <input
                    type="text"
                    value={authorityReg.agencyName}
                    onChange={(e) =>
                      setAuthorityReg({
                        ...authorityReg,
                        agencyName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="Central Police Station"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Unique Authority ID / Badge Number * (Required for
                    verification)
                  </label>
                  <input
                    type="text"
                    value={authorityReg.authorityId}
                    onChange={(e) =>
                      setAuthorityReg({
                        ...authorityReg,
                        authorityId: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="AUTH-12345"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Request Authority Access"}
                </button>
              </motion.form>
            )}
          </div>
        </motion.div>

        {/* Navigation Links */}
        <div className="text-center mt-6">
          <button
            onClick={() => setRoute("home")}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Portal
          </button>
        </div>
      </div>
    </div>
  );
}

