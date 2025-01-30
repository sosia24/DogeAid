'use client'; // Adicione esta linha no topo do arquivo para indicar que é um Client Component

import { claimPaymentManager, doLogin } from '@/services/Web3Services';
import { useContext, useState, useEffect } from 'react';
import { useWallet } from "@/services/walletContext";
import { verifyPercentage, verifyBalance } from '@/services/Web3Services';
import Footer from '@/componentes/footer';
import ModalError from "@/componentes/ModalError";
import ModalSuccess from "@/componentes/ModalSuccess";
import { LanguageProvider, useLanguage } from "@/services/languageContext";

function Page1() {
const {isEnglish} = useLanguage()
const { address, setAddress } = useWallet();
const [socio, setSocio] = useState<boolean>(false);
const [balances, setBalances] = useState<number[]>([])
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [alert, setAlert] = useState("");

async function clearError(){
    setError("");
}

async function clearAlert(){
    setAlert("");
}




async function verifyValues(){
    try{
        if (address) {
            const result = await verifyBalance(address);
            
            // Extraindo apenas o valor do índice 2
            const extractedValues = result.map((item: any) => item[2]);
            // Salvando o valor no estado
            setBalances(extractedValues);
            
          }
    }catch(error){

    }
}

  async function verifySocio(){
    try{
      if(address){
        const result = await verifyPercentage(address)
        if(result > 0 && result != undefined && result != null){
          setSocio(true)
        }
      }
    }catch(error){
    }
  }

  async function doClaim() {
    setLoading(true);
  
    try {
      const result = await claimPaymentManager();
  
      if (result.success) {
        if(isEnglish){
          setAlert("Claim successful");  
        }else{
          setAlert("Reclamo exitoso");
        }
        
        verifyValues();
      } else {
      }
    } catch (error) {
      if(isEnglish){
        setError("An unexpected error occurred. Try again.");
      }else{
        setError("Ocurrió un error inesperado. Inténtalo nuevamente.");
      }
      
    } finally {
      setLoading(false);
    }
  }
  

  async function handleLogin(){
    try{
        const result = await doLogin();
        if(result){
            setAddress(result)
        }
    }catch(error){

    }
  }

    useEffect(() => {
      verifySocio();
      verifyValues();
    }, [address]);

  return (
    <>
    {socio?(
        <>
                {error && <ModalError msg={error} onClose={clearError} />}
                    {alert && <ModalSuccess msg={alert} onClose={clearAlert} />}
                    {loading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="w-14 h-14 border-t-4 border-b-4 border-[#00ff54] rounded-full animate-spin"></div>
                    </div>
                    )}
              <div className="w-[96%] p-4 flex justify-center items-center flex-col ">
              <img className="mt-24 md:w-[320px]" src="images/PaymentManager.png" alt="banner" />
              <div className="p-20 md:p-4 bg-[#14330b8d] flex mt-32 rounded-3xl text-center w-full flex-row md:flex-col">
                {/* Wallet Section */}
                <div className="border-r-2 md:border-b-2 md:border-r-0 px-6 md:px-2 w-1/2 md:w-[100%]">
                  <h1 className="text-5xl md:text-3xl text-[#FFC200]">{isEnglish? "Wallet" : "Billetera"}</h1>
                  <h1 style={{ letterSpacing: '4px' }} className="mt-4 text-5xl md:text-3xl">
                    {address?.slice(0,6)}...{address?.slice(-4)}
                  </h1>
                  <div className="mt-12 items-center flex flex-col text-black font-semibold">
                  </div>
                </div>
      
                {/* Balance Section */}
                <div className="px-10 md:px-2 md:mt-[20px] text-center w-1/2 md:w-[100%]">
                  <h1 className="text-5xl md:text-3xl">Balance:</h1>
                  <div className="text-[#00FF3D] text-4xl md:text-[22px] py-10 flex flex-col justify-between">
                    {/* Exibindo valores com verificações */}
                    <h1 className="mt-2">
                        {balances[0] !== undefined && balances[0] !== null
                        ? (Number(balances[0]) / 10 ** 6).toFixed(4)
                        : "Loading..."} USDT
                    </h1>
                    <h1 className="mt-2">
                        {balances[1] !== undefined && balances[1] !== null
                        ? (Number(balances[1]) / 10 ** 18).toFixed(2)
                        : "Loading..."} DOGEAID
                    </h1>
                    </div>
                  <button
                  onClick={doClaim}
                    className="py-4 rounded-3xl w-2/3 text-black bg-[#00FF3D] hover:bg-[#00cc32] transition duration-300 scale-100 hover:scale-105 mt-6 font-semibold text-2xl"
                  >
                    Claim
                  </button>
                </div>
              </div>
            </div>
            <Footer></Footer>
            </>
    ):(
        <>
        <div className="flex flex-col justify-center items-center h-screen">
            <h2>404</h2>
            <h1>Page not found</h1>
            <button
            onClick={handleLogin}
            className="bg-[#00FF3D] text-black mt-[30px] w-[200px] hover:bg-[#00cc32] transition duration-300 scale-100 hover:scale-105 py-4 rounded-3xl text-2xl"
            >
            Connect Wallet
            </button>
        </div>
        <Footer></Footer>
        </>

    )}

    </>
  );
}

export default Page1;