"use client"
import { createContext, useContext, useState, ReactNode } from "react";

// Definição do tipo do contexto
type LanguageContextType = {
  isEnglish: boolean;
  toggleLanguageUS: () => void;
  toggleLanguageES: () => void;
};

// Criando o contexto
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provedor do contexto
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [isEnglish, setIsEnglish] = useState(true);

  const toggleLanguageUS = () => {
    setIsEnglish(true);
  };

  
  const toggleLanguageES = () => {
    setIsEnglish(false);
  };
  
  return (
    <LanguageContext.Provider value={{ isEnglish, toggleLanguageUS, toggleLanguageES }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personalizado para acessar o contexto
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage deve ser usado dentro de um LanguageProvider");
  }
  return context;
};
