
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import { WalletProvider } from "@/services/walletContext";
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";
import { RegisterProvider } from "@/services/RegistrationContext";
import { useState } from "react";
import { Analytics } from "@vercel/analytics/react"
import { LanguageProvider } from "@/services/languageContext";
import Language from "@/componentes/language";

const montserrat = Montserrat({
  subsets: ['latin'], // Inclui os caracteres necessários
  weight: ['400', '700'], // Escolha os pesos que você precisa
});

export const metadata: Metadata = {
  title: "DogeAid",
  description: "Transforming liquidity in opportunity for all",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <html lang="en" className={montserrat.className}>
      <head>
      <link rel="icon" type="image/png" href="images/D.png" />
      </head>
      <body className="bg-black flex justify-center items-center relative overflow-x-hidden">
        {/* Background Layer */}
        <div
  className="absolute w-full h-full z-0 bg-opacity-20"
  style={{
    backgroundImage: "url('/images/BG1.png')",
    backgroundSize: "cover", // Cobre toda a área sem distorção
    backgroundRepeat: "no-repeat", // Não repete a imagem
    backgroundPosition: "center", // Centraliza a imagem
    backgroundAttachment: "fixed", // Mantém a imagem fixa enquanto o conteúdo rola
    backgroundBlendMode: "overlay",
  }}
></div>

       <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        {/* Gradient on Top */}


        {/* Main Content */}

        <WalletProvider>
        <LanguageProvider>

          <RegisterProvider>
            
          <main
            style={{ width: "1600px", zIndex: 1 }}
            className={montserrat.className}
          >
            
                <Analytics></Analytics>


                
            <div className="w-full h-full flex items-center flex-col pb-[160px]">
              
            <div className="w-[80%] rounded-3xl  text-black mt-[100px]  text-[16px]">

            
            {/*------------ AVISOSS AQUI --------- */}

            </div>

            <div className="mr-0"><Language></Language></div>
              {children}
              <div className="w-[100%] flex justify-center flex-row">
               
              </div>
            </div>
          </main>

          </RegisterProvider>

          </LanguageProvider>
        </WalletProvider>

      </body>
    </html>
  );
}