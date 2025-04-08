import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import KorusImage from "../assets/Korus.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      if (response.data.success) {
        login(response.data.user);
        localStorage.setItem("token", response.data.token);
        if (response.data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else if (response.data.user.role === "accounts") {
          navigate("/accounts-dashboard");
        } else if (response.data.user.role === "hr") {
          navigate("/hr-dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-2 sm:px-2 lg:px-8">
        <div className="w-full max-w-md bg-white shadow-md shadow-gray-400 rounded-lg p-6">
          {/* Company Logo and Name */}
          <div className="text-center mb-8">
            <img
              src={KorusImage} // Replace with your logo's path
              alt="Company Logo"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-700">
              Korus Engineering Solutions
            </h1>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-500 transition-all sm:text-sm"
                placeholder="Enter your email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-6 relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"} // Toggle between text and password
                id="password"
                name="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-500 transition-all sm:text-sm"
                placeholder="Enter your password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* Eye Icon */}
              <button
                type="button"
                className="absolute inset-y-0 top-6 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
