/* ,{maxFeePerGas: maxFeePerGas,maxPriorityFeePerGas: maxPriorityFeePerGas} */
import { ethers, toNumber } from "ethers";
import donationAbi from "./abis/donation.abi.json";
import userAbi from "./abis/user.abi.json";
import usdtAbi from "./abis/usdt.abi.json"
import btc24hAbi from "./abis/btc24h.abi.json"
import oracleAbi from "./abis/oracle.abi.json";
import collectionAbi from "./abis/collection.abi.json";
import { UserDonation } from "./types";
import queueAbi from "./abis/queue.abi.json";
import paymentManagerAbi from "./abis/payment.manager.abi.json"
import distributeAbi from "./abis/distribute.abi.json"

import collection2Abi from "./abis/collection2.abi.json"
import {queueData} from "./types"

import wbtcAbi from "./abis/wbtc.abi.json"
import wbtcCollectionAbi from "./abis/wbtc_collection.abi.json"
import wbtcQueueAbi from "./abis/wbtc_queue.abi.json"
import usdtWbtcAbi from "./abis/usdtwbtc.abi.json"
import wbtcOracleAbi from "./abis/wbtcOracle.abi.json"

import oracleV2Abi from "./abis/oracleV2.abi.json"
import donationV2Abi from "./abis/donationV2.abi.json"

import btc24hV2Abi from "./abis/btc24hV2.abi.json"
import oracle3Abi from "./abis/oracle3.abi.json"
import queueCoinAbi from "./abis/queueCoin.abi.json"


const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;
const CHAIN_ID_AMOY = process.env.NEXT_PUBLIC_CHAIN_ID_AMOY;
const DONATION_ADDRESS = process.env.NEXT_PUBLIC_DONATION;
const USDT_ADDRESS = process.env.NEXT_PUBLIC_USDT;
const BTC24H_ADDRESS = process.env.NEXT_PUBLIC_BTC24H;
const COLLECTION_ADDRESS= process.env.NEXT_PUBLIC_COLLECTION;
const ORACLE_ADDRESS= process.env.NEXT_PUBLIC_ORACLE;
const USER_ADDRESS= process.env.NEXT_PUBLIC_USER;
const QUEUE_ADDRESS = process.env.NEXT_PUBLIC_QUEUE;
const RPC_ADDRESS = process.env.NEXT_PUBLIC_RPC
const PAYMENT_MANAGER = process.env.NEXT_PUBLIC_PAYMENT_MANAGER

const DISTRIBUTE_NFT = process.env.NEXT_PUBLIC_DISTRIBUTE_NFT
const COLLECTION2 = process.env.NEXT_PUBLIC_COLLECTION2

const WBTC_ADDRESS = process.env.NEXT_PUBLIC_WBTC;
const WBTC_QUEUE_ADDRESS = process.env.NEXT_PUBLIC_WBTC_QUEUE;
const WBTC_COLLECTION_ADDRESS = process.env.NEXT_PUBLIC_WBTC_COLLECTION;
const USDT_ADDRESS_WBTC = process.env.NEXT_PUBLIC_WBTC_USDT;
const WBTC_ORACLE_ADDRESS = process.env.NEXT_PUBLIC_WBTC_ORACLE;

const DONATION_V2_ADDRESS = process.env.NEXT_PUBLIC_DONATION_V2;
const ORACLE_V2_ADDRESS = process.env.NEXT_PUBLIC_ORACLE_V2;

const BTC24H_V2_ADDRESS = process.env.NEXT_PUBLIC_BTC24H_V2;
const QUEUE_COIN_ADDRESS = process.env.NEXT_PUBLIC_QUEUE_COIN


const maxPriorityFeePerGas = ethers.parseUnits("35","gwei");

/*------------ CONNECT WALLET --------------*/
function getProvider() {
  if (!window.ethereum) throw new Error("No MetaMask found");
  return new ethers.BrowserProvider(window.ethereum);
}

export async function doLogin() {
  try {
    const provider = await getProvider();
    const account = await provider.send("eth_requestAccounts", []);
    if (!account || !account.length)
      throw new Error("Wallet not found/allowed.");
    await provider.send("wallet_switchEthereumChain", [{chainId: CHAIN_ID}])
    return account[0];
  } catch (error) {
    throw error;
  }
}

/* 
/*------------ UNILEVEL --------------*/
export async function userUnilevelTotalDonated(
  address: string,
  maxRetries = 5, // Número máximo de tentativas
  delay = 1000 // Tempo de espera entre tentativas (em milissegundos)
) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const provider = await getProvider(); // Usa o provider da wallet
      const contract = new ethers.Contract(
        DONATION_ADDRESS || "",
        donationAbi,
        provider
      );

      const userUnilevel = await contract.getUserUnilevelDonations(address);

      // Verifica se o valor é válido antes de retornar
      if (userUnilevel !== undefined && userUnilevel !== null) {
        return userUnilevel; // Retorna o valor obtido
      } else {
      }
    } catch (err) {
      
    }

    retries++;
    await new Promise((resolve) => setTimeout(resolve, delay)); // Aguarda antes de tentar novamente
  }

  throw new Error(`Falha ao obter dados após ${maxRetries} tentativas.`);
}

/*------------ COLLECTION NFTS --------------*/

export async function approveUSDT(value: Number) {
  const provider = await getProvider()
  const signer = await provider.getSigner();

  const mint = new ethers.Contract(
    USDT_ADDRESS ? USDT_ADDRESS : "",
    usdtAbi,
    signer
  );



  const tx = await mint.approve(COLLECTION_ADDRESS, value);
  await tx.wait();

  return tx;
}

export async function approveBTC24HDonation(value: string) {
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const token = new ethers.Contract(
    BTC24H_ADDRESS ? BTC24H_ADDRESS : "",
    btc24hAbi,
    signer
  );
  const feeData = await provider.getFeeData();
  if (!feeData.maxFeePerGas) {
    throw new Error("Unable to get gas price");
  }

  const maxFeePerGas = feeData.maxFeePerGas *3n;

  const tx = await token.approve(DONATION_ADDRESS, ethers.parseUnits(value,"ether"),{maxFeePerGas: maxFeePerGas,maxPriorityFeePerGas: maxPriorityFeePerGas});

  await tx.wait();
  return tx;
}
export async function approveUsdtDonation(value: string) {
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const token = new ethers.Contract(
    USDT_ADDRESS ? USDT_ADDRESS : "",
    usdtAbi,
    signer
  );
  const feeData = await provider.getFeeData();
  if (!feeData.maxFeePerGas) {
    throw new Error("Unable to get gas price");
  }

  console.log("value", value)
  const maxFeePerGas = feeData.maxFeePerGas *3n;


  const tx = await token.approve(DONATION_ADDRESS, Number(value)*10**6);  
  await tx.wait();
  return tx;
}



