import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import KorusImage from "../assets/Korus.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Password = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    try {
      e.preventDefault();

      const { data } = await axios.post(
        `https://korus-employee-management-system-mern-stack.vercel.app/api/auth/send-reset-otp`,
        {
          email,
        }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOtp = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;

      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join("");
      setOtp(otp);
      setIsOtpSubmitted(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitPassword = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(
        `https://korus-employee-management-system-mern-stack.vercel.app/api/auth/reset-password`,
        {
          email,
          otp,
          password,
        }
      );

      if (data.success) {
        toast.success(data.message);
        setTimeout(() => {
          navigate("/login");
        }, 500);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex items-center justify-center min-h-screen">
        {!isEmailSent && (
          <form
            className="p-10 rounded-lg shadow-lg w-96 text-sm"
            onSubmit={onSubmitEmail}
          >
            <div className="text-center mb-4">
              <img
                src={KorusImage} // Replace with your logo's path
                alt="Company Logo"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h1 className="text-2xl font-bold text-gray-700">
                Korus Engineering Solutions
              </h1>
            </div>
            <h1 className="text-gray-700 text-2xl font-bold text-center mb-4">
              Reset Password
            </h1>
            <p className="text-center mb-4 text-gray-700">
              Enter your registered email address.
            </p>
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full border-2 border-black">
              <input
                className="outline-none flex-1 text-black"
                type="text"
                placeholder="Email Id"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button className="w-full bg-blue-500 py-3 text-white rounded-full">
              Submit
            </button>
          </form>
        )}

        {!isOtpSubmitted && isEmailSent && (
          <form
            className="p-10 rounded-lg shadow-lg w-96 text-sm"
            onSubmit={onSubmitOtp}
          >
            <div className="text-center mb-4">
              <img
                src={KorusImage} // Replace with your logo's path
                alt="Company Logo"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h1 className="text-2xl font-bold text-gray-700">
                Korus Engineering Solutions
              </h1>
            </div>
            <h1 className="text-gray-700 text-2xl font-bold text-center mb-4">
              Reset Password OTP
            </h1>
            <p className="text-center mb-6 text-gray-700">
              Enter the 6-digit code sent to your email id.
            </p>
            <div className="flex justify-between mb-8" onPaste={handlePaste}>
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    type="text"
                    maxLength="1"
                    key={index}
                    className="w-12 h-12 text-black text-center text-xl rounded-md border-2 border-black"
                    ref={(e) => (inputRefs.current[index] = e)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
            </div>
            <button className="w-full py-2.5 bg-blue-500 text-white rounded-full">
              Submit
            </button>
          </form>
        )}

        {isOtpSubmitted && isEmailSent && (
          <form
            className="p-10 rounded-lg shadow-lg w-96 text-sm"
            onSubmit={onSubmitPassword}
          >
            <div className="text-center mb-4">
              <img
                src={KorusImage} // Replace with your logo's path
                alt="Company Logo"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h1 className="text-2xl font-bold text-gray-700">
                Korus Engineering Solutions
              </h1>
            </div>
            <h1 className="text-gray-700 text-2xl font-bold text-center mb-4">
              New Password
            </h1>
            <p className="text-center mb-6 text-gray-700">
              Enter new password.
            </p>
            <div className="relative w-full mb-4">
              <input
                className="w-full outline-none text-black px-5 py-2.5 pr-12 rounded-full border-2 border-black"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </span>
            </div>

            <button className="w-full py-3 bg-blue-500 text-white rounded-full">
              Submit
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default Password;