'use client'
import { useState, useEffect } from "react";

interface ErrorProps {
  msg: string;
  onClose: () => void;
}

export default function ModalError({ onClose, msg }: ErrorProps) {
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
      className={`fixed inset-0 z-50 flex   items-center justify-center transition-opacity duration-300 ${
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
        className={`relative w-[500px] border-4 border-red-600 sm:w-[300px] flex flex-col justify-center text-center p-4 text-black bg-white rounded-bl-[30px] h-[300px] rounded-br-[15px] shadow-lg transform transition-transform duration-300 ${
          show ? "scale-100" : "scale-90"
        }`}
      >
        <img
          className="absolute max-w-none w-[110%] -top-16 sm:-top-10 sm:-left-4 -left-7"
          src="images/BannerMsg.png"
          alt="Error banner"
        />
        <h1 className="w-full text-2xl mt-14">Ooops: {msg}</h1>
        <button
          onClick={handleClose}
          className="rounded-3xl mt-[20px]  bottom-10  py-6 px-16 bg-red-500 hover:bg-red-600 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}
