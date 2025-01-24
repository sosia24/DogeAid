'use client'
import { useState, useEffect } from "react";

interface ErrorProps {
  msg: string;
  onClose: () => void;
}

export default function ModalSuccess({ onClose, msg }: ErrorProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 300); 
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300 ${
          show ? "opacity-100" : "opacity-0"
        }`}
      ></div>

      {/* Modal */}
      <div
        className={`relative w-[500px] sm:w-[300px] flex flex-col justify-center text-center p-4 text-black bg-white border-4 border-green-600  rounded-bl-[30px] h-[300px] rounded-br-[15px] shadow-lg transform transition-transform duration-300 ${
          show ? "scale-100" : "scale-90"
        }`}
      >
        <img
          className="absolute max-w-none w-[110%] -top-16 -left-7  sm:-top-10 sm:-left-4"
          src="images/BannerMsg.png"
          alt="Success banner"
        />
        <h1 className="w-full text-2xl mt-14">Success: {msg}</h1>
        <button
          onClick={handleClose}
          className="rounded-3xl  bottom-10 mt-[20px] py-6 px-16 bg-green-500 hover:bg-green-600 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}
