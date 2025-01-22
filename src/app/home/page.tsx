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
import Marquee from "@/componentes/marquee";
import { getTreeUsers ,getBtc24hPrice,getTransactionsReceived } from "@/services/Web3Services"; // Import getUser
import RegisterModal from "@/componentes/RegisterModal";
import { FaCircleCheck } from "react-icons/fa6";

import { ethers } from "ethers";
import ReferralTree from "@/componentes/referralNode";


function Page1() {
  const [coinCotation, setCoinCotation] = useState<number | null>(null);
  const { address, setAddress } = useWallet();
  const [treeUsers, setTreeUsers] = useState<string[]>([]);
  const [user, setUser] = useState<UserDonation| null>(null);
  const [transactions, setTransactions] = useState([]);



 
  

  async function fetchTreeUsers(address: string) {
    try {
      const result = await getTreeUsers(address);

  
      // Supondo que os endereços estejam na segunda posição (índice 1), acesse os valores corretamente
      const addresses = result;  // Ajuste isso conforme a estrutura correta de 'result'

  
      // Filtre endereços válidos, verificando se são do tipo string e não nulos
      const filteredAddresses = addresses.filter(
        (addr: unknown): addr is string => typeof addr === "string" && addr !== "0x0000000000000000000000000000000000000000"
      );
  

  
      // Atualize o estado ou faça o que for necessário com os endereços filtrados
      setTreeUsers(filteredAddresses); // Use os endereços filtrados no estado
    } catch (error) {
      console.error("Error fetching tree users:", error);
    }
  }
  

  useEffect(() => {
    if (!address) return;

    const fetchData = async () => {
      try {
        await fetchTreeUsers(address);
        getCotation();
        const txs : any = await getTransactionsReceived(address);
        setTransactions(txs);        
      } catch (error) {
        console.error("Error fetching user data:", error);
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
          setCoinCotation(Number(result) / Number(1000000));
        }else{
          const again = await getBtc24hPrice();
            if(again){
              setCoinCotation(Number(again) / Number(1000000));
            }
        }
    } catch (error) {
      console.error("Failed to fetch coin price", error);
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
      console.error("Failed to copy referral link", err);
    }
  };


  return (
    <>
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
        <p className="text-white absolute left-10 font-bold text-[25px] sm:text-[16px]">Network</p>
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
                ? `$${coinCotation.toFixed(2).toLocaleString()}`
                : "...loading"}
                </p>
                {
                  user && user.balance > 0n ? <>
                  <p className="text-[20px] mt-8">
                  {user
                    ? `${parseFloat(ethers.formatEther(user.maxUnilevel)).toFixed(2)} BTC24H Max Limit`
                    : "...loading"}
                </p>

              <p className="text-[20px] mt-3">
                {user
                  ? `${parseFloat(ethers.formatEther(user.unilevelReached)).toFixed(2)} BTC24H Reached`
                  : "...loading"}
              </p></> : ""
              }


                <div className="h-[50px]  mt-[30px]  mb-[-20px]">
                  <Link
                    href="/donation"
                    className="w-[200px] hover:bg-[#fe4a00] hover:scale-105 transition-all duration-300 bg-[#fe4a00] flex justify-center items-center text-black font-bold text-center rounded-3xl p-2"
                  >
                    <PiTriangleFill className="mr-2 rotate-90" />
                    Contribute Now
                  </Link>
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
          <div className="w-[80%] p-[20px] bg-[#441212] rounded mt-6" >
            <h1 className="text-center text-2xl">Last Transactions Received</h1>
            {transactions.map((tx:any, index) => (
              
                <Link key={index} href={`https://polygonscan.com/tx/${tx.transactionHash}`} className="!my-10 hover:!bg-[#f60d53de] transition duration-200">
                  <div className="justify-between flex items-center flex-row">
                    <div>
                      <div className="flex items-center gap-4">
                        <FaCircleCheck className="text-4xl"></FaCircleCheck>
                        <div className="text-xl">
                          <p>Receipt Transaction</p>
                          <p className="text-green-500">Confirmed</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-[#ccc] text-2xl">
                      <p>{`${parseFloat(tx.value).toFixed(2)} USDT`}</p>
                    </div>
                  </div>
                </Link>
              ))}

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
