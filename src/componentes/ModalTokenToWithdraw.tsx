'use client'
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { withdrawTokens,
        withdrawTokensBtc24h,
 } from "@/services/Web3Services";
import ModalSuccess from "@/componentes/ModalSuccess";
import ModalError from "@/componentes/ModalError";
interface TokensProps {
    tokens: bigint;
    isBtc24h: boolean
}

export default function ModalTokensToWithdraw({ tokens, isBtc24h }: TokensProps) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState("");

  useEffect(() => {
    setShow(true);
  }, []);

  const handleClose = () => {
    setShow(false);
  };



  const handleWithdrawBtc24h = async () => {
    try {
      setLoading(true);
  
      const result = await withdrawTokensBtc24h();
  
      if (result.success) {
        setAlert("Tokens successfully withdrawn!");
      } else {
      }
  
      setLoading(false);
      handleClose();
    } catch (error) {
      setLoading(false);
      console.error("Error withdrawing tokens:", error);
      setAlert("Failed to withdraw tokens. Please try again.");
    }
  };

  const handleWithdraw = async () => {
    try {
      setLoading(true);
      
      const result = await withdrawTokens();
  
      if (result.success) {
        setAlert("Tokens successfully withdrawn!");
      } else {
      }
  
      setLoading(false);
      handleClose();
    } catch (error) {
      setLoading(false);
      console.error("Error withdrawing tokens:", error);
      setAlert("Failed to withdraw tokens. Please try again.");
    }
  };
  
  async function clearError(){
    setError("");
}

async function clearAlert(){
    setAlert("");
}

  return (
    <>
     {error && <ModalError msg={error} onClose={clearError} />}
                  {alert && <ModalSuccess msg={alert} onClose={clearAlert} />}
            {loading && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-14 h-14 border-t-4 border-b-4 border-[#fe4a00] rounded-full animate-spin"></div>
            </div>
            )}
      {show?(
        <div
        className={`fixed inset-0 z-30 flex items-center justify-center transition-opacity duration-300 ${
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
          className={`relative w-[500px] sm:w-[300px] flex flex-col justify-center text-center p-4 text-black bg-[#ffe5db] rounded-bl-[30px] h-[300px] rounded-br-[15px] shadow-lg transform transition-transform duration-300 ${
            show ? "scale-100" : "scale-90"
          }`}
        >
          <img
            className="absolute max-w-none w-[110%] -top-16 -left-7 sm:-top-10 sm:-left-4"
            src="images/BannerTopo.png"
            alt="Congratulation banner"
          />
          <h1 className="w-full text-xl sm:text-lg mt-5">While you were away, your NFTs cycled, and now you have tokens ready to claim!</h1>
          <h1 className="mt-4 text-2xl">
            {isBtc24h?(
              <>
              <p>U$               {(Number(tokens)/1000000).toString()}
              </p>
              </>
            ):
            (
              <>
              <p>               {parseFloat(ethers.formatEther(tokens)).toFixed(2)} 
              DogeAid</p>
              </>
            )}
         
            </h1>        
            <div className="flex justify-between px-10 sm:w-full sm:justify-center sm:text-center sm:items-center  sm:text-sm">
            <button
              onClick={isBtc24h? handleWithdrawBtc24h : handleWithdraw}
              className="rounded-3xl bottom-10 sm:w-1/2 sm:b-0 mt-[20px] text-center py-4 px-16 sm:px-3 bg-[#f60d53de] hover:bg-[#f60d53] transition-colors duration-300"
            >
              Claim
            </button>
            <button
              onClick={handleClose}
              className="rounded-3xl bottom-10 sm:w-1/2 sm:bottom-0 mt-[20px] text-center py-4 px-16 sm:px-3 sm:ml-4 bg-white hover:bg-gray-100 border-2 border-red-600 transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      ):(
        ""
      )}
    
    </>
  );
}