export async function getAllowanceUsdt(
  address: string,
  maxRetries = 5, // Número máximo de tentativas
  delay = 1000 // Tempo de espera entre tentativas (em milissegundos)
) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      // Obtém o provedor conectado à wallet
      const provider = await getProvider();

      // Conecta ao contrato
      const mint = new ethers.Contract(
        USDT_ADDRESS ? USDT_ADDRESS : "",
        usdtAbi,
        provider
      );

      // Obtém o allowance
      const allowance : bigint = await mint.allowance(address, COLLECTION_ADDRESS);

      // Retorna o valor caso a chamada tenha sucesso
      if (allowance !== undefined) {
        return allowance;
      }

    } catch (error) {
    }

    retries++;

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Lança um erro caso todas as tentativas falhem
  throw new Error(`Falha ao obter allowance após ${maxRetries} tentativas.`);
}



export async function getNftsUser(address: string, value: number, maxRetries = 3): Promise<any> {
  const provider = await getProvider();

  const mint = new ethers.Contract(
    COLLECTION_ADDRESS ? COLLECTION_ADDRESS : "",
    collectionAbi,
    provider
  );

  const mint2 = new ethers.Contract(
    COLLECTION2 ? COLLECTION2 : "",
    collection2Abi,
    provider
  );

  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const tx = await mint.balanceOf(address, value);
      const tx2 = await mint2.balanceOf(address, value);

      
      // If the transaction is successful, return the result.
      if (tx !== undefined && tx2 !== undefined) {
        return tx+tx2;
      }
    } catch (error) {
    }

    attempt++;
  }

  // If all retries fail, throw an error or return a default value
  throw new Error(`Failed to fetch data from the blockchain after ${maxRetries} attempts.`);
}



export async function buyNft(quantity:number) {
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const buy = new ethers.Contract(
    COLLECTION_ADDRESS ? COLLECTION_ADDRESS : "",
    collectionAbi,
    signer
  );
  const feeData = await provider.getFeeData();
  if (!feeData.maxFeePerGas) {
    throw new Error("Unable to get gas price");
  }

  const maxFeePerGas = feeData.maxFeePerGas *3n;
  
  
  

  try {
    // Envia a transação
    const tx = await buy.mint(quantity);

    let concluded;

    // Tenta esperar a transação
    try {
      concluded = await tx.wait();
    } catch (waitError) {

      // Caso `tx.wait()` falhe, tenta obter o recibo manualmente
      concluded = await provider.getTransactionReceipt(tx.hash);
    }

    if (concluded && concluded.status === 1) {
      return concluded;
    } else {
      throw new Error("Transação falhou ou não foi confirmada.");
    }

  } catch (error) {
    throw error; // Lança erro para ser tratado no frontend
  }
}

export async function donate(amount:string){
  
  const provider = await getProvider();
  const signer = await provider.getSigner();

  
  
  const donation = new ethers.Contract(
    DONATION_ADDRESS ? DONATION_ADDRESS : "",
    donationAbi,
    signer
  );

  const feeData = await provider.getFeeData();
  if (!feeData.maxFeePerGas) {
    throw new Error("Unable to get gas price");
  }

  const maxFeePerGas = feeData.maxFeePerGas *3n;
  

  let tx
  try {


      tx = await donation.donate(Number(amount)*10**6);

    const concluded = tx.wait();
    return concluded;
  } catch (error) {
    console.error("Gas cannot be estimated:", error);
    throw error; 
  }

}
export async function claim(){
  
  const provider = await getProvider()
  const signer = await provider.getSigner();

  const feeData = await provider.getFeeData();
  if (!feeData.maxFeePerGas) {
    throw new Error("Unable to get gas price");
  }

  const maxFeePerGas = feeData.maxFeePerGas *3n;

  
  const donation = new ethers.Contract(
    DONATION_ADDRESS ? DONATION_ADDRESS : "",
    donationAbi,
    signer
  );
  
  try {

    const estimatedGas = await donation.claimDonation.estimateGas();
    

    const gasLimit = estimatedGas * 130n / 100n;


    // Envia a transação
    const tx = await donation.claimDonation({
      maxFeePerGas,
      maxPriorityFeePerGas,
      gasLimit,
    });

    await tx.wait();

    return tx;
  } catch (error) {
    console.error("Gas cannot be estimated:", error);
    throw error; 
  }
}
export async function getDonationAllowance(owner:string){
  
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();
  
  const btc24h = new ethers.Contract(
    BTC24H_ADDRESS ? BTC24H_ADDRESS : "",
    btc24hAbi,
    provider
  );


  const allowance = await btc24h.allowance(owner,DONATION_ADDRESS);
  
  return allowance;
}


export async function getBtc24hBalance(owner:string){
  
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();
  
  const btc24h = new ethers.Contract(
    BTC24H_ADDRESS ? BTC24H_ADDRESS : "",
    btc24hAbi,
    provider
  );

  const balance = await btc24h.balanceOf(owner);
  
  return balance;
}
export async function getBtc24hPrice(){
  
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();
  
  const oracle = new ethers.Contract(
    ORACLE_ADDRESS ? ORACLE_ADDRESS : "",
    oracleAbi,
    provider
  );

  const price = await oracle.returnPrice(ethers.parseUnits("1","ether"));
  
  return price;
}

export async function getBtc24hPreviewedClaim(owner:string){
  
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const provider = await getProvider();
  
        const donation = new ethers.Contract(
          DONATION_ADDRESS || '',
          donationAbi,
          provider
        );
  
        const balance = await donation.previewTotalValue(owner);
  
        return balance;
  
      } catch (error) {
        console.error(`Erro na tentativa ${attempt}:`, error);
  
        // Verifica se é a última tentativa
        if (attempt === 3) {
          console.error('Número máximo de tentativas atingido.');
          return null;
        }
  
        // Aguarda um tempo antes da próxima tentativa
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  
    // Retorno caso todas as tentativas falhem
    return null;
  }

export async function getTimeUntilToClaim(owner:string, index:number){
  
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();

  
  const donation = new ethers.Contract(
    DONATION_ADDRESS ? DONATION_ADDRESS : "",
    donationAbi,
    provider
  );

  const time = Number(await donation.timeUntilNextWithdrawal(owner, index));
  
  return time;
}



  

export async function getNextPool(){
  
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();
  
  const donation = new ethers.Contract(
    DONATION_ADDRESS ? DONATION_ADDRESS : "",
    donationAbi,
    provider
  );

  const balance  = (await donation.nextPoolFilling());
  
  return balance;
}

export async function getTotalBurned(){
  
  //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
  const provider = await getProvider();
  
  const donation = new ethers.Contract(
    DONATION_ADDRESS ? DONATION_ADDRESS : "",
    donationAbi,
    provider
  );

  const balance  = (await donation.totalBurned());
  
  return balance;
}

export async function isRegistered(owner:string){
  
  //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
  const provider = await getProvider();

  const user = new ethers.Contract(
    USER_ADDRESS ? USER_ADDRESS : "",
    userAbi,
    provider
  );

  const userData : any  = (await user.getUser(owner));
  
  return userData.registered;
}

