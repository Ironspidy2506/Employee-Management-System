import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../HeaderFooter/Header";
import Footer from "../HeaderFooter/Footer";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useAuth } from "../../context/authContext";

const Password = () => {
  const [passwordDetails, setPasswordDetails] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { user } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordDetails({ ...passwordDetails, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `https://employee-management-system-backend-objq.onrender.com/api/users/update-password/${user._id}`,
        passwordDetails,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        toast.success("Password updated successfully");
        setPasswordDetails({
          oldPassword: "",
          newPassword: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="flex items-center justify-center">
        <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-center text-xl font-bold text-gray-700 mb-6">
            Change Your Password
          </h2>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Old Password */}
            <div className="relative">
              <label className="block text-md font-medium text-gray-600 mb-2">
                Old Password
              </label>
              <div className="flex items-center">
                <input
                  type={showOldPassword ? "text" : "password"} // Toggle between text and password
                  name="oldPassword"
                  value={passwordDetails.oldPassword}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your old password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="ml-2 text-xl text-gray-600"
                >
                  {showOldPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="relative">
              <label className="block text-md font-medium text-gray-600 mb-2">
                New Password
              </label>
              <div className="flex items-center">
                <input
                  type={showNewPassword ? "text" : "password"} // Toggle between text and password
                  name="newPassword"
                  value={passwordDetails.newPassword}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="ml-2 text-xl text-gray-600"
                >
                  {showNewPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-2/5 py-3 bg-green-600 text-white rounded-lg text-base hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Password;
