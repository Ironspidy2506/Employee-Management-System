import React from "react";

const SummaryCard = ({ icon, text, number }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300">
      <div className="bg-blue-100 p-4 rounded-full text-blue-500 text-xl">
        {icon}
      </div>
      <div className="text-gray-700">
        <p className="text-sm font-medium text-gray-500">{text}</p>
        <p className="text-2xl font-bold">{number}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