export async function registerUser(newUser:string){
  
  const provider = await getProvider()
  const signer = await provider.getSigner();
  
  const user = new ethers.Contract(
    USER_ADDRESS ? USER_ADDRESS : "",
    userAbi,
    signer
  );
  const feeData = await provider.getFeeData();
  if (!feeData.maxFeePerGas) {
    throw new Error("Unable to get gas price");
  }

  const maxFeePerGas = feeData.maxFeePerGas *3n;

  const tx  = (await user.createUser(newUser));
  const receipet = await tx.wait()

  return receipet;
}

export async function isActiveNft(owner:string,tokenId:number){
  
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();
  
  const collection = new ethers.Contract(
    COLLECTION_ADDRESS ? COLLECTION_ADDRESS : "",
    collectionAbi,
    provider
  );

  const isActive : boolean  = (await collection.isActive(owner,tokenId));

  return isActive;
}

export async function isApprovedNft(owner: string, isQueue: boolean) {
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();

  const collection = new ethers.Contract(
      COLLECTION_ADDRESS ? COLLECTION_ADDRESS : "",
      collectionAbi,
      provider
  );

  let isApproved;
  if (!isQueue) {
      // Verifica aprovação para COLLECTION_ADDRESS
      isApproved = await collection.isApprovedForAll(owner, COLLECTION_ADDRESS);
  } else {
      // Verifica aprovação para QUEUE_ADDRESS
      isApproved = await collection.isApprovedForAll(owner, QUEUE_ADDRESS);
  }

  return isApproved; // Retorna true ou false
}



export async function activeUnilevelNft(tokenId:number){
  const provider = await getProvider()
  const signer = await provider.getSigner();
  
  const collection = new ethers.Contract(
    COLLECTION_ADDRESS ? COLLECTION_ADDRESS : "",
    collectionAbi,
    signer
  );
  let tx;
  const feeData = await provider.getFeeData();
  if (!feeData.maxFeePerGas) {
    throw new Error("Unable to get gas price");
  }

  const maxFeePerGas = feeData.maxFeePerGas *3n;


    tx  = (await collection.activeUnilevel(tokenId,{maxFeePerGas: maxFeePerGas,maxPriorityFeePerGas: maxPriorityFeePerGas}));
  
  const concluded = await tx.wait();
  return concluded;
}

/* ------- QUEUE -------------*/

export async function setApprovalForAll(isQueue:boolean){
  
  const provider = await getProvider();
  const signer = await provider.getSigner();
  
  const collection = new ethers.Contract(
    COLLECTION_ADDRESS ? COLLECTION_ADDRESS : "",
    collectionAbi,
    signer
  );
  let tx;
  const feeData = await provider.getFeeData();
  if (!feeData.maxFeePerGas) {
    throw new Error("Unable to get gas price");
  }

  const maxFeePerGas = feeData.maxFeePerGas *3n;

  if(isQueue){
    tx  = (await collection.setApprovalForAll(QUEUE_ADDRESS,true,{maxFeePerGas: maxFeePerGas,maxPriorityFeePerGas: maxPriorityFeePerGas}));
  }else{
    tx  = (await collection.setApprovalForAll(COLLECTION_ADDRESS,true,{maxFeePerGas: maxFeePerGas,maxPriorityFeePerGas: maxPriorityFeePerGas}));
  }
  await tx.wait()

  const concluded = tx.wait();
  return concluded;
}


export async function getQueue(batchLevel: number): Promise<queueData[]> {
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();

  const queueContract = new ethers.Contract(
    QUEUE_ADDRESS ? QUEUE_ADDRESS : "",
    queueAbi,
    provider
  );

  while (true) {
    try {
      // Obtenha os dados da fila diretamente do contrato
      const getQueueDetails: any[] = await queueContract.getQueueDetails(batchLevel);
      
      // Transforme as tuplas retornadas para o formato `queueData`
      const queue: queueData[] = getQueueDetails.map((item) => ({
        user: item[0], // address
        index: BigInt(item[1]), // uint256 -> BigInt
        batchLevel: BigInt(item[2]), // uint256 -> BigInt
        nextPaied: item[3] === 1 // uint256 -> boolean
      }));

      return queue;

    } catch (err) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Retry após 1s
    }
  }
}

export async function balanceToPaid(tokenId: number, maxRetries = 3): Promise<string> {
  // Initialize the provider
  const provider = await getProvider();
  const collection = new ethers.Contract(
    QUEUE_ADDRESS ? QUEUE_ADDRESS : "",
    queueAbi,
    provider
  );

  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      // Attempt to fetch data from the blockchain
      const tx = await collection.balanceFree(tokenId);

      // If successful, format and return the result
      return ethers.formatEther(tx);
    } catch (error) {
    }

    // Increment the attempt counter
    attempt++;
  }

  // If all retries fail, throw an error or return a default value
  throw new Error(`Failed to fetch balance from the blockchain after ${maxRetries} attempts.`);
}



export async function coinPrice() {

    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();

  const collection = new ethers.Contract(ORACLE_ADDRESS ? ORACLE_ADDRESS : "",oracleAbi,provider)

  let tx = (await collection.returnPrice(1000000000000000000))

  return (Number(tx)/Number(1000000));

}

export async function claimQueue(index: number, queueId: number) {
  if (!QUEUE_ADDRESS) {
    throw new Error("QUEUE_ADDRESS não está definido.");
  }

  const provider = await getProvider();
  const signer = await provider.getSigner();

  const collection = new ethers.Contract(
    QUEUE_ADDRESS,
    queueAbi,
    signer
  );
  const feeData = await provider.getFeeData();
  if (!feeData.maxFeePerGas) {
    throw new Error("Unable to get gas price");
  }

  const maxFeePerGas = feeData.maxFeePerGas *3n;

  try {
    // Envia a transação para o contrato
    const tx = await collection.claim(queueId,{maxFeePerGas: maxFeePerGas,maxPriorityFeePerGas: maxPriorityFeePerGas});

    // Aguarda a confirmação da transação
    const concluded = await tx.wait();

    // Retorna o resultado após a transação ser confirmada
    return concluded;
  } catch (error) {
    console.error("Erro ao realizar a transação:", error);
    throw error; // Repassa o erro para o chamador
  }
}



export async function addQueue(tokenId: BigInt, quantity: BigInt) {
  const provider = await getProvider();
    const signer = await provider.getSigner();

    const collection = new ethers.Contract(
      QUEUE_ADDRESS || "",
      queueAbi,
      signer
    );
    const feeData = await provider.getFeeData();
    if (!feeData.maxFeePerGas) {
      throw new Error("Unable to get gas price");
    }
  
    const maxFeePerGas = feeData.maxFeePerGas *3n;
  
    
    const tx = await collection.addToQueue(tokenId, quantity,{maxFeePerGas: maxFeePerGas,maxPriorityFeePerGas: maxPriorityFeePerGas});
    const concluded = await tx.wait(); // Aguarda a confirmação da transação
    return concluded; // Retorna a conclusão em caso de sucesso

}

export async function timeUntilActivate(address:string, index:Number){
  return 1000;
}

