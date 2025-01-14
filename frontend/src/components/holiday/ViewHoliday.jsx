import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewHoliday = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("https://employee-management-system-backend-objq.onrender.com/api/holiday", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setHolidays(data.holidays);
      } catch (error) {
        toast.error("Failed to fetch holidays. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  const isToday = (holidayDate) => {
    const today = new Date();
    const holiday = new Date(holidayDate);
    return (
      today.getFullYear() === holiday.getFullYear() &&
      today.getMonth() === holiday.getMonth() &&
      today.getDate() === holiday.getDate()
    );
  };

  return (
    <div className="min-h-screen p-6">
      <ToastContainer />
      <div className="max-w-full mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Holiday Calendar
        </h1>

        {loading ? (
          <div className="text-center text-blue-500 font-semibold text-lg">
            Loading holidays...
          </div>
        ) : holidays.length === 0 ? (
          <div className="text-center text-gray-500 font-medium">
            No holidays found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {holidays.map((holiday, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg shadow-md transition-transform transform ${
                  isToday(holiday.date)
                    ? "bg-green-100 border-l-4 border-green-500"
                    : "bg-gray-50 hover:shadow-lg"
                }`}
              >
                {/* Holiday Name */}
                <h2
                  className={`text-xl font-bold ${
                    isToday(holiday.date) ? "text-green-700" : "text-gray-800"
                  }`}
                >
                  {holiday.name}
                </h2>

                {/* Holiday Details */}
                <p
                  className={`text-sm font-medium ${
                    isToday(holiday.date) ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  {new Date(holiday.date).toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewHoliday;
