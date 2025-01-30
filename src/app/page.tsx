"use client"
import { useContext ,useState, useEffect, Suspense } from "react";
import { useWallet } from "@/services/walletContext";
import Image from "next/image";
import Link from "next/link";
import RegisterModal from "@/componentes/RegisterModal";
import { useSearchParams } from "next/navigation";
import { doLogin, verifyPercentage } from "@/services/Web3Services";
import { LanguageProvider, useLanguage } from "@/services/languageContext";


function HomeContent() {
  const {isEnglish, toggleLanguageUS, toggleLanguageES} = useLanguage();
  const { address, setAddress } = useWallet();
  const [showModal, setShowModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const searchParams = useSearchParams();
  const [socio, setSocio] = useState<boolean>(false)

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

  useEffect(() => {
    const referral = searchParams.get("ref");
    if (referral) {
      setShowRegisterModal(true); // Abre o modal automaticamente
    }
  }, [searchParams]);


  useEffect(() => {
    if (address) {
      setShowModal(true);
    }
    verifySocio();
  }, [address]);


  const handleLogin = async () => {
    try {
      const newAddress = await doLogin();
      setAddress(newAddress);
    } catch (err) {
      console.error("Login failed", err);
    }
  };
  

  return (
    <>

    <div className="h-[80%] w-[70%] flex flex-col items-center lg:flex-row">
      
      <div className="w-[100%] lg:w-[50%] flex justify-center items-center lg:order-2">        
        <Image
          src="/images/initialCoins.png"
          alt="Coin3d"
          width={720}
          height={600}
          className="lg:ml-0 "
        />
      </div>

      <div className="w-[100%] lg:mt-0 mt-[60px] lg:w-[50%] flex flex-col items-center lg:items-start text-center lg:text-left md:order-1">
        <p className="lg:text-[80px] md:text-[65px] text-[35px] font-bold">DogeAid</p>
        <p className="lg:text-[26px] md:text-[22px] text-[18px]">{isEnglish? "Transforming liquidity in opportunity for all" : "Transformando la liquidez en oportunidad para todos"}</p>
        {address ? (
          <button className="p-2 w-[300px] bg-[#fe4800cf] rounded-3xl mt-[10px] text-black">
            {address.slice(0, 6) + "..." + address.slice(-4)}
          </button>
        ) : (
          <button
            className="p-2 w-[300px] bg-[#fe4a00] rounded-3xl mt-[10px] text-black hover:bg-[#fe4800cf]"
            onClick={handleLogin}
          >
            {isEnglish? "Connect Wallet" : "Conectar billetera"}
          </button>
        )}
    

        <Link
          className="p-2 w-[300px] text-center lg:mb-0 bg-[#fe4a00] rounded-3xl mt-[10px] text-black hover:bg-[#fe4800cf]"
          href="/home"
        >
          {isEnglish? "Entrar" : "Ingressar"}
        </Link>
        {socio?(
          <Link
          className="p-2 w-[300px] text-center lg:mb-0  border-2 border-[#fe4a00] rounded-3xl mt-[10px] text-white hover:bg-[#fe4800cf]"
          href="/claim"
        >
          Claim
        </Link>
        
        ):(
          ""
        )}
             
        
        
        {showModal ? <RegisterModal /> : ""}
      </div>
    
    </div>
    </>
  );
}

export default function Home() {
  return (
    <main className="w-full h-screen flex justify-center items-center">
      <Suspense fallback={<div>Loading...</div>}>
        <HomeContent />
      </Suspense>
    </main>
  );
}