export async function getTokensToWithdraw(owner: string) {
  try {
      //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
      const provider = await getProvider();

    const queue = new ethers.Contract(
      QUEUE_ADDRESS || "",
      queueAbi,
      provider
    );

    const tokens = await queue.tokensToWithdraw(owner);
    return tokens; // Retorna a conclusão em caso de sucesso
  } catch (error: any) {
    // Retorna a mensagem de erro
    return {
      success: false,
      errorMessage: error?.reason || error?.message || "Unknown error occurred",
    };
  }
}
export async function withdrawTokens() {
  try {
    const provider = await getProvider();
    const signer = await provider.getSigner();

    const queue = new ethers.Contract(
      QUEUE_ADDRESS || "",
      queueAbi,
      signer
    );
    const feeData = await provider.getFeeData();
    if (!feeData.maxFeePerGas) {
      throw new Error("Unable to get gas price");
    }
  
    const maxFeePerGas = feeData.maxFeePerGas *3n;
  
    
    const tx = await queue.withdrawTokens({maxFeePerGas: maxFeePerGas,maxPriorityFeePerGas: maxPriorityFeePerGas});

    // Aguarda a confirmação
    const receipt = await tx.wait();

    if (receipt.status === 1) {
      // Sucesso
      return {
        success: true,
        message: "Tokens successfully withdrawn!",
        transactionHash: tx.hash,
      };
    } else {
      // Transação falhou
      return {
        success: false,
        errorMessage: "Transaction failed on the blockchain.",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      errorMessage: error?.reason || error?.message || "Unknown error occurred",
    };
  }
}

export async function getUsdtBalance(owner:string){
  
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();
  
  const usdt = new ethers.Contract(
    USDT_ADDRESS ? USDT_ADDRESS : "",
    usdtAbi,
    provider
  );

  const balance = await usdt.balanceOf(owner);
  
  return balance;
}

export async function getDonationAllowanceUsdt(owner:string){
  
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();
  const usdt = new ethers.Contract(
    USDT_ADDRESS ? USDT_ADDRESS : "",
    usdtAbi,
    provider
  );

  const allowance = await usdt.allowance(owner,DONATION_ADDRESS);
  
  return allowance;
}


export async function timeUntilInactiveNfts(owner:string,tokenId:number){
  
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();
  const collection = new ethers.Contract(
    COLLECTION_ADDRESS ? COLLECTION_ADDRESS : "",
    collectionAbi,
    provider
  );

  const time = await collection.timeUntilInactive(owner,tokenId);
  
  return time;
}

export async function getTreeUsers(address:string){
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();

  const usdt = new ethers.Contract(
    USER_ADDRESS ? USER_ADDRESS : "",
    userAbi,
    provider
  );

  const users = await usdt.getUser(address)
  return users;

}


/* ---------------- PAYMENT MANAGER -------------- */

export async function verifyPercentage(address:String){
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();

  const connect = new ethers.Contract(PAYMENT_MANAGER ? PAYMENT_MANAGER : "", paymentManagerAbi, provider);

  const verify = await connect.recipientsPercentage(address); 
  return verify;
}

export async function verifyBalance(address:String){
  const provider = await getProvider();

  const connect = new ethers.Contract(PAYMENT_MANAGER ? PAYMENT_MANAGER : "", paymentManagerAbi, provider);

  const verify = await connect.getUserBalance(address); 
  return verify;
}


export async function claimPaymentManager() {
  try {
      const provider = await getProvider();
      const signer = await provider.getSigner();

      const queue = new ethers.Contract(
          PAYMENT_MANAGER || "",
          paymentManagerAbi,
          signer
      );
      const feeData = await provider.getFeeData();
      if (!feeData.maxFeePerGas) {
        throw new Error("Unable to get gas price");
      }
    
      const maxFeePerGas = feeData.maxFeePerGas *3n;
    
        
      const tx = await queue.claim({maxFeePerGas: maxFeePerGas,maxPriorityFeePerGas: maxPriorityFeePerGas});

      await tx.wait();
      return { success: true };
  } catch (error: any) {
      console.error("Erro durante a execução da transação:", error);
      return {
          success: false,
          errorMessage: error?.reason || error?.message || "Unknown error occurred",
      };
  }
}

/* ------- PRESALE NFTS ----- */

export async function getNftNotClaimed(address:string){
  const provider = await getProvider();
  const signer = await provider.getSigner(); 

  const preSale = new ethers.Contract(DISTRIBUTE_NFT || "", distributeAbi, signer);
  const tx = await preSale.nftsToClaim(address);
  return tx;
}

export async function claimNftPreSale(){
  const provider = await getProvider();
  const signer = await provider.getSigner(); 
  const feeData = await provider.getFeeData();
  if (!feeData.maxFeePerGas) {
    throw new Error("Unable to get gas price");
  }

  const maxFeePerGas = feeData.maxFeePerGas *3n;

  const preSale = new ethers.Contract(DISTRIBUTE_NFT || "", distributeAbi, signer);
  const tx = await preSale.withdraw({maxFeePerGas: maxFeePerGas,maxPriorityFeePerGas: maxPriorityFeePerGas});
  await tx.wait();
  return tx;
}

export async function getTimeUntilNextClaim(address: string): Promise<number> {
  try {
    const provider = await getProvider();

    // Instância do contrato usando o provider (não precisa de signer para leitura)
    const preSale = new ethers.Contract(DISTRIBUTE_NFT || "", distributeAbi, provider);

    // Chamada ao método do contrato
    const timeLeft = await preSale.timeUntilClaim(address);

    // Converte o BigNumber para número
    return toNumber(timeLeft);
  } catch (error) {
    console.error("Erro ao obter o tempo até o próximo claim:", error);
    throw error;
  }
}


export async function approveNewNft(){
  const provider = await getProvider();
  const signer = await provider.getSigner(); 

  const preSale = new ethers.Contract(COLLECTION2 || "", collection2Abi, signer);
  const feeData = await provider.getFeeData();
  if (!feeData.maxFeePerGas) {
    throw new Error("Unable to get gas price");
  }

  const maxFeePerGas = feeData.maxFeePerGas *3n;

  const tx = await preSale.setApprovalForAll(QUEUE_ADDRESS, true,{maxFeePerGas: maxFeePerGas,maxPriorityFeePerGas: maxPriorityFeePerGas})

  await tx.wait();

  return tx;
}

export async function isApprovedNftPreSale(address: string) {
  const provider = await getProvider();
  const signer = await provider.getSigner(); 

  const preSale = new ethers.Contract(COLLECTION2 || "", collection2Abi, signer);

  // Apenas retorna o resultado diretamente sem `tx.wait()`
  const isApproved = await preSale.isApprovedForAll(address, QUEUE_ADDRESS);

  return isApproved; // Retorna boolean
}

export async function addQueue2(){
  const provider = await getProvider();
  const signer = await provider.getSigner(); 

  const preSale = new ethers.Contract(QUEUE_ADDRESS || "", queueAbi, signer);
  const feeData = await provider.getFeeData();
  if (!feeData.maxFeePerGas) {
    throw new Error("Unable to get gas price");
  }

  const maxFeePerGas = feeData.maxFeePerGas *3n;

  const tx = await preSale.addToQueue(3, 1,{maxFeePerGas: maxFeePerGas,maxPriorityFeePerGas: maxPriorityFeePerGas});

  await tx.wait();

  return tx;
}

export async function nftOutQueue(address: string) {
  const provider = await getProvider();
  const signer = await provider.getSigner(); 

  const preSale = new ethers.Contract(COLLECTION2 || "", collection2Abi, signer);

  // Apenas retorna o resultado diretamente sem `tx.wait()`
  const number = await preSale.balanceOf(address, 3);

  return number; // Retorna boolean
}


export async function totalGanhoToken(address:string){
  const provider = await getProvider();

  const connect = new ethers.Contract(DONATION_ADDRESS || "", donationAbi, provider)

  const result = await connect.totalEarnedToken(address)

  return result;
}

export async function totalPerdidoToken(address:string){
  const provider = await getProvider();

  const connect = new ethers.Contract(DONATION_ADDRESS || "", donationAbi, provider)

  const result = await connect.totalLostToken(address)

  return result;
}

export async function totalGanhoUsdt(address:string){
  const provider = await getProvider();

  const connect = new ethers.Contract(DONATION_ADDRESS || "", donationAbi, provider)

  const result = await connect.totalEarnedToken(address)

  return result;
}

export async function totalPerdidoUsdt(address:string){
  const provider = await getProvider();

  const connect = new ethers.Contract(DONATION_ADDRESS || "", donationAbi, provider)

  const result = await connect.totalLostToken(address)

  return result;
}

{/* ------------ WBTC FUNCTIONS ------------ */}

export async function approveUSDTwbtc(value: Number) {
  console.log(value)
  const provider = await getProvider()
  const signer = await provider.getSigner();

  const mint = new ethers.Contract(
    USDT_ADDRESS_WBTC ? USDT_ADDRESS_WBTC : "",
    usdtWbtcAbi,
    signer
  );


  const tx = await mint.approve(WBTC_COLLECTION_ADDRESS, value);
  await tx.wait();

  return tx;
}


export async function getAllowanceUsdtWbtc(
  address: string,
  maxRetries = 5, // Número máximo de tentativas
  delay = 1000 // Tempo de espera entre tentativas (em milissegundos)
) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      // Obtém o provedor conectado à wallet
      const provider = await getProvider();

      // Conecta ao contrato
      const mint = new ethers.Contract(
        USDT_ADDRESS_WBTC ? USDT_ADDRESS_WBTC : "",
        usdtWbtcAbi,
        provider
      );

      // Obtém o allowance
      const allowance : bigint = await mint.allowance(address, WBTC_COLLECTION_ADDRESS);

      // Retorna o valor caso a chamada tenha sucesso
      if (allowance !== undefined) {
        return allowance;
      }

    } catch (error) {
    }

    retries++;

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Lança um erro caso todas as tentativas falhem
  throw new Error(`Falha ao obter allowance após ${maxRetries} tentativas.`);
}



