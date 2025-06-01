import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/authContext";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const GetAllMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const handleDownloadExcel = () => {
    const exportData = filteredMessages.map((msg) => ({
      "Employee ID": msg.employeeId?.employeeId || "",
      "Employee Name": msg.employeeId?.name || "",
      Department: msg.department?.departmentName || "",
      Message: msg.message || "",
      Reply: msg.reply || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Messages");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "messages.xlsx");
  };


  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          "https://korus-employee-management-system-mern-stack.vercel.app/api/message/get-all-messages",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (data.success) {
          setMessages(data.messages);
          setFilteredMessages(data.messages);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch messages");
      }
    };

    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `https://korus-employee-management-system-mern-stack.vercel.app/api/message/delete-message/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        const updated = messages.filter((message) => message._id !== id);
        setMessages(updated);
        setFilteredMessages(updated.filter(filterMessages(searchTerm)));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();

    const records = messages.filter(
      (msg) =>
        msg.employeeId?.employeeId
          ?.toString()
          .toLowerCase()
          .includes(searchValue) ||
        msg.employeeId?.name?.toLowerCase().includes(searchValue)
    );

    setFilteredMessages(records);
  };

  const filterMessages = (value) => (message) => {
    const lowerValue = value.toLowerCase();

    const empId = message.employeeId?.employeeId?.toLowerCase() || "";
    const empName = message.employeeId?.name?.toLowerCase() || "";

    return empId.includes(lowerValue) || empName.includes(lowerValue);
  };

  const handleEdit = (id) => {
    navigate(`/${user.role}-dashboard/messages/edit-message/${id}`);
  };

  return (
    <>
      <ToastContainer />
      <div className="mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
          <div className="flex gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              onClick={handleDownloadExcel}
            >
              Download Excel
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() =>
                navigate(`/${user.role}-dashboard/messages/add-message`)
              }
            >
              <FaPlus /> Send Message
            </button>
          </div>
        </div>


        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Employee ID or Name"
            onChange={handleSearch}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <tr>
                <th className="px-6 py-3 text-center text-sm font-semibold tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold tracking-wider">
                  Employee Name
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold tracking-wider">
                  Reply
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((message) => (
                  <tr key={message._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-center text-gray-800 font-medium">
                      {message.employeeId?.employeeId}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-800 font-medium">
                      {message.employeeId?.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">
                      {message.department?.departmentName}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">
                      {message.message}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">
                      {message.reply}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
                          onClick={() => handleEdit(message._id)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                          onClick={() => handleDelete(message._id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center px-6 py-4 text-gray-500"
                  >
                    No messages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default GetAllMessages;
