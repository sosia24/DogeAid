"use client"
import Image from "next/image";
import Footer from "@/componentes/footer";
import withAuthGuard from "@/services/authGuard";
import { useWallet } from "@/services/walletContext";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import ModalSuccess from "@/componentes/ModalSuccess";
import ModalError from "@/componentes/ModalError";
import { useRegistered } from "@/services/RegistrationContext";
import { useLanguage } from "@/services/languageContext";

import {
    approveUSDT,
    getAllowanceUsdt,
    buyNft,
    isApprovedNft,
    setApprovalForAll,
    
    getMuskBalance,
    getTreeUsers,increaseGas,
    approveUSDTUser,
    getAllowanceUsdtGas
}from "@/services/Web3Services";

function Page1(){
    const { address, setAddress } = useWallet();
    const [error, setError] = useState("");
    const [alert, setAlert] = useState("");
    const [allowanceUsdt, setAllowanceUsdt] = useState<bigint>(0n);
    const [allowanceUsdtGas, setAllowanceUsdtGas] = useState<bigint>(0n);
    const {isEnglish} = useLanguage();
    const [musk, setMusk] = useState<number>(0)
    const [timeUntil, setTimeUntil] = useState<bigint[]>([0n,0n,0n,0n]);
    const [quantity, setQuantity] = useState<number>(1);
    const [gas, setGas] = useState<number>(0);
    const [gasAmount, setGasAmount] = useState<number>(0);

    const [approvalWbtcUnilevel, setApprovalWbtcUnilevel] = useState<boolean>()

    const [isApprovedNftV, setIsApprovedNftV] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const { requireRegistration } = useRegistered();



    async function getMusknft(){
      if(address){
        try{
          const result = await getMuskBalance(address);
          setMusk(result)
        }catch(error){

        }
      }
    }
    async function getGas(){
      if(address){
        try{
          const result = await getTreeUsers(address);
          setGas(result.gas)
        }catch(error){

        }
      }
    }

    async function doApproveUsdt(value: Number){
        setLoading(true);
        try{
            const result = await approveUSDT(value);
            if(result){
                getAllowanceUsdtFront();
                setLoading(false)
            }
        }catch(error){
            setLoading(false)
        }
    }
    async function doApproveUsdtUser(value: Number){
      setLoading(true);
      try{
          const result = await approveUSDTUser(value);
          if(result){
              getAllowanceUsdtFrontGas();
              setLoading(false)
          }
      }catch(error){
          setLoading(false)
      }
  }





    async function doApproveCollection(){

        setLoading(true);
        try{
            const result = await setApprovalForAll(false);
            if(result){
                getIsApprovedNft()
                setLoading(false)
                setAlert("Success");
                await fetch()
            }
        }catch(error){
            setLoading(false)
            if(isEnglish){
              setError("Something went wrong, try again");
            }else{
              setError("Algo salió mal, inténtalo de nuevo");
            }
            
        }
    }

    async function getIsApprovedNft() {
        if (address) {
            try {
                const status = await isApprovedNft(address, false)
                
                setIsApprovedNftV(status);
            } catch (error) {
              if(isEnglish){
                console.error("Error fetching NFT approve status:", error);
              }else{
                console.error("Error al obtener el estado de aprobación de NFT:", error);
              }
                
            }
        }
    }
    

    async function getAllowanceUsdtFront(){
        try{
            if(address){
                    const result = await getAllowanceUsdt(address);
  
                    
                    setAllowanceUsdt(result); 
                }
        }catch(error){

        }
    }
    async function getAllowanceUsdtFrontGas(){
      try{
          if(address){
                  const result = await getAllowanceUsdtGas(address);

                  
                  setAllowanceUsdtGas(result); 
              }
      }catch(error){

      }
  }


    async function buyNftFront() {
      await requireRegistration(() => {});

      setLoading(true);
      try {
        const result = await buyNft(quantity); // Executa a compra
    
        if (result && result.status === 1) { // status 1 significa sucesso
          if(isEnglish){
            setAlert("NFT purchased successfully");
          }else{
            setAlert("NFT comprado con éxito");
          }
          
    
          // Aguarde a atualização do allowance após a compra
          await getAllowanceUsdtFront(); 
    
          // Atualiza outras informações
          await getIsApprovedNft();
          await fetch(); // Atualiza os dados gerais
        } else {
          throw new Error("Transaction failed unexpectedly");
        }
      } catch (error) {
        if(isEnglish){
          setError("Something went wrong, try again");
        }else{
          setError("Algo salió mal, inténtalo de nuevo");
        }
        
      } finally {
        setLoading(false);
      }
    }
    
    async function buyGas(amount : number) {
      await requireRegistration(() => {});

      setLoading(true);
      try {
        const result = await increaseGas(amount); // Executa a compra
    
        if (result && result.status === 1) { // status 1 significa sucesso
          if(isEnglish){
            setAlert("Gas purchased successfully");
          }else{
            setAlert("Gas comprado con éxito");
          }
    
          // Aguarde a atualização do allowance após a compra
          await getAllowanceUsdtFront(); 
    
          await fetch(); // Atualiza os dados gerais
        } else {
          throw new Error("Transaction failed unexpectedly");
        }
      } catch (error) {

        if(isEnglish){
          setError("Something went wrong, try again");
        }else{
          setError("Algo salió mal, inténtalo de nuevo");
        }
      } finally {
        setLoading(false);
      }
    }
    

    
      

    /* ---------- INICIA JUNTO COM A PAGINA --------- */
    const fetch = async () =>{
        getAllowanceUsdtFront();
        getIsApprovedNft();
        getMusknft()
        getGas()
        getAllowanceUsdtFrontGas()
    }
    
    useEffect(() => {
        fetch()
    }, [address]);
    async function clearError(){
        setError("");
    }
    
    async function clearAlert(){
        setAlert("");
    }

    return(
        <>
              {error && <ModalError msg={error} onClose={clearError} />}
              {alert && <ModalSuccess msg={alert} onClose={clearAlert} />}
        {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-14 h-14 border-t-4 border-b-4 border-[#fe4a00] rounded-full animate-spin"></div>
        </div>
        )}
        <div className="lg:w-[60%]  lg:py-0 py-5 px-8  w-[100%] mt-[60px] flex items-center justify-center  flex-col ">
        <div className="relative w-[98%] h-[250px] flex items-center justify-center">
            <img
            className="w-full h-full object-contain"
            alt="NFT Sale Banner"
            src="images/bunner_nftSale.png"
            />
        </div>
        <div className="lg:w-[100%] w-full sm:p-2 p-6 pb-12 mx-4 mt-[30px] rounded-3xl flex lg:flex-row flex-col items-center justify-center">
  {/* Silver */}
  <div className="w-full flex-col">
  <div className="lg:w-[100%] w-full h-auto flex flex-col items-center justify-center lg:items-start lg:flex-row lg:mt-0 mt-[30px]">
      <Image alt="prata" src={"/images/nft.png"} width={350} height={350} className="mx-auto lg:mx-0"></Image>
    <div className="bg-[#fe4a00] flex flex-col items-center justify-center bg-opacity-20 w-[90%] lg:w-[330px] mt-[20px] h-auto text-white p-4 ml-[20px] rounded-xl z-0">
      <div className=" text-center font-semibold text-[18px]">
        <p className="">Nft MUSK</p>
      </div>
      <div className="w-full text-white flex flex-col  items-center justify-center text-center">
        <div className="w-[80%]  rounded-2xl bg-opacity-10 flex flex-col items-center justify-center p-2">
          <div className="flex flex-row items-center justify-center">
            <p>$</p>
            <p className="font-bold text-[4vh] lg:text-[45px]">{String(25*quantity)}</p>
          </div>
          <p className="flex bottom-0 mt-[-10px] text-center lg:text-right">
           {isEnglish? "Win" : "Ganar"} <span className="text-[#f60d53de] ml-[5px]"> 2x</span>
          </p>
        </div>
        <div className="flex flex-col text-center">
          <p>{isEnglish?"Quantity":"Cantidad"}</p>
        <div className="flex items-center">
        <button
  className="bg-gray-200 px-2 py-1 rounded-l-md text-black hover:bg-gray-300"
  onClick={() => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1)); // Impede que vá abaixo de 0
  }}