export async function buyNftWbtc(quantity:number) {
  const provider = await getProvider();
  const signer = await provider.getSigner();

  console.log("provider:", provider)
  console.log("signer:", signer)

  const buy = new ethers.Contract(
    WBTC_COLLECTION_ADDRESS ? WBTC_COLLECTION_ADDRESS : "",
    wbtcCollectionAbi,
    signer
  );
  

  try {
    // Envia a transação
    const tx = await buy.mint(quantity);

    let concluded;

    // Tenta esperar a transação
    try {
      concluded = await tx.wait();
    } catch (waitError) {

      // Caso `tx.wait()` falhe, tenta obter o recibo manualmente
      concluded = await provider.getTransactionReceipt(tx.hash);
    }

    if (concluded && concluded.status === 1) {
      return concluded;
    } else {
      throw new Error("Transação falhou ou não foi confirmada.");
    }

  } catch (error) {
    throw error; // Lança erro para ser tratado no frontend
  }
}

export async function wbtcNftNumber(address:string){
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const buy = new ethers.Contract(
    WBTC_COLLECTION_ADDRESS ? WBTC_COLLECTION_ADDRESS : "",
    wbtcCollectionAbi,
    signer
  );
  
const tx = await buy.balanceOf( address, 1)

return tx;
}



export async function approveWbtcNft(isQueue: boolean) {
  try {
    const provider = await getProvider();
    const signer = await provider.getSigner();

    const buy = new ethers.Contract(
      WBTC_COLLECTION_ADDRESS || "",
      wbtcCollectionAbi,
      signer
    );

    let tx;
    if (isQueue) {
      tx = await buy.setApprovalForAll(WBTC_QUEUE_ADDRESS, true);
    } else {
      tx = await buy.setApprovalForAll(WBTC_COLLECTION_ADDRESS, true);
    }


    // Aguarda a confirmação da transação
    const receipt = await tx.wait();


    return receipt; // Retorna o recibo da transação confirmada
  } catch (error) {
    throw error; // Lança o erro para tratamento no chamador
  }
}


export async function verifyApprovalWbtc(address:string, isQueue:boolean){
  try {
    const provider = await getProvider();
    const signer = await provider.getSigner();

    const buy = new ethers.Contract(
      WBTC_COLLECTION_ADDRESS || "",
      wbtcCollectionAbi,
      signer
    );

    let tx;
    if (isQueue) {
      tx = await buy.isApprovedForAll(address, WBTC_QUEUE_ADDRESS);
    } else {
      tx = await buy.isApprovedForAll(address, WBTC_COLLECTION_ADDRESS);
    }

    


console.log(tx)
    return tx; // Retorna o recibo da transação confirmada
  } catch (error) {
    throw error; // Lança o erro para tratamento no chamador
  }
}

 export async function activateWbtcNft() {
  try {
    const provider = await getProvider();
    const signer = await provider.getSigner();

    const buy = new ethers.Contract(
      WBTC_COLLECTION_ADDRESS || "",
      wbtcCollectionAbi,
      signer
    );

    // Envia a transação
    const tx = await buy.activeUnilevel();

    // Aguarda a confirmação da transação
    const receipt = await tx.wait();

    return receipt; // Retorna o recibo da transação confirmada
  } catch (error) {
    throw error; // Lança o erro para tratamento no chamador
}
}


export async function isActiveNftWbtc(owner:string){
  
  //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
  const provider = await getProvider();

const collection = new ethers.Contract(
  WBTC_COLLECTION_ADDRESS ? WBTC_COLLECTION_ADDRESS : "",
  wbtcCollectionAbi,
  provider
);

const isActive : boolean  = (await collection.isActive(owner));

return isActive;
}



export async function timeUntilInactiveNftsWbtc(owner:string){
  
  //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
  const provider = await getProvider();
const collection = new ethers.Contract(
  WBTC_COLLECTION_ADDRESS ? WBTC_COLLECTION_ADDRESS : "",
  wbtcCollectionAbi,
  provider
);

const time = await collection.timeUntilInactive(owner);
console.log(time)
return time;
}

export async function verifyApprovalWbtcQueue(){

}


