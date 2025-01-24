"use client";

import { useRegistered } from "@/services/RegistrationContext";
import { useWallet } from "@/services/walletContext";
import { isRegistered, registerUser } from "@/services/Web3Services";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ModalError from "./ModalError";
import ModalSuccess from "./ModalSuccess";

export default function RegisterModal() {
  const searchParams = useSearchParams();
  const referralAddressFromUrl = searchParams.get("ref"); // Captura o parâmetro "ref" da URL
  const { address: walletAddress } = useWallet();
  const { setIsRegisteredV } = useRegistered();

  const [isOpen, setIsOpen] = useState(false); // Controle de abertura do modal
  const [isRegisteredUser, setIsRegisteredUser] = useState(false); // Verifica se o usuário já está registrado
  const [referralAddress, setReferralAddress] = useState(""); // Endereço de referência
  const [loading, setLoading] = useState(false); // Indicador de carregamento
  const [error, setError] = useState(""); // Controle de erros
  const [alert, setAlert] = useState(""); // Controle de alertas

  // Verifica se o usuário já está registrado ao carregar o modal
  useEffect(() => {
    if (walletAddress) {
      isRegistered(walletAddress).then((result) => {
        setIsRegisteredUser(result);
        if (result) {
          setIsOpen(false); // Fecha o modal se o usuário já estiver registrado
        }else{
          setIsOpen(true);
        }
      });
    }
  }, [walletAddress]);

  // Preenche o campo com o endereço de referência da URL, se existir
  useEffect(() => {
    if (referralAddressFromUrl) {
      setReferralAddress(referralAddressFromUrl);
    }
  }, [referralAddressFromUrl]);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleRegisterSponsor = async () => {
    if (!referralAddress.trim()) {
      setError("Please enter a referral address!");
      return;
    }

    setLoading(true);
    try {
      await registerUser(referralAddress);
      setAlert("Sponsor registered successfully!");
      setIsRegisteredV(true); // Atualiza o contexto global
      setIsOpen(false); // Fecha o modal após o registro
    } catch (err) {
      console.error("Error registering sponsor:", err);
      setError("Failed to register sponsor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Limpa os estados de erro e alerta
  const clearError = () => setError("");
  const clearAlert = () => setAlert("");

  if (!walletAddress || !isOpen || isRegisteredUser) {
    return null; // Não renderiza o modal se o usuário já estiver registrado ou o modal estiver fechado
  }

  return (
    <>
      {/* Modal de Erro */}
      {error && <ModalError msg={error} onClose={clearError} />}
      
      {/* Modal de Sucesso */}
      {alert && <ModalSuccess msg={alert} onClose={clearAlert} />}
      
      {/* Indicador de Carregamento */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-14 h-14 border-t-4 border-b-4 border-[#00ff54] rounded-full animate-spin"></div>
        </div>
      )}

      {/* Modal Principal */}
      <div className="fixed inset-0 flex items-center justify-center z-10">
        {/* Background Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-60"
          onClick={closeModal}
        ></div>

        {/* Conteúdo do Modal */}
        <div className="relative bg-white rounded-lg shadow-lg w-[90%] max-w-md">
          {/* Header */}
          <div className="relative">
            <img
              className="absolute left-1/2 max-w-[2000%] top-1/2 transform -translate-x-1/2 -translate-y-1/2 !w-[110%]"
              src="images/BannerMsg.png"
              alt="Banner"
            />
            <h2 className="absolute text-2xl font-bold text-black -bottom-3 left-4">
              Register
            </h2>
          </div>

          {/* Content */}
          <div className="p-6 text-center text-gray-800 mt-[60px]">
            <p>Referral</p>
            <input
              type="text"
              className="w-full px-4 text-sm py-2 border !border-gray-500 rounded-md focus:outline-none focus:ring focus:ring-[#f60d53de]"
              placeholder="Referral Address"
              value={referralAddress}
              onChange={(e) => setReferralAddress(e.target.value)}
            />
          </div>

          {/* Footer */}
          <div className="p-4">
            <button
              className="w-full bg-[#f60d53de] text-black py-2 px-4 rounded-lg hover:bg-[#f60d53b0] transition"
              onClick={handleRegisterSponsor}
            >
              Register Sponsor
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
