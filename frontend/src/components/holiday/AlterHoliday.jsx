import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const AlterHoliday = () => {
  const [showForm, setShowForm] = useState(false);
  const [holidayName, setHolidayName] = useState("");
  const [holidayDate, setHolidayDate] = useState("");
  const [holidays, setHolidays] = useState([]);
  const [editableHoliday, setEditableHoliday] = useState(null);

  // Fetch holidays from the server
  const getHolidays = async () => {
    try {
      const { data } = await axios.get("https://korus-ems-backend.onrender.com/api/holiday", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (data.success) {
        const formattedHolidays = data.holidays.map((holiday) => ({
          ...holiday,
          date: formatDate(holiday.date),
        }));
        setHolidays(formattedHolidays);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch holidays.");
    }
  };

  useEffect(() => {
    getHolidays();
  }, []);

  const addHoliday = async () => {
    if (!holidayName || !holidayDate) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const { data } = await axios.post(
        "https://korus-ems-backend.onrender.com/api/holiday/add-holiday",
        { name: holidayName, date: holidayDate },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setHolidayDate("");
        setHolidayName("");
        getHolidays();
        setShowForm(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to add holiday.");
    }
  };

  const editHoliday = async (_id, updatedHoliday) => {
    try {
      const { data } = await axios.put(
        `https://korus-ems-backend.onrender.com/api/holiday/edit-holiday/${_id}`,
        updatedHoliday,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setHolidays(
          holidays.map((holiday) =>
            holiday._id === _id
              ? {
                  ...holiday,
                  ...updatedHoliday,
                  date: formatDate(updatedHoliday.date),
                }
              : holiday
          )
        );
        setEditableHoliday(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to edit holiday.");
    }
  };

  const deleteHoliday = async (_id) => {
    try {
      const { data } = await axios.delete(
        `https://korus-ems-backend.onrender.com/api/holiday/delete-holiday/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setHolidays(holidays.filter((holiday) => holiday._id !== _id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to delete holiday.");
    }
  };

  return (
    <div className="p-4">
      <ToastContainer />
      <div className="max-w-full mx-auto">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "Add Holiday"}
        </button>

        {showForm && (
          <div className="bg-white p-6 mt-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">Add Holiday</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Holiday Name"
                value={holidayName}
                onChange={(e) => setHolidayName(e.target.value)}
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={holidayDate}
                onChange={(e) => setHolidayDate(e.target.value)}
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
                onClick={addHoliday}
              >
                Save Holiday
              </button>
            </div>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-xl text-gray-800 font-bold mb-4">Holiday List</h3>
          <div className="bg-white rounded-lg shadow-lg p-6">
            {holidays.length > 0 ? (
              holidays.map((holiday) => (
                <div
                  key={holiday._id}
                  className="flex flex-wrap justify-between items-center border-b py-4 gap-4"
                >
                  {editableHoliday === holiday._id ? (
                    <div className="flex flex-wrap gap-4 w-full md:w-auto">
                      <input
                        type="text"
                        value={holiday.name}
                        onChange={(e) =>
                          setHolidays(
                            holidays.map((h) =>
                              h._id === holiday._id
                                ? { ...h, name: e.target.value }
                                : h
                            )
                          )
                        }
                        className="w-full md:w-auto px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                      <input
                        type="date"
                        value={holiday.date}
                        onChange={(e) =>
                          setHolidays(
                            holidays.map((h) =>
                              h._id === holiday._id
                                ? { ...h, date: e.target.value }
                                : h
                            )
                          )
                        }
                        className="w-full md:w-auto px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-medium">{holiday.name}</p>
                      <p className="text-base text-gray-500">{holiday.date}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {editableHoliday === holiday._id ? (
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
                        onClick={() =>
                          editHoliday(holiday._id, {
                            name: holiday.name,
                            date: holiday.date,
                          })
                        }
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition"
                        onClick={() => setEditableHoliday(holiday._id)}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
                      onClick={() => deleteHoliday(holiday._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No holidays added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlterHoliday;