export async function addQueueWbtc() {
  try {
      const provider = await getProvider();
      const signer = await provider.getSigner();

      const collection = new ethers.Contract(
          WBTC_QUEUE_ADDRESS || "",
          wbtcQueueAbi,
          signer
      );

      console.log("Attempting to add to queue...");
      const tx = await collection.addToQueue();
      console.log("Transaction sent:", tx.hash);

      const concluded = await tx.wait(); // Aguarda a confirmação da transação
      console.log("Transaction confirmed:", concluded);
      return concluded; // Retorna a conclusão em caso de sucesso
  } catch (error) {
      console.error("Error in addQueueWbtc:", error); // Log completo do erro
      throw error; // Repassa o erro para ser tratado pela função chamadora
  }
}



export async function balanceWbtcQueue() {
  const provider = await getProvider();
    const signer = await provider.getSigner();

    const collection = new ethers.Contract(
      WBTC_QUEUE_ADDRESS || "",
      wbtcQueueAbi,
      signer
    );

    const tx = await collection.balanceFree(); // Aguarda a confirmação da transação
    return tx; // Retorna a conclusão em caso de sucesso
}



export async function getQueueWbtc(): Promise<queueData[]> {
  //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
  const provider = await getProvider();

const queueContract = new ethers.Contract(
  WBTC_QUEUE_ADDRESS ? WBTC_QUEUE_ADDRESS : "",
  wbtcQueueAbi,
  provider
);

while (true) {
  try {
    // Obtenha os dados da fila diretamente do contrato
    const getQueueDetails: any[] = await queueContract.getQueueDetails();
    
    // Transforme as tuplas retornadas para o formato `queueData`
    const queue: queueData[] = getQueueDetails.map((item) => ({
      user: item[0], // address
      index: BigInt(item[1]), // uint256 -> BigInt
      batchLevel: BigInt(item[2]), // uint256 -> BigInt
      nextPaied: item[3] === 1 // uint256 -> boolean
    }));

    return queue;

  } catch (err) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Retry após 1s
  }
}
}


export async function getWbtcCotation(){
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const collection = new ethers.Contract(
    WBTC_ORACLE_ADDRESS || "",
    wbtcOracleAbi,
    signer
  );

  const tx = await collection.getPriceWbtcUsdt(1);
  console.log("tx result: ", tx) // Aguarda a confirmação da transação
  return tx; // Retorna a conclusão em caso de sucesso

}

export async function doClaimQueueWbtc(){
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const collection = new ethers.Contract(
    WBTC_QUEUE_ADDRESS || "",
    wbtcQueueAbi,
    signer
  );

  const tx = await collection.claim()
  return tx;
}


export async function getTokensToWithdrawWbtc(owner: string) {
  try {
    const provider = await getProvider();

    const queue = new ethers.Contract(
      WBTC_QUEUE_ADDRESS || "",
      wbtcQueueAbi,
      provider
    );

    const tokens = await queue.tokensToWithdraw(owner);
    return tokens;
  } catch (error: any) {
    return {
      success: false,
      errorMessage: error?.reason || error?.message || "Unknown error occurred",
    };
  }
}


export async function withdrawTokensWbtc() {
  try {
    const provider = await getProvider();
    const signer = await provider.getSigner();

    const queue = new ethers.Contract(
      WBTC_QUEUE_ADDRESS || "",
      wbtcQueueAbi,
      signer
    );
    const feeData = await provider.getFeeData();
    if (!feeData.maxFeePerGas) {
      throw new Error("Unable to get gas price");
    }
  
    const maxFeePerGas = feeData.maxFeePerGas *3n;
  
    
    const tx = await queue.withdrawTokens();

    // Aguarda a confirmação
    const receipt = await tx.wait();

    if (receipt.status === 1) {
      // Sucesso
      return {
        success: true,
        message: "Tokens successfully withdrawn!",
        transactionHash: tx.hash,
      };
    } else {
      // Transação falhou
      return {
        success: false,
        errorMessage: "Transaction failed on the blockchain.",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      errorMessage: error?.reason || error?.message || "Unknown error occurred",
    };
  }
}

export async function getAllowanceUsdtV2(
  address: string,
  maxRetries = 5, // Número máximo de tentativas
  delay = 1000 // Tempo de espera entre tentativas (em milissegundos)
) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      // Obtém o provedor conectado à wallet
      const provider = await getProvider();

      // Conecta ao contrato
      const mint = new ethers.Contract(
        USDT_ADDRESS ? USDT_ADDRESS : "",
        usdtAbi,
        provider
      );

      // Obtém o allowance
      const allowance : bigint = await mint.allowance(address, DONATION_ADDRESS);

      // Retorna o valor caso a chamada tenha sucesso
      if (allowance !== undefined) {
        return allowance;
      }

    } catch (error) {
    }

    retries++;

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Lança um erro caso todas as tentativas falhem
  throw new Error(`Falha ao obter allowance após ${maxRetries} tentativas.`);
}



export async function approveUsdtDonationV2(value: string) {
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const token = new ethers.Contract(
    USDT_ADDRESS ? USDT_ADDRESS : "",
    usdtAbi,
    signer
  );
  const feeData = await provider.getFeeData();
  if (!feeData.maxFeePerGas) {
    throw new Error("Unable to get gas price");
  }

  const maxFeePerGas = feeData.maxFeePerGas *3n;


  const tx = await token.approve(DONATION_V2_ADDRESS, Number(value)*10**6,{maxFeePerGas: maxFeePerGas,maxPriorityFeePerGas: maxPriorityFeePerGas});
  await tx.wait();
  return tx;
}



export async function donateV2(amount:string){
  
  const provider = await getProvider();
  const signer = await provider.getSigner();

  
  
  const donation = new ethers.Contract(
    DONATION_V2_ADDRESS ? DONATION_V2_ADDRESS : "",
    donationV2Abi,
    signer
  );

  const feeData = await provider.getFeeData();
  if (!feeData.maxFeePerGas) {
    throw new Error("Unable to get gas price");
  }

  const maxFeePerGas = feeData.maxFeePerGas *3n;
  

  let tx
  try {
    



      const estimatedGas = await donation.donate.estimateGas(Number(amount)*10**6);
      const gasLimit = estimatedGas * 150n / 100n;

      tx = await donation.donate(Number(amount)*10**6,{maxFeePerGas: maxFeePerGas,maxPriorityFeePerGas: maxPriorityFeePerGas,gasLimit});
    const concluded = tx.wait();
    return concluded;
  } catch (error) {
    console.error("Gas cannot be estimated:", error);
    throw error; 
  }

}


export async function getBtc24hPreviewedClaimV2(owner:string){
  
  //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const provider = await getProvider();

      const donation = new ethers.Contract(
        DONATION_V2_ADDRESS || '',
        donationV2Abi,
        provider
      );

      const balance = await donation.previewTotalValue(owner);

      return balance;

    } catch (error) {
      console.error(`Erro na tentativa ${attempt}:`, error);

      // Verifica se é a última tentativa
      if (attempt === 3) {
        console.error('Número máximo de tentativas atingido.');
        return null;
      }

      // Aguarda um tempo antes da próxima tentativa
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // Retorno caso todas as tentativas falhem
  return null;
}

