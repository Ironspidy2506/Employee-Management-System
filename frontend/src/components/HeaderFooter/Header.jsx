import React from "react";
import KorusImage from "./../../assets/Korus.png";

const Header = () => {
  return (
    <div className="flex flex-col items-center space-y-4 mb-4">
      <img src={KorusImage} alt="Company Logo" className="w-20 h-20" />
      <h1 className="text-2xl md:text-4xl font-bold text-center">
        Korus Engineering Solutions Pvt. Ltd.
      </h1>
      <h4 className="text-center text-gray-700 text-sm md:text-base leading-relaxed">
        <span className="block">
          912, Pearls Best Heights-II, 9th Floor, Plot No. C-9, Netaji Subhash
          Place, Pitampura, Delhi - 110034
        </span>
      </h4>
    </div>
  );
};

export default Header;
