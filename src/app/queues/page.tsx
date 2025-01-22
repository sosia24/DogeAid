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
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { 
        getQueue,
        balanceToPaid,
        isApprovedNft,
        getBtc24hPrice,
        claimQueue,
        addQueue,
        setApprovalForAll,
        getTokensToWithdraw,
        withdrawTokens,
        approveBtc24h,
        addQueueBtc24h,
        getQueueBtc24h,
        getQueueBitcoin24h,
        balanceToPaidBtc24h,
        balanceToPaidBitcoin24h,
        doClaimQueueBitcoin24h,
        doClaimQueueBtc24h,
        getTokensToWithdrawBtc24h,
        withdrawTokensBtc24h,
 } from "@/services/Web3Services";
import { queueData } from '@/services/types';
import { CustomArrowProps } from 'react-slick';
import { useWallet } from '@/services/walletContext';
import withAuthGuard from "@/services/authGuard";
import ModalTokensToWithdraw from '@/componentes/ModalTokenToWithdraw';

function Page1() {

    const [visibleSlides, setVisibleSlides] = useState(3); 
    const { address, setAddress } = useWallet();
    const [bronze, setBronze] = useState<number>(0);
    const [silver, setSilver] = useState<number>(0);
    const [gold, setGold] = useState<number>(0);

    /*------------------ GET QUEUE DETAILS ------------*/

    const [queueBronzeDetails, setQueueBronzeDetails] = useState<queueData[] | null>(null);
    const [queueBronzeDetailsFormated, setQueueBronzeDetailsFormated] = useState<queueData[] | null>(null);
    const [readyToPaidBronze, setReadyToPaidBronze] = useState<number>(0)
    const [queueSilverDetails, setQueueSilverDetails] = useState<queueData[] | null>(null);
    const [queueSilverDetailsFormated, setQueueSilverDetailsFormated] = useState<queueData[] | null>(null);
    const [readyToPaidSilver, setReadyToPaidSilver] = useState<number>(0)
    const [queueGoldDetails, setQueueGoldDetails] = useState<queueData[] | null>(null);
    const [queueGoldDetailsFormated, setQueueGoldDetailsFormated] = useState<queueData[] | null>(null);
    const [readyToPaidGold, setReadyToPaidGold] = useState<number>(0)
    const [isApproved, setIsApproved] = useState<boolean>(false);
    const [balance, setBalance] = useState<number[]>([0]);
    const [coinCotation, setCoinCotation] = useState<number>(0);
    const [tokensToWithdraw,setTokensToWithdraw] = useState<bigint>(0n)
    const [tokensToWithdrawWbtc,setTokensToWithdrawWbtc] = useState<bigint>(0n)
    const [tokensToWithdrawBtc24h,setTokensToWithdrawBtc24h] = useState<bigint>(0n)
    const [approveWbtc, setApproveWbtc] = useState<boolean>(false)
    const [balanceQueueWbtc, setBalanceQueueWbtc] = useState<number>(0)
    const [queueWbtcDetails, setQueueWbtcDetails] = useState<queueData[] | null>(null)
    const [wbtcCotation, setWbtcCotation] = useState<number>(0)
    const [queueWbtcDetailsFormated, setQueueWbtcDetailsFormated] = useState<queueData[] | null>(null);
    const [readyToPaidWbtc, setReadyToPaidWbtc] = useState<number>(0)
    const [wbtc, setWbtc] = useState<number>(0)

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [alert, setAlert] = useState("");

    const [valuesDeposit, setValuesDeposit] = useState<bigint[] | null>(null)
    const [allowanceBtc24h, setAllowanceBtc24h] = useState<bigint[]>([0n,0n])
    const [queueBtc24hDetails, setQueueBtc24hDetails] = useState<queueData[] | null>(null);
    const [queueBtc24hDetailsFormated, setQueueBtc24hDetailsFormated] = useState<queueData[] | null>(null);
    const [queueBitcoin24hDetails, setQueueBitcoin24hDetails] = useState<queueData[] | null>(null);
    const [queueBitcoin24hDetailsFormated, setQueueBitcoin24hDetailsFormated] = useState<queueData[] | null>(null);
    const [readyToPaidBtc24h, setReadyToPaidBtc24h] = useState<number>(0)
    const [readyToPaidBitcoin24h, setReadyToPaidBitcoin24h] = useState<number>(0)


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
                getQueueBtc24hDetails();
                getBalanceBtc24h();
                setLoading(false)
                setAlert("Success")
            }
        }catch(error){
            setLoading(false)
            setError("Error")
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
                setAlert("Success")
            }
        }catch(error){
            setLoading(false)
            setError("Error")
        }
    }

    async function getBalanceBtc24h() {
        try {
            const result = await balanceToPaidBtc24h();
            const valueFinal = Number(result)  / 1000000
            if (result) {
                setBalance((prevBalance) => {
                    const newBalance = [...prevBalance]; // Cria uma cópia do array atual
                    newBalance[4] = valueFinal; // Atualiza o índice desejado
                    return newBalance; // Retorna o novo array
                });
            }
        } catch (error) {
            console.error("Erro ao obter o balance WBTC:", error);
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

    async function getQueueBtc24hDetails() {
        try {
            const result: queueData[] = await getQueueBtc24h(); // Supondo que getQueue retorna uma lista
            setQueueBtc24hDetails(result);
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
    
    


    async function addQueueFront(tokenId: number) {
        
        if((tokenId == 3 && gold < 1)||(tokenId == 2 && silver < 1)||(tokenId == 1 && bronze < 1)){
            setError("Not enough NFTs to add to the queue.");
            return
        }
        try {
            setLoading(true);
            
    
            await addQueue(BigInt(tokenId), BigInt(1));
            setAlert("Added successfully");
            getQueueBronzeDetails();
            getQueueSilverDetails();
            getQueueGoldDetails();
            getQueueBtc24hDetails()
            getQueueBitcoin24hDetails()

        } catch (error: any) {
            
            if (error.message.includes("You don't have this NFT")) {
                setError("You don't own this NFT");
            } else {
                setError("Something went wrong, please try again.");
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
    async function doClaimQueue(index: number, queueId: number) {
        try {
          setLoading(true);
      
          // Aguarda a confirmação da transação
          const result = await claimQueue(index, queueId);
      
          if (result) {
            setAlert("Claim Successful");
            getQueueBronzeDetails();
            getQueueSilverDetails();
            getQueueGoldDetails();
            getQueueBtc24hDetails()
            getQueueBitcoin24hDetails()
          }
        } catch (error) {
          setError("Claim Failed");
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

    async function getQueueBronzeDetails() {
        try {
            const result: queueData[] = await getQueue(1); // Supondo que getQueue retorna uma lista
            setQueueBronzeDetails(result);
        } catch (error) {
        }
    }
    async function getQueueSilverDetails() {
        try {
            const result: queueData[] = await getQueue(2); // Supondo que getQueue retorna uma lista
            setQueueSilverDetails(result);
        } catch (error) {
        }
    }

    async function getQueueGoldDetails() {
        try {
            const result: queueData[] = await getQueue(3); // Supondo que getQueue retorna uma lista
            setQueueGoldDetails(result);
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
            for (let i = 0; i < 3; i++) {
                const result = await balanceToPaid(i);
                if (result !== undefined && result !== null) {
                    results.push(Number(result) * validCoinCotation);
                }
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
            getQueueBronzeDetails();
            getQueueSilverDetails();
            getQueueGoldDetails();
            getQueueBtc24hDetails()
            getQueueBitcoin24hDetails()
            getTokensToWithdrawF();
            getTokensToWithdrawBtc24hFront()
            getBalanceBitcoin24h()
            getBalanceBtc24h()
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
        if(queueBronzeDetails){
            veSePaga(queueBronzeDetails, 0);
        }
        if(queueSilverDetails){
            veSePaga(queueSilverDetails, 1);
        }
        if(queueGoldDetails){
            veSePaga(queueGoldDetails, 2);
        }
        if(queueWbtcDetails){
            veSePaga(queueWbtcDetails, 3)
        }
        if(queueBtc24hDetails){
            veSePaga(queueBtc24hDetails, 4)
        }
        if(queueBitcoin24hDetails){
            veSePaga(queueBitcoin24hDetails, 5)
        }
    }, [queueBronzeDetails, queueSilverDetails, queueGoldDetails, queueWbtcDetails, balance[0], balance[1], balance[2], balanceQueueWbtc])

    
    useEffect(() => {
        getBalanceBitcoin24h()
        getBalanceBtc24h()
        if (coinCotation > 0) {
            
            balanceFree();
            getBalanceBitcoin24h()
            getBalanceBtc24h()
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
    const silverSliderRef = useRef(null);
    const bronzeSliderRef = useRef(null);
    const wbtcSliderRef = useRef(null);
    const btc24hSliderRef = useRef(null);
    const bitcoin24hSliderRef = useRef(null);
    
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
        const paymentAmounts = [20, 125, 300, 500, 100, 100];
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
            setQueueBronzeDetailsFormated(queueCopy);
            setReadyToPaidBronze(count);
        } else if (index === 1) {
            setQueueSilverDetailsFormated(queueCopy);
            setReadyToPaidSilver(count);
        } else if(index === 2){
            setQueueGoldDetailsFormated(queueCopy);
            setReadyToPaidGold(count);
        }else if(index === 3){
            setQueueWbtcDetailsFormated(queueCopy);
            setReadyToPaidWbtc(count);
        }else if(index === 4){
            setQueueBtc24hDetailsFormated(queueCopy);
            setReadyToPaidBtc24h(count);
        }else{
            setQueueBitcoin24hDetailsFormated(queueCopy);
            setReadyToPaidBitcoin24h(count);
        }
    }


    const handleWithdraw = async () => {
        setLoading(true);
        setAlert(""); // Limpa mensagens anteriores
      
        const result = await withdrawTokens();
      
        if (result.success) {
          setAlert("Sucess");
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
          setAlert("Sucess");
        } else {
          setError(result.errorMessage);
        }
      
        setLoading(false);
      };

      const countUserNftSilver = queueSilverDetailsFormated?.filter(
        (data) => data.user.toLowerCase() === address?.toLowerCase()
      ).length || 0;

      const countUserNftGold = queueGoldDetailsFormated?.filter(
        (data) => data.user.toLowerCase() === address?.toLowerCase()
      ).length || 0;

      const countUserNftBronze = queueBronzeDetailsFormated?.filter(
        (data) => data.user.toLowerCase() === address?.toLowerCase()
      ).length || 0;
      const countUserNftWbtc = queueWbtcDetailsFormated?.filter(
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
                      <div className="w-14 h-14 border-t-4 border-b-4 border-[#00ff54] rounded-full animate-spin"></div>
                    </div>
                    )}
            <div className="lg:w-[98%] w-[90%] max-w-[1480px] flex flex-col items-center overflow-hidden">
                {/* Header */}
                <div className="lg:w-[70%] w-[90%] h-[130px] flex mt-[60px] justify-center items-center relative text-black">
                    
                    <img
                        alt="banner"
                        srcSet="images/mobile_bunner_queue.png 480w,
                                images/mobile_bunner_queue.png 768w,
                                images/bunner_queue.png 1200w"
                        sizes="(max-width: 480px) 100vw, 
                                (max-width: 1000px) 70vw, 
                                50vw"
                        className="absolute w-full h-auto"
                    />
                    <p className="relative font-bold lg:text-[22px] text-[16px]">BTC24H PAYMENT QUEUE</p>
                </div>

                {/* Main Content */}
                <div className="w-[98%] mt-[30px] mb-[100px] flex flex-col items-center space-y-8">


                    {/* ------------------ QUEUE GOLD --------------------- */}
                    <div className="flex mt-[30px] flex-col lg:flex-row w-[90%] max-w-[1400px] items-center justify-between p-4 bg-white bg-opacity-10 rounded-3xl space-y-4 lg:space-y-0 lg:space-x-4">
                        {/* Image */}
                        <div className="lg:w-[25%] md:w-[50%] w-[30%] flex items-center justify-center">
                            <img
                                src={`images/queue_gold.png`}
                                className="w-full h-auto"
                                alt={`QueueBronze`}
                            />
                        </div>

                        {/* Balance and Action */}
                        <div className="lg:w-[15%] w-[40%] flex flex-col items-center text-center">
                            <p>Balance to Paid:</p>

                           
                                <p className="text-[#ffc100]">{balance[2]?.toFixed(2) || 0}$</p>
                           
                            {readyToPaidGold >= 10 && queueGoldDetailsFormated?(
                                <button onClick={() => doClaimQueue(Number(queueGoldDetailsFormated[0].index), 3)} className="w-[150px] p-2 bg-[#00ff54] rounded-3xl text-black mt-[10px] hover:bg-[#00D837] hover:scale-105 transition-all duration-300">
                                Distribute
                                </button>
                            ):(
                                <button className="w-[150px] p-2 cursor-not-allowed bg-gray-400 rounded-3xl text-black mt-[10px] hover:bg-gray-500 hover:scale-105 transition-all duration-300">
                                Distribute
                                </button>
                            )}
                            
                            {isApproved?(
                            <button onClick={() => addQueueFront(3)} className="w-[150px] p-2 bg-[#cbc622] hover:scale-105 transition-all duration-300 rounded-3xl text-black mt-[10px]">
                                Add Nft
                            </button>
                            ):(
                            <button onClick={doApprove} className="w-[150px] p-2 bg-[#cbc622] rounded-3xl hover:scale-105 transition-all duration-300 text-black mt-[10px]">
                                Approve
                            </button>
                            )}
                            
                        </div>

                        {/* Carousel */}
                        <div className="lg:w-[60%] p-4 md:max-w-[480px] md:w-[96%] w-[84%] bg-white bg-opacity-10 rounded-3xl relative overflow-hidden">
                            <Slider ref={goldSliderRef} {...settings}>
                            {queueGoldDetailsFormated?.map((data, index) => (
                                    data.nextPaied === true?(
                                        <div
                                        key={index}
                                        className="border-2 border-green-500 p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>User: {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>Position: {index+1}</p>
                                        <p>Received: 300$</p>
                                        </div>
                                    ):data.user.toLowerCase() === address?.toLowerCase()?(
                                        <div
                                        key={index}
                                        className="border-2 border-blue-600 p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>User: {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>Position: {index+1}</p>
                                        <p>Received: 300$</p>
                                        </div>
                                    ):(
                                        <div
                                        key={index}
                                        className=" p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>User: {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>Position: {index+1}</p>
                                        <p>Received: 300 $</p>
                                        </div>
                                    )
                                    
                                ))}
                            </Slider>
                            <button className='p-[2px] text-[30px]   rounded-md shadow-lg absolute right-20 mt-[10px] '
                            onClick={() => goToFirstSlide(goldSliderRef, queueGoldDetailsFormated?.length)}
                                    >
                                <MdKeyboardDoubleArrowLeft />
                             </button>
                            <button className='p-[2px] text-[30px]  rounded-md shadow-lg absolute right-6 mt-[10px]'
                            onClick={() => goToLastSlide(goldSliderRef, queueGoldDetailsFormated?.length)}
                                    >
                                <MdKeyboardDoubleArrowRight />
                             </button>
                             <div className='p-2 mt-[10px]'>
                             <p >You have on queue: {countUserNftGold}</p>
                             <p >You have on wallet: {gold}</p>
                             </div>
                        </div>
                    </div>

                    {/* ------------------ QUEUE SILVER --------------------- */}
                    <div className="flex flex-col lg:flex-row w-[90%] max-w-[1400px] items-center justify-between p-4 bg-white bg-opacity-10 rounded-3xl space-y-4 lg:space-y-0 lg:space-x-4">
                        {/* Image */}
                        <div className="lg:w-[25%] md:w-[50%] w-[30%] flex items-center justify-center">
                            <img
                                src={`images/queue_silver.png`}
                                className="w-full h-auto"
                                alt={`QueueBronze`}
                            />
                        </div>

                        {/* Balance and Action */}
                        
                        <div className="lg:w-[15%] w-[40%] flex flex-col items-center text-center">
                            <p>Balance to Paid:</p>
                            <p className="text-[#ffc100]">{balance[1]?.toFixed(2) || 0}$</p>
                            {readyToPaidSilver >= 10 && queueSilverDetailsFormated?(
                                <button onClick={() => doClaimQueue(Number(queueSilverDetailsFormated[0].index), 2)} className="w-[150px] p-2 bg-[#00ff54] rounded-3xl text-black mt-[10px] hover:bg-[#00D837] hover:scale-105 transition-all duration-300">
                                Distribute
                                </button>
                            ):(
                                <button className="w-[150px] p-2 cursor-not-allowed bg-gray-400 rounded-3xl text-black mt-[10px] hover:bg-gray-500 hover:scale-105 transition-all duration-300">
                                Distribute
                                </button>
                            )}
                            
                            {isApproved?(
                            <button onClick={() => addQueueFront(2)} className="w-[150px] p-2 bg-[#cbc622] rounded-3xl text-black mt-[10px]  hover:scale-105 transition-all duration-300">
                                Add Nft
                            </button>
                            ):(
                            <button onClick={doApprove} className="w-[150px] p-2 bg-[#cbc622] rounded-3xl text-black mt-[10px] hover:scale-105 transition-all duration-300">
                                Approve
                            </button>
                            )}
                        </div>

                        {/* Carousel */}
                        <div className="lg:w-[60%] p-4 md:max-w-[480px] md:w-[96%] w-[84%] bg-white bg-opacity-10 rounded-3xl relative overflow-hidden">
                            <Slider ref={silverSliderRef} {...settings}>
                                {queueSilverDetailsFormated?.map((data, index) => (
                                    data.nextPaied === true?(
                                        <div
                                        key={index}
                                        className="border-2 border-green-500 p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>User: {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>Position: {index+1}</p>
                                        <p>Received: 125$</p>
                                        </div>
                                    ):data.user.toLowerCase() === address?.toLowerCase()?(
                                        <div
                                        key={index}
                                        className="border-2 border-blue-600 p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>User: {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>Position: {index+1}</p>
                                        <p>Received: 125$</p>
                                        </div>
                                    ):(
                                        <div
                                        key={index}
                                        className=" p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>User: {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>Position: {index+1}</p>
                                        <p>Received: 125$</p>
                                        </div>
                                    )
                                    
                                ))}
                            </Slider>
                            <button className='p-[2px] text-[30px]   rounded-md shadow-lg absolute right-20 mt-[10px] '
                            onClick={() => goToFirstSlide(silverSliderRef, queueSilverDetailsFormated?.length)}
                                    >
                                <MdKeyboardDoubleArrowLeft />
                             </button>
                            <button className='p-[2px] text-[30px]  rounded-md shadow-lg absolute right-6 mt-[10px]'
                            onClick={() => goToLastSlide(silverSliderRef, queueSilverDetailsFormated?.length)}
                                    >
                                <MdKeyboardDoubleArrowRight />
                             </button>
                             <div className='p-2 mt-[10px]'>
                             <p >You have on queue: {countUserNftSilver}</p>
                             <p >You have on wallet: {silver}</p>
                             </div>                        </div>
                    </div>

                    {/* ------------------ QUEUE BRONZE --------------------- */}

                    <div className="flex flex-col lg:flex-row w-[90%] max-w-[1400px] items-center justify-between p-4 bg-white bg-opacity-10 rounded-3xl space-y-4 lg:space-y-0 lg:space-x-4">
                        {/* Image */}
                        <div className="lg:w-[25%] md:w-[50%] w-[30%] flex items-center justify-center">
                            <img
                                src={`images/queue_bronze.png`}
                                className="w-full h-auto"
                                alt={`QueueBronze`}
                            />
                        </div>

                        {/* Balance and Action */}
                        <div className="lg:w-[15%] w-[40%] flex flex-col items-center text-center">
                            <p>Balance to Paid:</p>
                            <p className="text-[#ffc100]">{balance[0]?.toFixed(2) || 0}$</p>
                            {readyToPaidBronze >= 10 && queueBronzeDetailsFormated?(
                                <button onClick={() => doClaimQueue(Number(queueBronzeDetailsFormated[0].index), 1)} className="w-[150px] p-2 bg-[#00ff54] rounded-3xl text-black mt-[10px] hover:bg-[#00D837] hover:scale-105 transition-all duration-300">
                                Distribute
                                </button>
                            ):(
                                <button className="w-[150px] p-2 cursor-not-allowed bg-gray-400 rounded-3xl text-black mt-[10px] hover:bg-gray-500 hover:scale-105 transition-all duration-300">
                                Distribute
                                </button>
                            )}
                            {isApproved?(
                            <button onClick={() => addQueueFront(1)} className="w-[150px] p-2 bg-[#cbc622] rounded-3xl text-black mt-[10px]  hover:scale-105 transition-all duration-300">
                                Add Nft
                            </button>
                            ):(
                            <button onClick={doApprove}  className="w-[150px] p-2 bg-[#cbc622] rounded-3xl text-black mt-[10px] hover:scale-105 transition-all duration-300">
                                Approve
                            </button>
                            )}
                        </div>

                        {/* Carousel */}
                        
                        <div className="lg:w-[60%] p-4 md:max-w-[480px] md:w-[96%] w-[84%] bg-white bg-opacity-10 rounded-3xl relative overflow-hidden">
                            
                            <Slider ref={bronzeSliderRef} {...settings}>
                            {queueBronzeDetailsFormated?.map((data, index) => (
                                    data.nextPaied === true?(
                                        <div
                                        key={index}
                                        className="border-2 border-green-500 p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>User: {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>Position: {index+1}</p>
                                        <p>Received: 20$</p>
                                        </div>
                                    ):data.user.toLowerCase() === address?.toLowerCase()?(
                                        <div
                                        key={index}
                                        className="border-2 border-blue-600 p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>User: {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>Position: {index+1}</p>
                                        <p>Received: 20$</p>
                                        </div>
                                    ):(
                                        <div
                                        key={index}
                                        className=" p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>User: {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>Position: {index+1}</p>
                                        <p>Received: 20$</p>
                                        </div>
                                    )
                                    
                                ))}
                            </Slider>
                            <button className='p-[2px] text-[30px]   rounded-md shadow-lg absolute right-20 mt-[10px] '
                            onClick={() => goToFirstSlide(bronzeSliderRef, queueBronzeDetailsFormated?.length)}
                                    >
                                <MdKeyboardDoubleArrowLeft />
                             </button>
                            <button className='p-[2px] text-[30px]  rounded-md shadow-lg absolute right-6 mt-[10px]'
                            onClick={() => goToLastSlide(bronzeSliderRef, queueBronzeDetailsFormated?.length)}
                                    >
                                <MdKeyboardDoubleArrowRight />
                             </button>
                             <div className='p-2 mt-[10px]'>
                             <p >You have on queue: {countUserNftBronze}</p>
                             <p >You have on wallet: {bronze}</p>
                             </div>                        </div>
                    </div>
        

























                    <div className="flex flex-col lg:flex-row w-[90%] max-w-[1400px] items-center justify-between p-4 bg-white bg-opacity-10 rounded-3xl space-y-4 lg:space-y-0 lg:space-x-4">
                        {/* Image */}
                        <div className="lg:w-[25%] md:w-[50%] w-[30%] flex items-center justify-center">
                            <img
                                src={`images/logo.png`}
                                className="w-full h-auto"
                                alt={`QueueBronze`}
                            />
                        </div>
                        <p className='font-bold bg-green-500 p-4 text-center rounded-2xl'>Btc24h Queue</p>
                        

                        {/* Balance and Action */}
                        
                        <div className="lg:w-[15%] w-[40%] flex flex-col items-center text-center">
                            <p>Balance to Paid:</p>
                            <p className="text-[#ffc100]">{(balance[4])  || 0}$</p>
                            <p>Preview Value: </p>
                            <p className="text-[#ffc100]">
                            {valuesDeposit 
                                ? (Number(valuesDeposit[0]) / 10 ** 18).toFixed(2) // Converte e limita a 6 casas decimais
                                : 0} 
                             Btc24h
                            </p>
                            {readyToPaidBtc24h >= 10 && queueBtc24hDetailsFormated?(
                                <button onClick={() => doClaimQueueBtc24hFront()} className="w-[150px] p-2 bg-[#00ff54] rounded-3xl text-black mt-[10px] hover:bg-[#00D837] hover:scale-105 transition-all duration-300">
                                Distribute
                                </button>
                            ):(
                                <button className="w-[150px] p-2 cursor-not-allowed bg-gray-400 rounded-3xl text-black mt-[10px] hover:bg-gray-500 hover:scale-105 transition-all duration-300">
                                Distribute
                                </button>
                            )}
                            

                            {valuesDeposit && allowanceBtc24h[0] > (valuesDeposit[0] || 0n)?(
                            <button className="w-[150px] p-2 bg-[#cbc622] rounded-3xl text-black mt-[10px]  hover:scale-105 transition-all duration-300">
                                Add Queue
                            </button>
                            ):(
                            <button  className="w-[150px] p-2 bg-[#cbc622] rounded-3xl text-black mt-[10px] hover:scale-105 transition-all duration-300">
                                Approve
                            </button>
                            )}
                        </div>

                        {/* Carousel */}
                        <div className="lg:w-[60%] p-4 md:max-w-[480px] md:w-[96%] w-[84%] bg-white bg-opacity-10 rounded-3xl relative overflow-hidden">
                            <Slider ref={btc24hSliderRef} {...settings}>
                                {queueBtc24hDetailsFormated?.map((data, index) => (
                                    data.nextPaied === true?(
                                        <div
                                        key={index}
                                        className="border-2 border-green-500 p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>User: {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>Position: {index+1}</p>
                                        <p>Received: 100$</p>
                                        </div>
                                    ):data.user.toLowerCase() === address?.toLowerCase()?(
                                        <div
                                        key={index}
                                        className="border-2 border-blue-600 p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>User: {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>Position: {index+1}</p>
                                        <p>Received: 100$</p>
                                        </div>
                                    ):(
                                        <div
                                        key={index}
                                        className=" p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>User: {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>Position: {index+1}</p>
                                        <p>Received: 100$</p>
                                        </div>
                                    )
                                    
                                ))}
                            </Slider>
                            <button className='p-[2px] text-[30px]   rounded-md shadow-lg absolute right-20 mt-[10px] '
                            onClick={() => goToFirstSlide(btc24hSliderRef, queueBtc24hDetailsFormated?.length)}
                                    >
                                <MdKeyboardDoubleArrowLeft />
                             </button>
                            <button className='p-[2px] text-[30px]  rounded-md shadow-lg absolute right-6 mt-[10px]'
                            onClick={() => goToLastSlide(btc24hSliderRef, queueBtc24hDetailsFormated?.length)}
                                    >
                                <MdKeyboardDoubleArrowRight />
                             </button>
                              </div>
































                    </div>
                    <div className="flex flex-col lg:flex-row w-[90%] max-w-[1400px] items-center justify-between p-4 bg-white bg-opacity-10 rounded-3xl space-y-4 lg:space-y-0 lg:space-x-4">
                        {/* Image */}
                        <div className="lg:w-[25%] md:w-[50%] w-[30%] flex items-center justify-center">
                            <img
                                src={`images/logo.png`}
                                className="w-full h-auto"
                                alt={`QueueBronze`}
                            />
                        </div>
                        <p className='font-bold bg-green-600 p-4 text-center rounded-2xl'>Bitcoin24h Queue</p>

                        {/* Balance and Action */}
                        
                        <div className="lg:w-[15%] w-[40%] flex flex-col items-center text-center">
                            <p>Balance to Paid:</p>
                            <p className="text-[#ffc100]">{ Number(balance[5])  || 0}$</p>
                            <p>Preview Value:</p>
                            <p className="text-[#ffc100]">
                            {valuesDeposit 
                                ? (Number(valuesDeposit[1]) / 10 ** 18).toFixed(2) // Converte e limita a 6 casas decimais
                                : 0} 
                             Bitcoin24h
                            </p>

                            {readyToPaidBitcoin24h >= 10 && queueBitcoin24hDetailsFormated?(
                                <button onClick={() => doClaimQueueBitcoin24hFront()} className="w-[150px] p-2 bg-[#00ff54] rounded-3xl text-black mt-[10px] hover:bg-[#00D837] hover:scale-105 transition-all duration-300">
                                Distribute
                                </button>
                            ):(
                                <button className="w-[150px] p-2 cursor-not-allowed bg-gray-400 rounded-3xl text-black mt-[10px] hover:bg-gray-500 hover:scale-105 transition-all duration-300">
                                Distribute
                                </button>
                            )}
                            
                            {valuesDeposit && allowanceBtc24h[1] > (valuesDeposit[1] || 0n)?(
                            <button  className="w-[150px] p-2 bg-[#cbc622] rounded-3xl text-black mt-[10px]  hover:scale-105 transition-all duration-300">
                                Add Queue
                            </button>
                            ):(
                            <button  className="w-[150px] p-2 bg-[#cbc622] rounded-3xl text-black mt-[10px] hover:scale-105 transition-all duration-300">
                                Approve
                            </button>
                            )}
                        </div>

                        {/* Carousel */}
                        <div className="lg:w-[60%] p-4 md:max-w-[480px] md:w-[96%] w-[84%] bg-white bg-opacity-10 rounded-3xl relative overflow-hidden">
                            <Slider ref={bitcoin24hSliderRef} {...settings}>
                                {queueBitcoin24hDetails?.map((data, index) => (
                                    data.nextPaied === true?(
                                        <div
                                        key={index}
                                        className="border-2 border-green-500 p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>User: {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>Position: {index+1}</p>
                                        <p>Received: 100$</p>
                                        </div>
                                    ):data.user.toLowerCase() === address?.toLowerCase()?(
                                        <div
                                        key={index}
                                        className="border-2 border-blue-600 p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>User: {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>Position: {index+1}</p>
                                        <p>Received: 100$</p>
                                        </div>
                                    ):(
                                        <div
                                        key={index}
                                        className=" p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>User: {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>Position: {index+1}</p>
                                        <p>Received: 100$</p>
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
                             </button>                    </div>
                    </div>
























































                    <div className='w-[90%] sm:w-[70%]  bg-white bg-opacity-5 flex items-center sm:p-6 p-2 flex-col'>
                        <p className='text-3xl sm:text-xl font-bold'>You have to withdraw: </p>
                        <p>When your nft's generate rewards, you can see them here</p>
                       {/* <p className='font-bold text-3xl mt-[5px]'>{tokensToWithdraw?  parseFloat(ethers.formatEther(tokensToWithdraw)).toFixed(2) : ' 0'} BTC24H</p>*/}
                        {tokensToWithdraw > 0?(
                            <button onClick={handleWithdraw} className='text-black  font-bold text-[22px] mt-[15px] mb-[20px] p-4 w-[200px] rounded-2xl bg-[#00ff54] hover:w-[210px] duration-100'>Claim</button>
                        ):tokensToWithdrawBtc24h > 0?(
                            <button onClick={handleWithdrawBtc24h} className='text-black  font-bold text-[22px] mt-[15px] mb-[20px] p-4 w-[200px] rounded-2xl bg-[#00ff54] hover:w-[210px] duration-100'>Claim</button>
                        ):(
                            <button className='text-black cursor-not-allowed bg-gray-400 font-bold text-[22px] mt-[15px] mb-[20px] p-4 w-[200px] rounded-2xl'>Claim</button>   
                        )}
                        
                    </div>
                </div>
            
            </div>
            {
                tokensToWithdraw>0?             <ModalTokensToWithdraw tokens={tokensToWithdraw} isWbtc={false} isBtc24h={false}></ModalTokensToWithdraw>:""
            }
            {
                tokensToWithdrawWbtc>0?             <ModalTokensToWithdraw tokens={tokensToWithdrawWbtc} isWbtc={true} isBtc24h={false}></ModalTokensToWithdraw>:""
            }
            {
                tokensToWithdrawBtc24h>0?             <ModalTokensToWithdraw tokens={tokensToWithdrawBtc24h} isWbtc={false} isBtc24h={true}></ModalTokensToWithdraw>:""
            }
            <Footer />
        </>
    );
}

export default withAuthGuard(Page1);