export async function getBtc24hPriceV2(){
  
  //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
  const provider = await getProvider();

const oracle = new ethers.Contract(
  ORACLE_V2_ADDRESS ? ORACLE_V2_ADDRESS : "",
  oracleV2Abi,
  provider
);

const price = await oracle.returnPrice(ethers.parseUnits("1","ether"));

return price;
}


export async function getTimeUntilToClaimV2(owner:string){
  
  //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
  const provider = await getProvider();


const donation = new ethers.Contract(
  DONATION_V2_ADDRESS ? DONATION_V2_ADDRESS : "",
  donationV2Abi,
  provider
);

const time = Number(await donation.timeUntilNextWithdrawal(owner));

return time;
}


export async function claimV2(isRoot:boolean){
  
  const provider = await getProvider()
  const signer = await provider.getSigner();

  const feeData = await provider.getFeeData();
  if (!feeData.maxFeePerGas) {
    throw new Error("Unable to get gas price");
  }

  const maxFeePerGas = feeData.maxFeePerGas *3n;

  
  const donation = new ethers.Contract(
    DONATION_V2_ADDRESS ? DONATION_V2_ADDRESS : "",
    donationV2Abi,
    signer
  );
  
  try {

    const estimatedGas = await donation.claimDonation.estimateGas(isRoot);
    

    const gasLimit = estimatedGas * 130n / 100n;


    // Envia a transação
    console.log("IS ROOT: ", isRoot)
    const tx = await donation.claimDonation(isRoot,{
      maxFeePerGas,
      maxPriorityFeePerGas,
      gasLimit,
    });

    await tx.wait();

    return tx;
  } catch (error) {
    console.error("Gas cannot be estimated:", error);
    throw error; 
  }
}

export async function getUserV2(owner: string): Promise<any> {
  // Obter o provider
  const provider = await getProvider();

  // Instanciar o contrato
  const donation = new ethers.Contract(
    DONATION_V2_ADDRESS ? DONATION_V2_ADDRESS : "",
    donationV2Abi,
    provider
  );

  // Chamar o método do contrato
  const user: any[] = await donation.getUser(owner);

  // Retornar apenas o último parâmetro
  return user[user.length - 1];
}


















export async function getValuesDeposit(
  maxRetries = 5, // Número máximo de tentativas
  delay = 1000 // Tempo de espera entre tentativas (em milissegundos)
) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      // Obtém o provedor conectado à wallet
      const provider = await getProvider();

      // Conecta ao contrato
      const mint = new ethers.Contract(
        QUEUE_COIN_ADDRESS ? QUEUE_COIN_ADDRESS : "",
        queueCoinAbi,
        provider
      );

      // Obtém o allowance

      const allowance1  = await mint.viewDepositQuantity(1);
      const allowance2  = await mint.viewDepositQuantity(2);
      
      // Retorna o valor caso a chamada tenha sucesso
      if (allowance1 !== undefined && allowance2 !== undefined) {
        return [allowance1, allowance2];
      }

    } catch (error) {
    }

    retries++;

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Lança um erro caso todas as tentativas falhem
  throw new Error(`Falha ao obter allowance após ${maxRetries} tentativas.`);
}

export async function getAllowanceBtc24h(
  address: string,
  maxRetries = 5, // Número máximo de tentativas
  delay = 1000 // Tempo de espera entre tentativas (em milissegundos)
) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      // Obtém o provedor conectado à wallet
      const provider = await getProvider();

      // Conecta ao contrato
      const mint = new ethers.Contract(
        BTC24H_ADDRESS ? BTC24H_ADDRESS : "",
        btc24hAbi,
        provider
      );

      // Obtém o allowance
      const allowance : bigint = await mint.allowance(address, QUEUE_COIN_ADDRESS);

      // Retorna o valor caso a chamada tenha sucesso
      if (allowance !== undefined) {
        return allowance;
      }

    } catch (error) {
    }

    retries++;

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Lança um erro caso todas as tentativas falhem
  throw new Error(`Falha ao obter allowance após ${maxRetries} tentativas.`);
}

export async function getAllowanceBitcoin24h(
  address: string,
  maxRetries = 5, // Número máximo de tentativas
  delay = 1000 // Tempo de espera entre tentativas (em milissegundos)
) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      // Obtém o provedor conectado à wallet
      const provider = await getProvider();

      // Conecta ao contrato
      const mint = new ethers.Contract(
        BTC24H_V2_ADDRESS ? BTC24H_V2_ADDRESS : "",
        btc24hV2Abi,
        provider
      );

      // Obtém o allowance
      const allowance : bigint = await mint.allowance(address, QUEUE_COIN_ADDRESS);

      // Retorna o valor caso a chamada tenha sucesso
      if (allowance !== undefined) {
        return allowance;
      }

    } catch (error) {
    }

    retries++;

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Lança um erro caso todas as tentativas falhem
  throw new Error(`Falha ao obter allowance após ${maxRetries} tentativas.`);
}

export async function approveBtc24h(value: bigint) {
  const provider = await getProvider()
  const signer = await provider.getSigner();

  const mint = new ethers.Contract(
    BTC24H_ADDRESS ? BTC24H_ADDRESS : "",
    btc24hAbi,
    signer
  );
  const feeData = await provider.getFeeData();
  if (!feeData.maxFeePerGas) {
    throw new Error("Unable to get gas price");
  }

  const maxFeePerGas = feeData.maxFeePerGas *3n;

  const tx = await mint.approve(QUEUE_COIN_ADDRESS, value+BigInt(100000000000000000000),{maxFeePerGas: maxFeePerGas,maxPriorityFeePerGas: maxPriorityFeePerGas});
  await tx.wait();

  return tx;
}


export async function approveBitcoin24h(value: bigint) {
  const provider = await getProvider()
  const signer = await provider.getSigner();

  const mint = new ethers.Contract(
    BTC24H_V2_ADDRESS ? BTC24H_V2_ADDRESS : "",
    btc24hV2Abi,
    signer
  );
  const feeData = await provider.getFeeData();
  if (!feeData.maxFeePerGas) {
    throw new Error("Unable to get gas price");
  }

  const maxFeePerGas = feeData.maxFeePerGas *3n;

  const tx = await mint.approve(QUEUE_COIN_ADDRESS, value+BigInt(30000000000000000000),{maxFeePerGas: maxFeePerGas,maxPriorityFeePerGas: maxPriorityFeePerGas});
  await tx.wait();

  return tx;
}


export async function addQueueBtc24h(tokenId: number) {
  const provider = await getProvider();
    const signer = await provider.getSigner();

    const collection = new ethers.Contract(
      QUEUE_COIN_ADDRESS || "",
      queueCoinAbi,
      signer
    );
    const feeData = await provider.getFeeData();
    if (!feeData.maxFeePerGas) {
      throw new Error("Unable to get gas price");
    }
  
    const maxFeePerGas = feeData.maxFeePerGas *3n;
  
    
    const tx = await collection.addToQueue(tokenId, 1,{maxFeePerGas: maxFeePerGas,maxPriorityFeePerGas: maxPriorityFeePerGas});
    const concluded = await tx.wait(); // Aguarda a confirmação da transação
    return concluded; // Retorna a conclusão em caso de sucesso

}

