import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Card from "../components/Card";

export default function Auth() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [userType, setUserType] = useState("tourist");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const [touristLogin, setTouristLogin] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [authorityReg, setAuthorityReg] = useState({
    fullName: "",
    officialEmail: "",
    password: "",
    confirmPassword: "",
    agencyType: "",
    agencyName: "",
    authorityId: "",
  });

  const [authorityLogin, setAuthorityLogin] = useState({
    officialEmail: "",
    password: "",
  });

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
      if (response.data.user_id) {
        localStorage.setItem("userId", response.data.user_id);
        localStorage.setItem("userType", "tourist");
        setTimeout(() => {
          navigate("/tourist-profile");
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
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userType", "tourist");
      }
      if (response.data.user?.id) {
        localStorage.setItem("userId", response.data.user.id);
      }
      setTimeout(() => {
        navigate("/dashboard");
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
      if (response.data.user_id) {
        localStorage.setItem("userId", response.data.user_id);
        localStorage.setItem("userType", "authority");
        setTimeout(() => {
          navigate("/authority-profile");
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
      if (response.data.user?.id) {
        localStorage.setItem("userId", response.data.user.id);
      }
      setTimeout(() => {
        navigate("/dashboard");
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
    "United States", "United Kingdom", "Canada", "Australia", "Germany",
    "France", "Italy", "Spain", "Japan", "China", "India", "Brazil", "Mexico", "Other",
  ];

  const agencyTypes = [
    "Police", "Hospital/Medical", "Embassy", "Fire Department",
    "Tourism Authority", "Emergency Services", "Other",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Tourist Safety Portal
          </h1>
          <p className="text-gray-600">Secure Authentication</p>
        </motion.div>

        <Card className="shadow-xl">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => {
                setActiveTab("login");
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-4 px-6 font-semibold transition-colors rounded-t-lg ${
                activeTab === "login"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
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
              className={`flex-1 py-4 px-6 font-semibold transition-colors rounded-t-lg ${
                activeTab === "register"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              Register
            </button>
          </div>

          <div className="p-6 border-b border-gray-200 mb-6">
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setUserType("tourist");
                  setError("");
                  setSuccess("");
                }}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  userType === "tourist"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Authority
              </button>
            </div>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700"
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-700"
                >
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

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
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={touristLogin.email}
                    onChange={(e) =>
                      setTouristLogin({ ...touristLogin, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 pr-12"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                    <span className="text-sm text-gray-600">Remember Me</span>
                  </label>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {loading ? "Logging in..." : "Login to Safety Portal"}
                </button>
              </motion.form>
            )}

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
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={touristReg.fullName}
                    onChange={(e) =>
                      setTouristReg({ ...touristReg, fullName: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Email Address (Username) *
                  </label>
                  <input
                    type="email"
                    value={touristReg.email}
                    onChange={(e) =>
                      setTouristReg({ ...touristReg, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
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
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 pr-12"
                        placeholder="Enter password"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
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
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 pr-12"
                        placeholder="Confirm password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Nationality *
                  </label>
                  <select
                    value={touristReg.nationality}
                    onChange={(e) =>
                      setTouristReg({ ...touristReg, nationality: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
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
                  <label className="block text-sm font-medium mb-2 text-gray-700">
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
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    placeholder="e.g., Paris, France"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Upload Profile Photo * (Mandatory)
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    Your photo is crucial for emergency verification and identification.
                  </p>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 transition-colors">
                      <span>Choose File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                        required
                      />
                    </label>
                    {photoPreview && (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-20 h-20 rounded-lg object-cover border border-gray-300"
                      />
                    )}
                  </div>
                  {touristReg.profilePhoto && (
                    <p className="text-sm text-green-600 mt-2">
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
                    <span className="text-sm text-gray-600">
                      I accept the{" "}
                      <a href="#" className="text-blue-600 hover:text-blue-700">
                        Terms & Conditions
                      </a>{" "}
                      *
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {loading ? "Registering..." : "Register Safely"}
                </button>
              </motion.form>
            )}

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
                  <label className="block text-sm font-medium mb-2 text-gray-700">
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
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    placeholder="officer@police.gov"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
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
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="text-right">
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {loading ? "Logging in..." : "Authority Login"}
                </button>
              </motion.form>
            )}

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
                  <label className="block text-sm font-medium mb-2 text-gray-700">
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
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    placeholder="John Smith"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
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
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    placeholder="officer@police.gov"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must be an official email (e.g., @police.gov, @hospital.org)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      placeholder="Enter password"
                      required
                      minLength={8}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      placeholder="Confirm password"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
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
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
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
                  <label className="block text-sm font-medium mb-2 text-gray-700">
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
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    placeholder="Central Police Station"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Unique Authority ID / Badge Number * (Required for verification)
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
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    placeholder="AUTH-12345"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {loading ? "Submitting..." : "Request Authority Access"}
                </button>
              </motion.form>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
