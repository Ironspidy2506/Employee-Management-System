import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/authContext";

const GetMyMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [replyInputs, setReplyInputs] = useState({});
  const [showReplyBox, setShowReplyBox] = useState({});

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `https://korus-employee-management-system-mern-stack.vercel.app/api/message/get-users-message/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (data.success) {
          setMessages(data.messages);
          const initialReplies = {};
          const initialVisibility = {};
          data.messages.forEach((msg) => {
            initialReplies[msg._id] = msg.reply || "";
            initialVisibility[msg._id] = false;
          });
          setReplyInputs(initialReplies);
          setShowReplyBox(initialVisibility);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch messages");
      }
    };

    fetchMessages();
  }, [user._id]);

  const toggleReplyBox = (id) => {
    setShowReplyBox((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleReplyChange = (id, value) => {
    setReplyInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleReplySave = async (id) => {
    try {
      const reply = replyInputs[id];
      const { data } = await axios.post(
        `https://korus-employee-management-system-mern-stack.vercel.app/api/message/reply-message/${id}`,
        { reply },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setMessages((prev) =>
          prev.map((msg) => (msg._id === id ? { ...msg, reply } : msg))
        );
        setShowReplyBox((prev) => ({ ...prev, [id]: false }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to save reply");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Messages</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <tr>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Employee Name
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Department
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Message
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Reply
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {messages.length > 0 ? (
                messages.map((message) => (
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
                      {!showReplyBox[message._id] ? (
                        <>
                          <div>{message.reply}</div>
                          <button
                            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                            onClick={() => toggleReplyBox(message._id)}
                          >
                            Write Reply
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <textarea
                            rows={2}
                            className="border rounded w-full p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-5 00"
                            value={replyInputs[message._id]}
                            onChange={(e) =>
                              handleReplyChange(message._id, e.target.value)
                            }
                          />
                          <button
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                            onClick={() => handleReplySave(message._id)}
                          >
                            Save Reply
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
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

export default GetMyMessages;