export async function getQueueBtc24h(): Promise<queueData[]> {
  //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
  const provider = await getProvider();

const queueContract = new ethers.Contract(
  QUEUE_COIN_ADDRESS ? QUEUE_COIN_ADDRESS : "",
  queueCoinAbi,
  provider
);

while (true) {
  try {
    // Obtenha os dados da fila diretamente do contrato
    const getQueueDetails: any[] = await queueContract.getQueueDetails(1);
    
    // Transforme as tuplas retornadas para o formato `queueData`
    const queue: queueData[] = getQueueDetails.map((item) => ({
      user: item[0], // address
      index: BigInt(item[1]), // uint256 -> BigInt
      batchLevel: BigInt(item[2]), // uint256 -> BigInt
      nextPaied: item[3] === 1 // uint256 -> boolean
    }));

    return queue;

  } catch (err) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Retry após 1s
  }
}
}

export async function getQueueBitcoin24h(): Promise<queueData[]> {
  //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
  const provider = await getProvider();

const queueContract = new ethers.Contract(
  QUEUE_COIN_ADDRESS ? QUEUE_COIN_ADDRESS : "",
  queueCoinAbi,
  provider
);

while (true) {
  try {
    // Obtenha os dados da fila diretamente do contrato
    const getQueueDetails: any[] = await queueContract.getQueueDetails(2);
    
    // Transforme as tuplas retornadas para o formato `queueData`
    const queue: queueData[] = getQueueDetails.map((item) => ({
      user: item[0], // address
      index: BigInt(item[1]), // uint256 -> BigInt
      batchLevel: BigInt(item[2]), // uint256 -> BigInt
      nextPaied: item[3] === 1 // uint256 -> boolean
    }));

    return queue;

  } catch (err) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Retry após 1s
  }
}
}

export async function balanceToPaidBtc24h(maxRetries = 3): Promise<string> {
  // Initialize the provider
  const provider = await getProvider();
  const collection = new ethers.Contract(
    QUEUE_COIN_ADDRESS ? QUEUE_COIN_ADDRESS : "",
    queueCoinAbi,
    provider
  );

  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      // Attempt to fetch data from the blockchain
      const tx = await collection.balanceFree(0);

      // If successful, format and return the result
      return (tx);
    } catch (error) {
    }

    // Increment the attempt counter
    attempt++;
  }

  // If all retries fail, throw an error or return a default value
  throw new Error(`Failed to fetch balance from the blockchain after ${maxRetries} attempts.`);
}



export async function balanceToPaidBitcoin24h(maxRetries = 3): Promise<string> {
  // Initialize the provider
  const provider = await getProvider();
  const collection = new ethers.Contract(
    QUEUE_COIN_ADDRESS ? QUEUE_COIN_ADDRESS : "",
    queueCoinAbi,
    provider
  );

  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      // Attempt to fetch data from the blockchain
      const tx = await collection.balanceFree(1);

      // If successful, format and return the result
      return (tx);
    } catch (error) {
    }

    // Increment the attempt counter
    attempt++;
  }

  // If all retries fail, throw an error or return a default value
  throw new Error(`Failed to fetch balance from the blockchain after ${maxRetries} attempts.`);
}


export async function doClaimQueueBtc24h(){
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const collection = new ethers.Contract(
   QUEUE_COIN_ADDRESS || "",
    queueCoinAbi,
    signer
  );

  const tx = await collection.claim(1)
  return tx;
}

export async function doClaimQueueBitcoin24h(){
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const collection = new ethers.Contract(
   QUEUE_COIN_ADDRESS || "",
    queueCoinAbi,
    signer
  );

  const tx = await collection.claim(2)
  return tx;
}

export async function getTokensToWithdrawBtc24h(owner: string) {
  try {
      //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
      const provider = await getProvider();

    const queue = new ethers.Contract(
      QUEUE_COIN_ADDRESS || "",
      queueCoinAbi,
      provider
    );

    const tokens = await queue.tokensToWithdraw(owner);
    return tokens; // Retorna a conclusão em caso de sucesso
  } catch (error: any) {
    // Retorna a mensagem de erro
    return {
      success: false,
      errorMessage: error?.reason || error?.message || "Unknown error occurred",
    };
  }
}



export async function withdrawTokensBtc24h() {
  try {
    const provider = await getProvider();
    const signer = await provider.getSigner();

    const queue = new ethers.Contract(
      QUEUE_COIN_ADDRESS || "",
      queueCoinAbi,
      signer
    );
    const feeData = await provider.getFeeData();
    if (!feeData.maxFeePerGas) {
      throw new Error("Unable to get gas price");
    }
  
    const maxFeePerGas = feeData.maxFeePerGas *3n;
  
    
    const tx = await queue.withdrawTokens();

    // Aguarda a confirmação
    const receipt = await tx.wait();

    if (receipt.status === 1) {
      // Sucesso
      return {
        success: true,
        message: "Tokens successfully withdrawn!",
        transactionHash: tx.hash,
      };
    } else {
      // Transação falhou
      return {
        success: false,
        errorMessage: "Transaction failed on the blockchain.",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      errorMessage: error?.reason || error?.message || "Unknown error occurred",
    };
  }
}


interface ReferralNode {
  address: string; // Use "string" (em minúsculas), não "String" (em maiúsculas).
  children: ReferralNode[]; // Um array de nós recursivos.
}


export async function fetchReferralTree(userAddress:string, currentLevel = 0, maxLevel = 20) {

  // Interrompe a recursão se o nível máximo for atingido
  if (currentLevel >= maxLevel) return null;

  // Obtenha os referenciados diretos do contrato
  const referrals = await fetchReferrals(userAddress);

  // Crie o nó do usuário atual
  const node : ReferralNode = {
    address: userAddress,
    children: [],
  }

  // Para cada referenciado, chame a função recursivamente
  for (const referral of referrals) {
    const childNode = await fetchReferralTree(referral, currentLevel + 1, maxLevel);
    if (childNode) {
      node.children.push(childNode);
    }
  }

  return node;
}

// Função auxiliar para buscar apenas as referências diretas
export async function fetchReferrals(userAddress:String) {
console.log("chegou aqui")
  const provider = await getProvider();
    const signer = await provider.getSigner();

    const queue = new ethers.Contract(
      USER_ADDRESS || "",
      userAbi,
      signer
    );

  const [, , , referral] = await queue.getUser(userAddress);
  return referral;
}


export async function getContributions(owner: string) {
  try {
      //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
      const provider = await getProvider();

    const queue = new ethers.Contract(
      DONATION_ADDRESS || "",
      donationAbi,
      provider
    );

    const tokens = await queue.getActiveContributions(owner, 1);
    console.log("contributions: ", tokens)
    return tokens; // Retorna a conclusão em caso de sucesso
  } catch (error: any) {
    // Retorna a mensagem de erro
    return {
      success: false,
      errorMessage: error?.reason || error?.message || "Unknown error occurred",
    };
  }
}