>
    -
  </button>
  <input
    type="number"
    value={quantity}
    className="border rounded-md w-[100px] p-2 text-center text-black focus:outline-none"
    onChange={(e) => {
      const newValue = parseInt(e.target.value, 10); // Obtém o valor do input
      setQuantity(newValue);
    }}
  />
  <button
    className="bg-gray-200 px-2 py-1 rounded-r-md text-black hover:bg-gray-300"
    onClick={() => {
      setQuantity((prev) => prev+1);
    }}
  >
    +
  </button>
</div>

        </div>


        {allowanceUsdt >= 25000000 * quantity ? (
          <button
            onClick={async () => {
              buyNftFront();
            }}
            className="text-black rounded-tl-full w-[130px] mt-[15px] rounded-br-full py-[5px] bg-[#00ff54]"
          >
            {isEnglish?"Buy NFT":"Comprar Nft"}
          </button>
        ) : (
          <button
            onClick={async () => {
              doApproveUsdt(25000000*quantity);
            }}
            className="text-black rounded-tl-full w-[130px] mt-[15px] rounded-br-full py-[5px] bg-[#f60d53de]"
          >
           {isEnglish?"Approve":"Aprobar"}
          </button>
        )}
        <p className="w-full text-center mt-[3px]">
          {isEnglish?"You have:":"Tienes:"} {musk}
        </p>
      </div>
    </div>
  </div>
  <p className="text-center mt-[100px] bg-[#fe4a00] p-2 font-bold text-[20px] rounded-2xl shadow-2xl">{isEnglish?"You need to buy gas to get earnings through unilevel":"Necesitas comprar gas para obtener ganancias a través de unilevel"}</p>
  <div className="lg:w-[100%] mt-[30px] w-full h-auto flex flex-col items-center justify-center lg:items-start lg:flex-row ">
    
  <div className="bg-white shadow-lg flex flex-col items-center justify-center w-[90%] lg:w-[330px] mt-8 h-auto text-gray-800 p-6 rounded-xl ml-5">
  <h2 className="text-2xl font-bold text-[#fe4a00] mb-2">{isEnglish?"Buy Gas":"Comprar gas"}</h2>
  <p className="text-gray-600 text-center mb-4">
    {isEnglish?"Your Gas Available:":"Su gas disponible:"}{" "}
    <span className="text-[#f60d53] font-semibold">
      {ethers.formatUnits(String(gas), 6)} USDT
    </span>
  </p>
  <input
    type="number"
    className="w-full mt-4 p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#fe4a00]"
    placeholder="Enter amount of gas to buy"
    value={gasAmount}
    onChange={(e) => setGasAmount(Number(e.target.value))}
  />
  {allowanceUsdtGas >= BigInt(gasAmount * 1000000) ? (
    <button
      onClick={async () => {
        await buyGas(gasAmount);
      }}
      className="w-full mt-6 py-3 bg-[#00ff54] text-white rounded-lg font-semibold hover:bg-[#00d94a] transition-all duration-300"
    >
      {isEnglish?"Buy Gas":"Comprar gas"}
    </button>
  ) : (
    <button
      onClick={async () => {
        await doApproveUsdtUser(gasAmount * 1000000);
      }}
      className="w-full mt-6 py-3 bg-[#f60d53] text-white rounded-lg font-semibold hover:bg-[#d1464a] transition-all duration-300"
    >
                {isEnglish?"Approve":"Aprobar"}
    </button>
  )}

    </div>
  </div>
  </div>



 


</div>

        <Footer></Footer>
        </div>
        </>
    )
}
export default withAuthGuard(Page1);