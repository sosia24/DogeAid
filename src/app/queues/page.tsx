"use client";
import { useEffect, useState, useRef } from 'react';
import { MutableRefObject } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from '@/componentes/footer';
import ModalError from '@/componentes/ModalError';
import ModalSuccess from '@/componentes/ModalSuccess';
import { ethers } from 'ethers';
import { MdCatchingPokemon, MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { 
        getQueue,
        balanceToPaid,
        isApprovedNft,
        getBtc24hPrice,
        claimQueue,
        claimQueueCoin,
        addQueue,
        setApprovalForAll,
        getTokensToWithdraw,
        withdrawTokens,
        approveDoge,
        addQueueCoin,
        getAllowanceDoge,
        getAllowanceEth,
        balanceToPaidDoge,
        getQueueDoge,
        getQueueBitcoin24h,
        balanceToPaidBitcoin24h,
        doClaimQueueBitcoin24h,
        doClaimQueueBtc24h,
        getTokensToWithdrawBtc24h,
        withdrawTokensBtc24h,
        getMuskBalance,
        getValuesDeposit,
        getQueueCoin,
        balanceToPaidBtc,
        approveBtc,
        approveEth,
        getAllowanceBtc,
        balanceToPaidEth,
        getQueueEth,
 } from "@/services/Web3Services";
import { queueData } from '@/services/types';
import { CustomArrowProps } from 'react-slick';
import { useWallet } from '@/services/walletContext';
import withAuthGuard from "@/services/authGuard";
import ModalTokensToWithdraw from '@/componentes/ModalTokenToWithdraw';
import { waitForDebugger } from 'inspector';
import { useLanguage } from '@/services/languageContext';

function Page1() {

    const [visibleSlides, setVisibleSlides] = useState(3); 
    const { address, setAddress } = useWallet();
    const [musk, setMusk] = useState<number>(0);

    /*------------------ GET QUEUE DETAILS ------------*/
    const [queueMuskDetails, setQueueMuskDetails] = useState<queueData[] | null>(null);
    const [queueMuskDetailsFormated, setQueueMuskDetailsFormated] = useState<queueData[] | null>(null);
    const [readyToPaidMusk, setReadyToPaidMusk] = useState<number>(0)

    const [queueDogeDetails, setQueueDogeDetails] = useState<queueData[] | null>(null);
    const [queueDogeDetailsFormated, setQueueDogeDetailsFormated] = useState<queueData[] | null>(null);
    const [readyToPaidDoge, setReadyToPaidDoge] = useState<number>(0)
    const [coinCotation, setCoinCotation] = useState<number>(0);

    const [queueBitcoin24hDetails, setQueueBitcoin24hDetails] = useState<queueData[] | null>(null);
    const [queueBitcoin24hDetailsFormated, setQueueBitcoin24hDetailsFormated] = useState<queueData[] | null>(null);
    const [readyToPaidBitcoin24h, setReadyToPaidBitcoin24h] = useState<number>(0)

    const [queueEthDetails, setQueueEthDetails] = useState<queueData[] | null>(null);
    const [queueEthDetailsFormated, setQueueEthDetailsFormated] = useState<queueData[] | null>(null);
    const [readyToPaidEth, setReadyToPaidEth] = useState<number>(0)

    const [isApproved, setIsApproved] = useState<boolean>(false);
    const [balance, setBalance] = useState<number[]>([0]);

    const [tokensToWithdraw,setTokensToWithdraw] = useState<bigint>(0n)
    const [tokensToWithdrawBtc24h,setTokensToWithdrawBtc24h] = useState<bigint>(0n)

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [alert, setAlert] = useState("");

    const [valuesDeposit, setValuesDeposit] = useState<bigint[] | null>(null)
    const [allowanceCoin, setAllowanceCoin] = useState<bigint[]>([0n,0n,0n])

    const{isEnglish} = useLanguage();



    async function addQueueBtcFront(){
        setLoading(true)
        try{
            const result = await addQueueCoin(2)
            setLoading(false)
            if(isEnglish){
                setAlert("Success");
            }else{
                setAlert("Éxito");
            }
            
            getQueueBitcoin24hDetails();
        }catch(error){
            setLoading(false)
            if(isEnglish){
                setError("Try again")
            }else{
                setError("Intentar otra vez")
            }
            
        }
        setLoading(false)
    }

    async function addQueueEthFront(){
        setLoading(true)
        try{
            const result = await addQueueCoin(3)
            setLoading(false)
            if(isEnglish){
                setAlert("Success");
            }else{
                setAlert("Éxito");
            }
            getQueueEthDetails()
        }catch(error){
            setLoading(false)
            if(isEnglish){
                setError("Try again")
            }else{
                setError("Intentar otra vez")
            }
        }
        setLoading(false)
    }




    async function getAllowanceBtcFront() {
        try {
          if (address) {
            // Obtém o resultado do allowance
            const result = await getAllowanceBtc(address);
      
            // Atualiza o estado de forma imutável
            setAllowanceCoin((prev) => {
              const newAllowanceCoin = [...prev];
              newAllowanceCoin[1] = result;
              return newAllowanceCoin;
            });
          }
        } catch (error) {
        }
      }
      

    
    async function doApproveBtc() {
        setLoading(true)
        try {
          // Verifica se valuesDeposit é um array e possui pelo menos um elemento
          const valueToApprove = valuesDeposit && valuesDeposit.length > 0 
            ? valuesDeposit[1] 
            : 0n;
      
          // Chama a função approveDoge com o valor adequado
          const result = await approveBtc(valueToApprove);
          if(isEnglish){
            setAlert("Success");
        }else{
            setAlert("Éxito");
        }
          setLoading(false)
        } catch (error) {
          if(isEnglish){
            setError("Try again")
        }else{
            setError("Intentar otra vez")
        }
          setLoading(false)
        }
        setLoading(false)
      }


      async function doApproveEth() {
        setLoading(true)
        try {
          // Verifica se valuesDeposit é um array e possui pelo menos um elemento
          const valueToApprove = valuesDeposit && valuesDeposit.length > 0 
            ? valuesDeposit[2] 
            : 0n;
      
          // Chama a função approveDoge com o valor adequado
          const result = await approveEth(valueToApprove);
      
          if(isEnglish){
            setAlert("Success");
        }else{
            setAlert("Éxito");
        }
          setLoading(false)
        } catch (error) {
          if(isEnglish){
            setError("Try again")
        }else{
            setError("Intentar otra vez")
        }
          setLoading(false)
        }
        setLoading(false)
      }

    
    async function getBalanceBtc() {
        try {
            const result = await balanceToPaidBtc();
            const valueFinal = Number(result)  / 1000000
            if (result) {
                setBalance((prevBalance) => {
                    const newBalance = [...prevBalance]; // Cria uma cópia do array atual
                    newBalance[2] = valueFinal; // Atualiza o índice desejado
                    return newBalance; // Retorna o novo array
                });
            }
        } catch (error) {
        }
    }


    async function getBalanceEth() {
        try {
            const result = await balanceToPaidEth();
            const valueFinal = Number(result)  / 1000000
            if (result) {
                setBalance((prevBalance) => {
                    const newBalance = [...prevBalance]; // Cria uma cópia do array atual
                    newBalance[3] = valueFinal; // Atualiza o índice desejado
                    return newBalance; // Retorna o novo array
                });
            }
        } catch (error) {
        }
    }




    async function addQueueDogeFront(){
        setLoading(true)
        try{
            const result = await addQueueCoin(1)
            setLoading(false)
            if(isEnglish){
                setAlert("Success");
            }else{
                setAlert("Éxito");
            }
            getQueueDogeDetails();
        }catch(error){
            
            setLoading(false)
        }
        setLoading(false)
    }


    async function getAllowanceDogeFront() {
        try {
          if (address) {
            // Obtém o resultado do allowance
            const result = await getAllowanceDoge(address);
      
            // Atualiza o estado de forma imutável
            setAllowanceCoin((prev) => {
              const newAllowanceCoin = [...prev];
              newAllowanceCoin[0] = result;
              return newAllowanceCoin;
            });
          }
        } catch (error) {
        }
      }

      async function getAllowanceEthFront() {
        try {
          if (address) {
            // Obtém o resultado do allowance
            const result = await getAllowanceEth(address);
      
            // Atualiza o estado de forma imutável
            setAllowanceCoin((prev) => {
              const newAllowanceCoin = [...prev];
              newAllowanceCoin[2] = result;
              return newAllowanceCoin;
            });
          }
        } catch (error) {
        }
      }
      

    async function doApproveDoge() {
        setLoading(true)
        try {
          // Verifica se valuesDeposit é um array e possui pelo menos um elemento
          const valueToApprove = valuesDeposit && valuesDeposit.length > 0 
            ? valuesDeposit[0] 
            : 0n;
      
          // Chama a função approveDoge com o valor adequado
          const result = await approveDoge(valueToApprove);
          if(isEnglish){
            setAlert("Success");
        }else{
            setAlert("Éxito");
        }
          setLoading(false)
        } catch (error) {
          setLoading(false)
        }
        setLoading(false)
      }
      
    async function getValuesDepositFront(){
        try{
            const result = await getValuesDeposit()
            setValuesDeposit(result);
        }catch(error){

        }
    }


     async function getMusknft(){
          if(address){
            try{
              const result = await getMuskBalance(address);
              setMusk(result)
            }catch(error){
    
            }
          }
        }


    async function getTokensToWithdrawBtc24hFront() {
        try{
            const result = await getTokensToWithdrawBtc24h(address?address:"");
            setTokensToWithdrawBtc24h(result);
        }catch(error){

        }
    }


    async function doClaimQueueBtc24hFront(){
        try{
            setLoading(true)
            const result = await doClaimQueueBtc24h();
            if(result){
                getQueueDogeDetails();
                getBalanceDoge();
                getBalanceBtc()
                getBalanceEth()
                setLoading(false)
                if(isEnglish){
                    setAlert("Success");
                }else{
                    setAlert("Éxito");
                }
            }
        }catch(error){
            setLoading(false)
            if(isEnglish){
                setError("Try again")
            }else{
                setError("Intentar otra vez")
            }
        }
    }

    async function doClaimQueueBitcoin24hFront(){
        try{
            setLoading(true)
            const result = await doClaimQueueBitcoin24h();
            if(result){
                getQueueBitcoin24hDetails();
                getBalanceBitcoin24h();
                setLoading(false)
                if(isEnglish){
                    setAlert("Success");
                }else{
                    setAlert("Éxito");
                }
            }
        }catch(error){
            setLoading(false)
            if(isEnglish){
                setError("Try again")
            }else{
                setError("Intentar otra vez")
            }
        }
    }

    async function getBalanceDoge() {
        try {
            const result = await balanceToPaidDoge();
            const valueFinal = Number(result)  / 1000000
            if (result) {
                setBalance((prevBalance) => {
                    const newBalance = [...prevBalance]; // Cria uma cópia do array atual
                    newBalance[1] = valueFinal; // Atualiza o índice desejado
                    return newBalance; // Retorna o novo array
                });
            }
        } catch (error) {
        }
    }


    async function getBalanceBitcoin24h() {
        try {
            const result = await balanceToPaidBitcoin24h();
            const valueFinal = Number(result) / 1000000
            if (result) {
                setBalance((prevBalance) => {
                    const newBalance = [...prevBalance]; // Cria uma cópia do array atual
                    newBalance[5] = valueFinal; // Atualiza o índice desejado
                    return newBalance; // Retorna o novo array
                });
            }
        } catch (error) {
            console.error("Erro ao obter o balance WBTC:", error);
        }
    }

    async function getQueueDogeDetails() {
        try {
            const result: queueData[] = await getQueueCoin(1); // Supondo que getQueue retorna uma lista
            setQueueDogeDetails(result);
        } catch (error) {
        }
    }

    async function getQueueBitcoin24hDetails() {
        try {
            const result: queueData[] = await getQueueBitcoin24h(); // Supondo que getQueue retorna uma lista
            setQueueBitcoin24hDetails(result);
        } catch (error) {
        }
    }


    async function getQueueEthDetails() {
        try {
            const result: queueData[] = await getQueueEth(); // Supondo que getQueue retorna uma lista
            setQueueEthDetails(result);
        } catch (error) {
        }
    }


    
    function getBlockchainErrorMessage(error: unknown): string {
        if (typeof error === "object" && error !== null) {
            // Verificamos se o erro possui a estrutura esperada
            if ("data" in error && typeof (error as any).data?.message === "string") {
                return (error as any).data.message; // Mensagem de erro específica do contrato
            }
            if ("message" in error && typeof (error as any).message === "string") {
                return (error as any).message; // Mensagem genérica do erro
            }
        }
        return "An unknown error occurred.";
    }
    
    


    async function addQueueFront() {
        
        try {
            setLoading(true);
            await addQueue();
            if(isEnglish){
                setAlert("Added successfully");
            }else{
                setAlert("Agregado exitosamente");
            }
            
            getQueueMuskDetails();
            getMusknft()
            getQueueDogeDetails()
            getQueueBitcoin24hDetails()
            getQueueEthDetails()

        } catch (error: any) {
            
            if (error.message.includes("You don't have this NFT")) {
                if(isEnglish){
                    setError("You don't own this NFT");
                }else{
                    setError("No eres dueño de este NFT");
                }
                
            } else {
                if(isEnglish){
                    setError("Something went wrong, please try again.");
                }else{
                    setError("Algo salió mal, por favor inténtalo de nuevo.");
                }
                
            }
        } finally {
            setLoading(false); 
        }
    }
    
      

    async function doApprove() {
        try{
            setLoading(true);
            const result = await setApprovalForAll(true);
            verifyApprove();
            if(result){
                verifyApprove();
                setLoading(false);
            }
        }catch(error){
            setLoading(false);
        }
    }
    async function doClaimQueue() {
        try {
          setLoading(true);
      
          // Aguarda a confirmação da transação
          const result = await claimQueue();
      
          if (result) {
            if(isEnglish){
                setAlert("Claim Successful");
            }else{
                setAlert("Reclamación exitosa");
            }
            
            getQueueMuskDetails();
            getQueueDogeDetails()
            getQueueBitcoin24hDetails()
            getQueueEthDetails()
          }
        } catch (error) {
            if(isEnglish){
                setError("Claim Failed");
            }else{
                setError("Reclamo fallido");
            }
          
        } finally {
          setLoading(false);
        }
      }
      

      async function doClaimCoinQueue(index:number) {
        try {
          setLoading(true);
      
          // Aguarda a confirmação da transação
          const result = await claimQueueCoin(index);
      
          if (result) {
            if(isEnglish){
                setAlert("Claim Successful");
            }else{
                setAlert("Reclamación exitosa");
            }
            getQueueMuskDetails();
            getQueueDogeDetails()
            getQueueBitcoin24hDetails()
            getQueueEthDetails()
          }
        } catch (error) {
            if(isEnglish){
                setError("Claim Failed");
            }else{
                setError("Reclamo fallido");
            }
        } finally {
          setLoading(false);
        }
      }
      


    async function getCotation() {
        try {
          const result = await getBtc24hPrice();
          if (result) {
            setCoinCotation(Number(result)/Number(1000000));
          }
        } catch (error) {
        }
      }
    
          
    async function getTokensToWithdrawF() {
        try{
            const result = await getTokensToWithdraw(address?address:"");
            setTokensToWithdraw(result);
        }catch(error){

        }
    }


    async function verifyApprove(){
        try{
            if(address){
                const result = await isApprovedNft(address, true);
                if(result){
                setIsApproved(true);
                verifyApprove();
                }
            }
        }catch(error){

        }
    }

    async function getQueueMuskDetails() {
        try {
            const result: queueData[] = await getQueue(); // Supondo que getQueue retorna uma lista
            setQueueMuskDetails(result);
        } catch (error) {
        }
    }



    async function balanceFree() {
        try {
            // Verifica se coinCotation é válido
            if (coinCotation === undefined || coinCotation === null) {
                return;
            }
            const validCoinCotation = Number(coinCotation);
            if (isNaN(validCoinCotation)) {
                throw new Error("coinCotation não é um número válido.");
            }
    
            const results: number[] = [];
   
                const result = await balanceToPaid();
                if (result !== undefined && result !== null) {
                    results.push(Number(result) * validCoinCotation);
                }
            setBalance(results); // Atualiza o estado com os resultados
        } catch (error) {
        }
    }
    
    /*------------------ ^^^^^^^^ END QUEUE DETAILS ^^^^^^^^ ------------*/


    useEffect(() => {
        const updateVisibleSlides = () => {
            const width = window.innerWidth;
            if (width <= 768) {
                setVisibleSlides(1);
            } else if (width <= 1024) {
                setVisibleSlides(2);
            } else {
                setVisibleSlides(3);
            }
        };
        const fetchData = () => {
            getCotation();
            verifyApprove();
            getQueueMuskDetails();
            getQueueDogeDetails()
            getQueueBitcoin24hDetails()
            getQueueEthDetails()
            getTokensToWithdrawF();
            getTokensToWithdrawBtc24hFront()
            getBalanceBitcoin24h()
            getBalanceDoge()
            getBalanceBtc()
            getBalanceEth()
            getMusknft()
            getValuesDepositFront()
            getAllowanceDogeFront()
            getAllowanceBtcFront() 
            getAllowanceEthFront()
            if (coinCotation > 0) {
                balanceFree();
            }
        };
        
        updateVisibleSlides();
        fetchData();
        window.addEventListener('resize', updateVisibleSlides);

        const interval = setInterval(fetchData, 10000);


        return () => {
            window.removeEventListener('resize', updateVisibleSlides);
            clearInterval(interval);
        };
    }, []);

    useEffect(() =>{
        if(queueMuskDetails){
            veSePaga(queueMuskDetails, 0);
        }
        if(queueDogeDetails){
            veSePaga(queueDogeDetails, 1)
        }
        if(queueBitcoin24hDetails){
            veSePaga(queueBitcoin24hDetails, 2)
        }
        if(queueEthDetails){
            veSePaga(queueEthDetails, 3)
        }
    }, [queueMuskDetails, balance[0], balance[1], balance[2]])

    
    useEffect(() => {
        getBalanceBitcoin24h()
        getBalanceDoge()
        getBalanceBtc()
        getBalanceEth()
        if (coinCotation > 0) {
            
            balanceFree();
            getBalanceBitcoin24h()
            getBalanceDoge()
            getBalanceBtc()
            getBalanceEth()
        }
    }, [coinCotation]);
    

    function CustomPrevArrow(props: CustomArrowProps) {
        const { className, style, onClick } = props;
        return (
            <div
                className={`${className} custom-prev-arrow`}
                style={{
                    ...style,
                    display: "block",
                    left: "0", // Ajuste para posicionar à esquerda do slider
                    zIndex: 10,
                }}
                onClick={onClick}
            />
        );
    }
    
    function CustomNextArrow(props: CustomArrowProps) {
        const { className, style, onClick } = props;
        return (
            <div
                className={`${className} custom-next-arrow`}
                style={{
                    ...style,
                    display: "block",
                    right: "0px", // Ajuste para posicionar à direita do slider
                    zIndex: 10,
                }}
                onClick={onClick}
            />
        );
    }

    const goldSliderRef = useRef(null);
    const muskSliderRef = useRef(null)
    const dogeSliderRef = useRef(null);
    const bitcoin24hSliderRef = useRef(null);
    const ethSliderRef = useRef(null);
    
    const settings = {
        infinite: false,
        speed: 200,
        slidesToShow: visibleSlides,
        slidesToScroll: 1,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
        arrows: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    const goToLastSlide = (sliderRef: MutableRefObject<Slider | null>, dataLength: number | undefined) => {
        if (sliderRef.current) {
            const lastIndex = Math.max(dataLength? dataLength : 0 - 1, 0);
            sliderRef.current.slickGoTo(lastIndex);
        }
    };

    const goToFirstSlide = (sliderRef: MutableRefObject<Slider | null>, dataLength: number | undefined) => {
        if (sliderRef.current) {
            sliderRef.current.slickGoTo(0);
        }
    };


    /* -------- VERIFICA SE PAGA A NFT --------------- */

    async function veSePaga(queue: queueData[], index: number) {
        // Valores fixos de pagamento
        const paymentAmounts = [50, 100, 100, 100];
        let count = 0;
        // Use balance[index] como saldo inicial
        let currentBalance = balance[index];
    
        // Cria uma cópia para preservar a ordem original
        const queueCopy: queueData[] = [...queue];
    
        // Índices para controle da ordem (primeiro, último)
        let left = 0;
        let right = queue.length - 1;
        let toggle = true; // Alterna entre os lados da fila
    
        while (currentBalance >= paymentAmounts[index] && left <= right) {
            if (toggle) {
                // Pagar o elemento à esquerda
                if (currentBalance >= paymentAmounts[index]) {
                    queueCopy[left] = {
                        ...queueCopy[left],
                        nextPaied: true,
                    };
                    currentBalance -= paymentAmounts[index];
                    count++;
                }
                left++;
            } else {
                // Pagar o elemento à direita
                if (currentBalance >= paymentAmounts[index]) {
                    queueCopy[right] = {
                        ...queueCopy[right],
                        nextPaied: true,
                    };
                    currentBalance -= paymentAmounts[index];
                }
                count++;
                right--;
            }
            toggle = !toggle; // Alterna o lado para o próximo pagamento
        }
    
    
        // Atualiza o estado correto com base no índice
        if (index === 0) {
            setQueueMuskDetailsFormated(queueCopy);
            setReadyToPaidMusk(count);
        }else if(index === 1){
            setQueueDogeDetailsFormated(queueCopy);
            setReadyToPaidDoge(count);
        }else if(index ===2){
            setQueueBitcoin24hDetailsFormated(queueCopy);
            setReadyToPaidBitcoin24h(count);
        }else{
            setQueueEthDetailsFormated(queueCopy)
            setReadyToPaidEth(count)
        }
    }


    const handleWithdraw = async () => {
        setLoading(true);
        setAlert(""); // Limpa mensagens anteriores
      
        const result = await withdrawTokens();
      
        if (result.success) {
            if(isEnglish){
                setAlert("Sucess");
            }else{
                setAlert("Éxito");
            }
          
        } else {
          setError(result.errorMessage);
        }
      
        setLoading(false);
      };



      const handleWithdrawBtc24h = async () => {
        setLoading(true);
        setAlert(""); // Limpa mensagens anteriores
      
        const result = await withdrawTokensBtc24h();
      
        if (result.success) {
            if(isEnglish){
                setAlert("Sucess");
            }else{
                setAlert("Éxito");
            }
        } else {
          setError(result.errorMessage);
        }
      
        setLoading(false);
      };

      const countUserNftMusk = queueMuskDetailsFormated?.filter(
        (data) => data.user.toLowerCase() === address?.toLowerCase()
      ).length || 0;

      const countUserNftDoge = queueDogeDetailsFormated?.filter(
        (data) => data.user.toLowerCase() === address?.toLowerCase()
      ).length || 0;

      
      const countUserNftBtc = queueBitcoin24hDetailsFormated?.filter(
        (data) => data.user.toLowerCase() === address?.toLowerCase()
      ).length || 0;


      const countUserNftEth = queueEthDetailsFormated?.filter(
        (data) => data.user.toLowerCase() === address?.toLowerCase()
      ).length || 0;

      
      /* -------------- FIM DA VERIFICACAO ------------ */
    
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="w-14 h-14 border-t-4 border-b-4 border-[#fe4a00] rounded-full animate-spin"></div>
                    </div>
                    )}
            <div className="lg:w-[98%] w-[90%] max-w-[1480px] flex flex-col items-center overflow-hidden">
                {/* Header */}
                <div className="lg:w-[70%] w-[90%] h-[130px] flex mt-[60px] justify-center items-center relative text-black">
                    
                    <img
                        alt="banner"
                        srcSet="images/BannerMsg.png 480w,
                                images/BannerMsg.png 768w,
                                images/BannerMsg.png 1200w"
                        sizes="(max-width: 480px) 100vw, 
                                (max-width: 1000px) 70vw, 
                                50vw"
                        className="absolute w-[600px] h-auto"
                    />
                </div>
                <img src='images/claimImage.png' className='w-[400px] mt-[70px]'></img>

                {/* Main Content */}
                <div className="w-[98%] mt-[30px] mb-[100px] flex flex-col items-center space-y-8">


                    {/* ------------------ QUEUE MUSK --------------------- */}
                    <div className="flex mt-[30px] flex-col lg:flex-row w-[90%] max-w-[1400px] items-center justify-between p-10 border-2 border-[#fe4a00] rounded-3xl space-y-4 lg:space-y-0 lg:space-x-4">
                        {/* Image */}
                        <div className="lg:w-[20%] md:w-[50%] w-[30%] flex items-center justify-center">
                            <img
                                src={`images/nft.png`}
                                className="w-full h-auto"
                                alt={`QueueBronze`}
                            />
                        </div>

                        {/* Balance and Action */}
                        <div className="lg:w-[15%] w-[40%] flex flex-col items-center text-center">
                            <p>{isEnglish?"Balance to Paid:":"Saldo a pagar:"}</p>

                           
                                <p className="text-[#fe4a00]">{balance[0]?.toFixed(2) || 0}$</p>
                           
                            {readyToPaidMusk >= 10 && queueMuskDetailsFormated?(
                                <button onClick={() => doClaimQueue()} className="w-[150px] p-2 bg-[#00ff54] rounded-3xl text-black mt-[10px] hover:bg-[#00D837] hover:scale-105 transition-all duration-300">
                                {isEnglish?"Distribute":"Distribuir"}
                                </button>
                            ):(
                                <button className="w-[150px] p-2 cursor-not-allowed bg-gray-400 rounded-3xl text-black mt-[10px] hover:bg-gray-500 hover:scale-105 transition-all duration-300">
                                {isEnglish?"Distribute":"Distribuir"}
                                </button>
                            )}
                            
                            {isApproved?(
                            <button onClick={() => addQueueFront()} className="w-[150px] p-2 bg-[#fe4a00] hover:scale-105 transition-all duration-300 rounded-3xl text-black mt-[10px]">
                                {isEnglish?"Add Nft":"Agregar Nft"}
                            </button>
                            ):(
                            <button onClick={doApprove} className="w-[150px] p-2 bg-[#fe4a00] rounded-3xl hover:scale-105 transition-all duration-300 text-black mt-[10px]">
                                {isEnglish?"Approve":"Aprobar"}
                            </button>
                            )}
                            
                        </div>

                        {/* Carousel */}
                        <div className="lg:w-[60%] p-4 md:max-w-[480px] md:w-[96%] w-[84%] bg-white bg-opacity-10 rounded-3xl relative overflow-hidden">
                            <Slider ref={muskSliderRef} {...settings}>
                            {queueMuskDetailsFormated?.map((data, index) => (
                                    data.nextPaied === true?(
                                        <div
                                        key={index}
                                        className="border-2 border-green-500 p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>{isEnglish?"User:":"Usuario:"} {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>{isEnglish?"Position:":"Posición:"} {index+1}</p>
                                        <p>{isEnglish?"Received:":"Recibió:"} 50$</p>
                                        </div>
                                    ):data.user.toLowerCase() === address?.toLowerCase()?(
                                        <div
                                        key={index}
                                        className="border-2 border-[#fe4a00] p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>{isEnglish?"User:":"Usuario:"}{data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>{isEnglish?"Position:":"Posición:"} {index+1}</p>
                                        <p>{isEnglish?"Received:":"Recibió:"} 50$</p>
                                        </div>
                                    ):(
                                        <div
                                        key={index}
                                        className=" p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>{isEnglish?"User:":"Usuario:"}{data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>{isEnglish?"Position:":"Posición:"} {index+1}</p>
                                        <p>{isEnglish?"Received:":"Recibió:"} 50$</p>
                                        </div>
                                    )
                                    
                                ))}
                            </Slider>
                            <button className='p-[2px] text-[30px]   rounded-md shadow-lg absolute right-20 mt-[10px] '
                            onClick={() => goToFirstSlide(muskSliderRef, queueMuskDetailsFormated?.length)}
                                    >
                                <MdKeyboardDoubleArrowLeft />
                             </button>
                            <button className='p-[2px] text-[30px]  rounded-md shadow-lg absolute right-6 mt-[10px]'
                            onClick={() => goToLastSlide(muskSliderRef, queueMuskDetailsFormated?.length)}
                                    >
                                <MdKeyboardDoubleArrowRight />
                             </button>
                             <div className='p-2 mt-[10px]'>
                             <p >{isEnglish?"You have on queue:":"Tienes en cola:"} {countUserNftMusk}</p>
                             <p >{isEnglish?"You have on wallet: ":"Tienes en tu billetera:"}{musk}</p>
                             </div>
                        </div>
                    </div>

            






                    {/*--------------- DOGE AID QUEUE ----------- */}
                    <div className="flex flex-col lg:flex-row w-[90%] max-w-[1400px] items-center justify-between p-10 border-2 border-[#fe4a00] rounded-3xl space-y-4 lg:space-y-0 lg:space-x-4">
                        {/* Image */}
                        <div className="lg:w-[12%] md:w-[50%] w-[30%] flex items-center justify-center">
                            <img
                                src={`images/D.png`}
                                className="w-full h-auto"
                                alt={`QueueBronze`}
                            />
                        </div>
                        <p className='font-bold bg-[#fe4a00] p-4 text-center rounded-2xl'>DogeAid {isEnglish?"Queue":"Cola"}</p>
                        

                        {/* Balance and Action */}
                        
                        <div className="lg:w-[15%] w-[40%] flex flex-col items-center text-center">
                        <p>{isEnglish?"Balance to Paid:":"Saldo a pagar:"}</p>

                            <p className="text-[#fe4a00]">{(balance[1])  || 0}$</p>
                            <p>{isEnglish?"Preview Value:":"Valor de vista previa:"} </p>
                            <p className="text-[#fe4a00]">
                            {valuesDeposit 
                                ? (Number(valuesDeposit[0]) / 10 ** 18).toFixed(2) // Converte e limita a 6 casas decimais
                                : 0} 
                             DogeAid
                            </p>
                            {readyToPaidDoge >= 10 && queueDogeDetailsFormated?(
                                <button onClick={() => doClaimCoinQueue(1)} className="w-[150px] p-2 bg-[#00ff54] rounded-3xl text-black mt-[10px] hover:bg-[#00D837] hover:scale-105 transition-all duration-300">
                                {isEnglish?"Distribute":"Distribuir"}
                                </button>
                            ):(
                                <button className="w-[150px] p-2 cursor-not-allowed bg-gray-400 rounded-3xl text-black mt-[10px] hover:bg-gray-500 hover:scale-105 transition-all duration-300">
                                {isEnglish?"Distribute":"Distribuir"}
                                </button>
                            )}
                            

                            {valuesDeposit && allowanceCoin[0] > (valuesDeposit[0] || 0n)?(
                            <button onClick={()=>addQueueDogeFront()} className="w-[150px] p-2 bg-[#fe4a00] rounded-3xl text-black mt-[10px]  hover:scale-105 transition-all duration-300">
                                {isEnglish?"Add Nft":"Agregar Nft"}
                            </button>
                            ):(
                            <button onClick={()=>doApproveDoge()} className="w-[150px] p-2 bg-[#fe4a00] rounded-3xl text-black mt-[10px] hover:scale-105 transition-all duration-300">
                                {isEnglish?"Approve":"Aprobar"}
                            </button>
                            )}
                        </div>

                        {/* Carousel */}
                        <div className="lg:w-[60%] p-4 md:max-w-[480px] md:w-[96%] w-[84%] bg-white bg-opacity-10 rounded-3xl relative overflow-hidden">
                            <Slider ref={dogeSliderRef} {...settings}>
                                {queueDogeDetailsFormated?.map((data, index) => (
                                    data.nextPaied === true?(
                                        <div
                                        key={index}
                                        className="border-2 border-green-500 p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>{isEnglish?"User:":"Usuario:"} {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>{isEnglish?"Position:":"Posición:"} {index+1}</p>
                                        <p>{isEnglish?"Received:":"Recibió:"} 100$</p>
                                        </div>
                                    ):data.user.toLowerCase() === address?.toLowerCase()?(
                                        <div
                                        key={index}
                                        className="border-2 border-[#fe4a00] p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>{isEnglish?"User:":"Usuario:"} {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>{isEnglish?"Position:":"Posición:"} {index+1}</p>
                                        <p>{isEnglish?"Received:":"Recibió:"} 100$</p>
                                        </div>
                                    ):(
                                        <div
                                        key={index}
                                        className=" p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>{isEnglish?"User:":"Usuario:"} {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>{isEnglish?"Position:":"Posición:"} {index+1}</p>
                                        <p>{isEnglish?"Received:":"Recibió:"} 100$</p>
                                        </div>
                                    )
                                    
                                ))}
                            </Slider>
                            <button className='p-[2px] text-[30px]   rounded-md shadow-lg absolute right-20 mt-[10px] '
                            onClick={() => goToFirstSlide(dogeSliderRef, queueDogeDetailsFormated?.length)}
                                    >
                                <MdKeyboardDoubleArrowLeft />
                             </button>
                            <button className='p-[2px] text-[30px]  rounded-md shadow-lg absolute right-6 mt-[10px]'
                            onClick={() => goToLastSlide(dogeSliderRef, queueDogeDetailsFormated?.length)}
                                    >
                                <MdKeyboardDoubleArrowRight />
                             </button>
                             <div className='p-2 mt-[10px]'>
                             <p >{isEnglish?"You have on queue:":"Tienes en cola:"}  {countUserNftDoge}</p>
                             </div>
                              </div>

                    </div>









                    {/* ---------------------------- QUEUE BTCAID ---------------------- */}
                    <div className="flex flex-col lg:flex-row w-[90%] max-w-[1400px] items-center justify-between p-10 border-2 border-yellow-600 rounded-3xl space-y-4 lg:space-y-0 lg:space-x-4">
                        {/* Image */}
                        <div className="lg:w-[25%] md:w-[50%] w-[30%] flex items-center justify-center">
                            <img
                                src={`images/btcaid.png`}
                                className="w-full h-auto"
                                alt={`QueueBronze`}
                            />
                        </div>
                        <p className='font-bold bg-yellow-600 p-4 text-center rounded-2xl'>BtcAid {isEnglish?"Queue":"Cola"}</p>

                        {/* Balance and Action */}
                        
                        <div className="lg:w-[15%] w-[40%] flex flex-col items-center text-center">
                        <p>{isEnglish?"Balance to Paid:":"Saldo a pagar:"}</p>
                            <p className="text-yellow-600">{ Number(balance[2])  || 0}$</p>
                            <p>{isEnglish?"Preview Value:":"Valor de vista previa:"} </p>
                            <p className="text-yellow-600">
                            {valuesDeposit 
                                ? (Number(valuesDeposit[1]) / 10 ** 18).toFixed(2) // Converte e limita a 6 casas decimais
                                : 0} 
                             BtcAid
                            </p>

                            {readyToPaidBitcoin24h >= 10 && queueBitcoin24hDetailsFormated?(
                                <button onClick={() => doClaimCoinQueue(2)} className="w-[150px] p-2 bg-[#00ff54] rounded-3xl text-black mt-[10px] hover:bg-[#00D837] hover:scale-105 transition-all duration-300">
                                {isEnglish?"Distribute":"Distribuir"}
                                </button>
                            ):(
                                <button className="w-[150px] p-2 cursor-not-allowed bg-gray-400 rounded-3xl text-black mt-[10px] hover:bg-gray-500 hover:scale-105 transition-all duration-300">
                                {isEnglish?"Distribute":"Distribuir"}
                                </button>
                            )}
                            
                            {valuesDeposit && allowanceCoin[1] > (valuesDeposit[1] || 0n)?(
                            <button onClick={()=>addQueueBtcFront()} className="w-[150px] p-2 bg-yellow-600 rounded-3xl text-black mt-[10px]  hover:scale-105 transition-all duration-300">
                                {isEnglish?"Add Nft":"Agregar Nft"}
                            </button>
                            ):(
                            <button onClick={()=>doApproveBtc()}  className="w-[150px] p-2 bg-yellow-600 rounded-3xl text-black mt-[10px] hover:scale-105 transition-all duration-300">
                                {isEnglish?"Approve":"Aprobar"}
                            </button>
                            )}
                        </div>

                        {/* Carousel */}
                        <div className="lg:w-[60%] p-4 md:max-w-[480px] md:w-[96%] w-[84%] bg-white bg-opacity-10 rounded-3xl relative overflow-hidden">
                            <Slider ref={bitcoin24hSliderRef} {...settings}>
                                {queueBitcoin24hDetailsFormated?.map((data, index) => (
                                    data.nextPaied === true?(
                                        <div
                                        key={index}
                                        className="border-2 border-green-500 p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>{isEnglish?"User:":"Usuario:"} {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>{isEnglish?"Position:":"Posición:"} {index+1}</p>
                                        <p>{isEnglish?"Received:":"Recibió:"} 100$</p>
                                        </div>
                                    ):data.user.toLowerCase() === address?.toLowerCase()?(
                                        <div
                                        key={index}
                                        className="border-2 border-yellow-600 p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>{isEnglish?"User:":"Usuario:"} {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>{isEnglish?"Position:":"Posición:"} {index+1}</p>
                                        <p>{isEnglish?"Received:":"Recibió:"} 100$</p>
                                        </div>
                                    ):(
                                        <div
                                        key={index}
                                        className=" p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>{isEnglish?"User:":"Usuario:"} {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>{isEnglish?"Position:":"Posición:"} {index+1}</p>
                                        <p>{isEnglish?"Received:":"Recibió:"} 100$</p>
                                        </div>
                                    )
                                    
                                ))}
                            </Slider>
                            <button className='p-[2px] text-[30px]   rounded-md shadow-lg absolute right-20 mt-[10px] '
                            onClick={() => goToFirstSlide(bitcoin24hSliderRef, queueBitcoin24hDetailsFormated?.length)}
                                    >
                                <MdKeyboardDoubleArrowLeft />
                             </button>
                            <button className='p-[2px] text-[30px]  rounded-md shadow-lg absolute right-6 mt-[10px]'
                            onClick={() => goToLastSlide(bitcoin24hSliderRef, queueBitcoin24hDetailsFormated?.length)}
                                    >
                                <MdKeyboardDoubleArrowRight />
                             </button>
                             <div className='p-2 mt-[10px]'>
                             <p >{isEnglish?"You have on queue:":"Tienes en cola:"}  {countUserNftBtc}</p>
                             </div>
                             </div>
                    </div>



















                    {/*--------------- QUEUE ETHAID  ----------- */}
                    <div className="flex flex-col lg:flex-row w-[90%] max-w-[1400px] items-center justify-between p-10 border-2 border-blue-600 bg-opacity-10 rounded-3xl space-y-4 lg:space-y-0 lg:space-x-4">
                        {/* Image */}
                        <div className="lg:w-[25%] md:w-[50%] w-[30%] flex items-center justify-center">
                            <img
                                src={`images/ethaid.png`}
                                className="w-full h-auto"
                                alt={`QueueBronze`}
                            />
                        </div>
                        <p className='font-bold bg-blue-600 p-4 text-center rounded-2xl'>EthAid {isEnglish?"Queue":"Cola"}</p>

                        {/* Balance and Action */}
                        
                        <div className="lg:w-[15%] w-[40%] flex flex-col items-center text-center">
                        <p>{isEnglish?"Balance to Paid:":"Saldo a pagar:"}</p>
                            <p className="text-blue-600">{ Number(balance[3])  || 0}$</p>
                            <p>{isEnglish?"Preview Value:":"Valor de vista previa:"} </p>
                            <p className="text-blue-600">
                            {valuesDeposit 
                                ? (Number(valuesDeposit[2]) / 10 ** 18).toFixed(2) // Converte e limita a 6 casas decimais
                                : 0} 
                             EthAid
                            </p>
                            

                            {readyToPaidEth >= 10 && queueEthDetailsFormated?(
                                <button onClick={() => doClaimCoinQueue(3)} className="w-[150px] p-2 bg-[#00ff54] rounded-3xl text-black mt-[10px] hover:bg-[#00D837] hover:scale-105 transition-all duration-300">
                                {isEnglish?"Distribute":"Distribuir"}
                                </button>
                            ):(
                                <button className="w-[150px] p-2 cursor-not-allowed bg-gray-400 rounded-3xl text-black mt-[10px] hover:bg-gray-500 hover:scale-105 transition-all duration-300">
                               {isEnglish?"Distribute":"Distribuir"}
                                </button>
                            )}
                            
                            {valuesDeposit && allowanceCoin[2] > (valuesDeposit[2] || 0n)?(
                            <button  onClick={()=>addQueueEthFront()}  className="w-[150px] p-2 bg-blue-600 rounded-3xl text-black mt-[10px]  hover:scale-105 transition-all duration-300">
                                 {isEnglish?"Add Nft":"Agregar Nft"}
                            </button>
                            ):(
                            <button onClick={()=>doApproveEth()}  className="w-[150px] p-2 bg-blue-600 rounded-3xl text-black mt-[10px] hover:scale-105 transition-all duration-300">
                                {isEnglish?"Approve":"Aprobar"}
                            </button>
                            )}
                        </div>

                        {/* Carousel */}
                        <div className="lg:w-[60%] p-4 md:max-w-[480px] md:w-[96%] w-[84%] bg-white bg-opacity-10 rounded-3xl relative overflow-hidden">
                            <Slider ref={ethSliderRef} {...settings}>
                                {queueEthDetailsFormated?.map((data, index) => (
                                    data.nextPaied === true?(
                                        <div
                                        key={index}
                                        className="border-2 border-green-500 p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>{isEnglish?"User:":"Usuario:"} {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>{isEnglish?"Position:":"Posición:"} {index+1}</p>
                                        <p>{isEnglish?"Received:":"Recibió:"} 100$</p>
                                        </div>
                                    ):data.user.toLowerCase() === address?.toLowerCase()?(
                                        <div
                                        key={index}
                                        className="border-2 border-blue-600 p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>{isEnglish?"User:":"Usuario:"} {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>{isEnglish?"Position:":"Posición:"} {index+1}</p>
                                        <p>{isEnglish?"Received:":"Recibió:"} 100$</p>
                                        </div>
                                    ):(
                                        <div
                                        key={index}
                                        className=" p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>{isEnglish?"User:":"Usuario:"} {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>{isEnglish?"Position:":"Posición:"} {index+1}</p>
                                        <p>{isEnglish?"Received:":"Recibió:"} 100$</p>
                                        </div>
                                    )
                                    
                                ))}
                            </Slider>
                            <button className='p-[2px] text-[30px]   rounded-md shadow-lg absolute right-20 mt-[10px] '
                            onClick={() => goToFirstSlide(ethSliderRef, queueEthDetailsFormated?.length)}
                                    >
                                <MdKeyboardDoubleArrowLeft />
                             </button>
                            <button className='p-[2px] text-[30px]  rounded-md shadow-lg absolute right-6 mt-[10px]'
                            onClick={() => goToLastSlide(ethSliderRef, queueEthDetailsFormated?.length)}
                                    >
                                <MdKeyboardDoubleArrowRight />
                             </button>
                             <div className='p-2 mt-[10px]'>
                             <p >{isEnglish?"You have on queue:":"Tienes en cola:"}  {countUserNftEth}</p>
                             </div>                    
                             </div>
                    </div>




















                    <div className='w-[90%] sm:w-[70%]  border-2 border-[#f60d53de] flex items-center sm:p-6 p-8 rounded-2xl flex-col'>
                        <p className='text-3xl sm:text-xl font-bold'>{isEnglish?"You have to withdraw:":"Debes retirar:"} </p>
                        {tokensToWithdraw > 0?(
                            <>                       <p className='font-bold text-3xl mt-[5px]'>{tokensToWithdraw?  parseFloat(ethers.formatEther(tokensToWithdraw)).toFixed(2) : ' 0'} DogeAid</p>
                                                    <p>{isEnglish?"When your nft's generate rewards, you can see them here":"Cuando tus NFT generen recompensas, podrás verlas aquí"}</p>

                                                        <button onClick={handleWithdraw} className='text-black  font-bold text-[22px] mt-[15px] mb-[20px] p-4 w-[200px] rounded-2xl bg-[#00ff54] hover:w-[210px] duration-100'>{isEnglish?"Claim":"Reclamar"}</button>

</>
                        ):tokensToWithdrawBtc24h > 0?(
                            <>
                                                       <p className='font-bold text-3xl mt-[5px]'>{tokensToWithdrawBtc24h?  parseFloat(ethers.formatUnits(tokensToWithdrawBtc24h,6)).toFixed(2) : ' 0'} USDT</p>
                                                       <p>{isEnglish?"When your nft's generate rewards, you can see them here":"Cuando tus NFT generen recompensas, podrás verlas aquí"}</p>

                                                        <button onClick={handleWithdrawBtc24h} className='text-black  font-bold text-[22px] mt-[15px] mb-[20px] p-4 w-[200px] rounded-2xl bg-[#00ff54] hover:w-[210px] duration-100'>{isEnglish?"Claim":"Reclamar"}</button>

                            </>
                        ):(
                            <button className='text-black cursor-not-allowed bg-gray-400 font-bold text-[22px] mt-[15px] mb-[20px] p-4 w-[200px] rounded-2xl'>{isEnglish?"Claim":"Reclamar"}</button>   
                        )}
                        
                    </div>
                </div>
            
            </div>
            {
                tokensToWithdraw>0?             <ModalTokensToWithdraw tokens={tokensToWithdraw} isBtc24h={false}></ModalTokensToWithdraw>:""
            }
            {
                tokensToWithdrawBtc24h>0?             <ModalTokensToWithdraw tokens={tokensToWithdrawBtc24h} isBtc24h={true}></ModalTokensToWithdraw>:""
            }
            <Footer />
        </>
    );
}

export default withAuthGuard(Page1);
