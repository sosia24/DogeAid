'use client' // Adicione esta linha no topo do arquivo para indicar que é um Client Component

import { useState, useEffect } from "react";
import { useWallet } from "@/services/walletContext";
import Image from "next/image";
import { formatUsdt } from "@/services/utils";
import withAuthGuard from "@/services/authGuard";
import Footer from "@/componentes/footer";
import Link from "next/link";
import { PiTriangleFill } from "react-icons/pi";
import { FaCopy, FaCheck } from "react-icons/fa";
import { UserDonation } from "@/services/types";
import { getTreeUsers ,getBtc24hPrice,getTransactionsReceived,getTotalEarnedPerLevel,addTokenToMetaMask } from "@/services/Web3Services"; // Import getUser
import RegisterModal from "@/componentes/RegisterModal";
import { useLanguage } from "@/services/languageContext";
import { FaCircleCheck } from "react-icons/fa6";

import { ethers } from "ethers";
import ReferralTree from "@/componentes/referralNode";
import Countdown from "@/componentes/countdown";


function Page1() {
  const{isEnglish} = useLanguage()
  const [coinCotation, setCoinCotation] = useState<number | null>(null);
  const { address, setAddress } = useWallet();
  const [transactions, setTransactions] = useState([]);
  const [totalEarnedPerLevel, setTotalEarnedPerLevel] = useState<bigint[]>([]);



 
  

  useEffect(() => {
    if (!address) return;

    const fetchData = async () => {
      try {
        getCotation();
        const txs : any = await getTransactionsReceived(address);
        setTransactions(txs.reverse());        
        const totalEarnedTree =  await getTotalEarnedPerLevel(address);
        
        setTotalEarnedPerLevel(totalEarnedTree) 
      } catch (error) {
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [address]);

  async function getCotation() {
    try {

        const result = await getBtc24hPrice();
        if (result) {
          setCoinCotation(0.00009)
            /* 
              setCoinCotation(Number(again) / Number(1000000));
            */
        }else{
          const again = await getBtc24hPrice();
            if(again){
              setCoinCotation(0.00009)
              /* 
              setCoinCotation(Number(again) / Number(1000000));
              */
            }
        }
    } catch (error) {
    }
  }



  const [copied, setCopied] = useState(false);
  const handleCopyReferral = async () => {
    try {
      if (address) {
        const referralLink = `${window.location.origin}?ref=${address}`;
        await navigator.clipboard.writeText(referralLink); 
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }
    } catch (err) {
    }
  };


  return (
    <>
    <div className="w-[96%] bg-white bg-opacity-10 p-8 text-center rounded-3xl mb-[30px]">
      <div className="p-4 bg-white bg-opacity-5">
        {isEnglish?(
          <p className="font-bold text-2xl">Current Halving </p>
        ):(
          <p className="font-bold text-2xl">Actual Halving </p>
        )}
      <p className="p-4 text-3xl font-bold">2 </p>
      <span className="text-[16px]">(0.00009$)</span>
    </div>

    {isEnglish?(
      <p className="mt-[15px]">Next Halving In</p>
      
    ):(
      <p className="mt-[15px]">Seguiente Halving En</p>
    )}
    <p className="mt-[20px] text-lg"></p>
    <Countdown targetDate="2025-04-15T23:59:59Z" />


    </div>

      <div className="p-4 w-full  flex justify-center items-center overflow-hidden">

        <div className="lg:w-[90%]  w-[100%]  flex flex-col ">

        <div className=" px-2 w-full flex flex-col  items-center overflow-x-hidden overflow-y-hidden">
        <div className="flex text-black md:flex-col w-full justify-center items-center">
          
        <div className="w-[90%] md:w-full flex justify-center items-center relative text-black">

      <img
        src="./images/BannerTopo.png"
        className="block sm:hidden w-full h-[120px] object-cover"
        alt="Banner Topo"
      />

      <img
        src="./images/annerTopoMobile.png"
        className=" sm:block hidden w-full h-[120px] object-cover p-4"
        alt="Banner Topo Mobile" 
      />
        <p className="text-white absolute left-10 font-bold text-[25px] sm:text-[16px]">{isEnglish?"Network":"Red"}</p>
          </div>
        </div>
      </div>


          <div className="w-[100%] lg:h-[380px] h-[500px] mt-[50px] flex lg:flex-row flex-col justify-center">
            <div className="lg:w-[45%] w-[100%] h-[100%]  rounded-2xl p-10 flex justify-center flex-col  bg-[url('/images/BannerInfos.png')] bg-cover bg-center">
              <div className="">
                <div className="w-100% flex flex-row">
                  <Image
                    src={"/images/logo.png"}
                    alt="logo"
                    width={35}
                    height={35}
                  />
                  <p className="ml-[5px] font-bold text-[22px]">DogeAid/USDT</p>
                  
                </div>
                <p className="text-[20px]">
            {coinCotation
    ? `$${coinCotation.toFixed(8).toLocaleString()}`
    : "...loading"}
</p>



                <div className="h-[50px]  mt-[30px]  mb-[-20px]">
                  <button

                    onClick={()=>addTokenToMetaMask()
                    }
                    className="w-[200px] hover:bg-[#fe4a00] hover:scale-105 transition-all duration-300 bg-[#fe4a00] flex justify-center items-center text-black font-bold text-center rounded-3xl p-2"
                  >
                    <PiTriangleFill className="mr-2 rotate-90" />
                    {isEnglish?"Add MetaMask":"Agregar MetaMask"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-[50px] w-[100%] flex items-center justify-center flex-col">
          <button
              onClick={handleCopyReferral}
              className="font-bold mb-[20px] hover:bg-[#f60d53de] hover:scale-105 transition-all duration-300 text-[20px] p-2 w-[200px] flex justify-center items-center text-black rounded-3xl bg-[#f60d51] mt-[20px]"
            >
              {copied ? <FaCheck className="mr-2" /> : <FaCopy className="mr-2" />}
              {copied ? "Copied!" : "Referral"}
            </button>
            {address?(
                <ReferralTree address={address}  />
            ):(
              ""
            )}

       <div className="w-[90%] max-w-5xl h-auto overflow-auto p-6 bg-[#2c2c2c] rounded-lg shadow-xl mt-8 flex flex-col lg:flex-row gap-8">
  {/* Últimas Transações Recebidas */}
  <div className="w-full h-[300px] overflow-auto lg:w-2/3 bg-[#1f1f1f] p-4 rounded-lg shadow-md">
    <h1 className="text-center text-2xl font-semibold text-white mb-6">
      {isEnglish?"Last Transactions Received":"Últimas transacciones recibidas"}
    </h1>
    {transactions && transactions.length > 0 ? (
      transactions.map((tx: any, index) => (
        <Link
          key={index}
          href={`https://polygonscan.com/tx/${tx.transactionHash}`}
          className="block bg-[#333] hover:bg-[#f60d53] transition-colors duration-300 rounded-lg p-4 mb-4 shadow-md"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <FaCircleCheck className="text-4xl text-green-500" />
              <div className="text-white">
                <p className="font-medium">{isEnglish?"Receipt Transaction:" : "Transacción de recibo"}</p>
                <p className="text-green-400 text-sm">{isEnglish?"Confirmed":"Confirmada"}</p>
              </div>
            </div>
            <div className="text-[#ccc] text-lg font-medium">
              <p>{`${parseFloat(tx.value).toFixed(2)} USDT`}</p>
            </div>
          </div>
        </Link>
      ))
    ) : (
      <p className="text-center text-gray-400">{isEnglish?"No transactions found.":"No se encontraron transacciones."}</p>
    )}
  </div>

  {/* Total Earned Per Level */}
  <div className="w-full lg:w-1/3 h-[300px] overflow-auto bg-[#1f1f1f] p-4 rounded-lg shadow-md">
    <h1 className="text-center text-2xl font-semibold text-white mb-6">
      {isEnglish?"Total Earned Per Level":"Total ganado por nivel"}
    </h1>
    <div className="w-full p-4 mb-4 bg-[#F60E51] text-white font-semibold text-lg rounded-lg shadow-md flex justify-between">
      <p>{isEnglish?"Total Earned:":"Total ganado:"}</p>
      <p>
        {ethers.formatUnits(
          totalEarnedPerLevel.reduce((acc, value) => acc + value, 0n),
          6
        )}{" "}
        USDT
      </p>
    </div>
    {totalEarnedPerLevel && totalEarnedPerLevel.length > 0 ? (
      totalEarnedPerLevel.map((earned: BigInt, index: number) => (
        <div
          key={index}
          className="w-full p-4 mb-2 bg-[#F60E51] text-white rounded-lg shadow-md flex justify-between items-center"
        >
          <p className="font-medium">Level {index + 1}</p>
          <p>
            {ethers.formatUnits(String(earned), 6)} USDT
          </p>
        </div>
      ))
    ) : (
      <p className="text-center text-gray-400">{isEnglish?"No earnings data available":"No hay datos de ganancias disponibles"}.</p>
    )}



            </div>



          </div>



          </div>
          

          
        </div>
        
      </div>


      <RegisterModal></RegisterModal>
      <Footer />
    </>
  );
}

export default withAuthGuard(Page1);
