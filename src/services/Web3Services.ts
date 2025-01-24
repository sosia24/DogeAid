/* ,{maxFeePerGas: maxFeePerGas,maxPriorityFeePerGas: maxPriorityFeePerGas} */
import { ethers, toNumber } from "ethers";
import donationAbi from "./abis/donation.abi.json";
import userAbi from "./abis/user.abi.json";
import usdtAbi from "./abis/usdt.abi.json"
import dogeAbi from "./abis/btc24h.abi.json"
import oracleAbi from "./abis/oracle.abi.json";
import collectionAbi from "./abis/collection.abi.json";
import queueAbi from "./abis/queue.abi.json";
import paymentManagerAbi from "./abis/payment.manager.abi.json"
import queueCoinAbi from "./abis/queueCoin.abi.json"
import btcAbi from "./abis/btc.abi.json"
import ethAbi from "./abis/eth.abi.json"

import {queueData} from "./types"




const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;
const DONATION_ADDRESS = process.env.NEXT_PUBLIC_DONATION;
const USDT_ADDRESS = process.env.NEXT_PUBLIC_USDT;
const DOGE_ADDRESS = process.env.NEXT_PUBLIC_DOGE;
const COLLECTION_ADDRESS= process.env.NEXT_PUBLIC_COLLECTION;
const ORACLE_ADDRESS= process.env.NEXT_PUBLIC_ORACLE;
const USER_ADDRESS= process.env.NEXT_PUBLIC_USER;
const QUEUE_ADDRESS = process.env.NEXT_PUBLIC_QUEUE;
const PAYMENT_MANAGER = process.env.NEXT_PUBLIC_PAYMENT_MANAGER
const QUEUE_COIN_ADDRESS = process.env.NEXT_PUBLIC_QUEUE_COIN
const BTC_ADDRESS = process.env.NEXT_PUBLIC_BTC_ADDRESS;
const ETH_ADDRESS = process.env.NEXT_PUBLIC_ETH_ADDRESS;


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
export async function approveUSDTUser(value: Number) {
  const provider = await getProvider()
  const signer = await provider.getSigner();

  const mint = new ethers.Contract(
    USDT_ADDRESS ? USDT_ADDRESS : "",
    usdtAbi,
    signer
  );



  const tx = await mint.approve(USER_ADDRESS, value);
  await tx.wait();

  return tx;
}

export async function approveBTC24HDonation(value: string) {
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const token = new ethers.Contract(
    DOGE_ADDRESS ? DOGE_ADDRESS : "",
    dogeAbi,
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

  const maxFeePerGas = feeData.maxFeePerGas *3n;


  const tx = await token.approve(DONATION_ADDRESS, Number(value)*10**6);  
  await tx.wait();
  return tx;
}


export async function getAllowanceUsdtGas(
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
      const usdtContract = new ethers.Contract(
        USDT_ADDRESS ? USDT_ADDRESS : "",
        usdtAbi,
        provider
      );

      // Obtém o allowance
      const allowance : bigint = await usdtContract.allowance(address, USER_ADDRESS);

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





export async function buyNft(quantity:number) {
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const buy = new ethers.Contract(
    COLLECTION_ADDRESS ? COLLECTION_ADDRESS : "",
    collectionAbi,
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
export async function claim(index:number){
  
  const provider = await getProvider()
  const signer = await provider.getSigner();

  const feeData = await provider.getFeeData();
  if (!feeData.maxFeePerGas) {
    throw new Error("Unable to get gas price");
  }

  // const maxFeePerGas = feeData.maxFeePerGas *3n;

  
  const donation = new ethers.Contract(
    DONATION_ADDRESS ? DONATION_ADDRESS : "",
    donationAbi,
    signer
  );
  
  try {

    // const estimatedGas = await donation.claimDonation.estimateGas();
    

    // const gasLimit = estimatedGas * 130n / 100n;


    // Envia a transação
    const tx = await donation.claimContribution(index);

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
    DOGE_ADDRESS ? DOGE_ADDRESS : "",
    dogeAbi,
    provider
  );


  const allowance = await btc24h.allowance(owner,DONATION_ADDRESS);
  
  return allowance;
}


export async function getBtc24hBalance(owner:string){
  
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();
  
  const btc24h = new ethers.Contract(
    DOGE_ADDRESS ? DOGE_ADDRESS : "",
    dogeAbi,
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



export async function getTimeUntilToClaim(owner:string, index:number){
  
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();

  
  const donation = new ethers.Contract(
    DONATION_ADDRESS ? DONATION_ADDRESS : "",
    donationAbi,
    provider
  );

  const time = (await donation.timeUntilNextWithdrawal(owner, index));
  
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

export async function getTotalEarnedPerLevel(owner:string){
  
  const provider = await getProvider();

  const user = new ethers.Contract(
    USER_ADDRESS ? USER_ADDRESS : "",
    userAbi,
    provider
  );

  const userData : bigint[]  = (await user.getTotalEarned(owner));
  
  return userData;
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
    tx  = (await collection.setApprovalForAll(QUEUE_ADDRESS, true));
  }else{
    tx  = (await collection.setApprovalForAll(COLLECTION_ADDRESS,true,{maxFeePerGas: maxFeePerGas,maxPriorityFeePerGas: maxPriorityFeePerGas}));
  }
  await tx.wait()

  const concluded = tx.wait();
  return concluded;
}


export async function getQueue(): Promise<queueData[]> {
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

export async function balanceToPaid(maxRetries = 3) {
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
      const tx = await collection.balanceFree();

      // If successful, format and return the result
      return Number(ethers.formatEther(tx));
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

export async function claimQueueCoin(queueId: number) {
  if (!QUEUE_COIN_ADDRESS) {
    throw new Error("QUEUE_ADDRESS não está definido.");
  }

  const provider = await getProvider();
  const signer = await provider.getSigner();

  const collection = new ethers.Contract(
    QUEUE_COIN_ADDRESS,
    queueCoinAbi,
    signer
  );
 
  try {
    // Envia a transação para o contrato
    const tx = await collection.claim(queueId);

    // Aguarda a confirmação da transação
    const concluded = await tx.wait();

    // Retorna o resultado após a transação ser confirmada
    return concluded;
  } catch (error) {
    console.error("Erro ao realizar a transação:", error);
    throw error; // Repassa o erro para o chamador
  }
}

export async function claimQueue() {
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
 
  try {
    // Envia a transação para o contrato
    const tx = await collection.claim();

    // Aguarda a confirmação da transação
    const concluded = await tx.wait();

    // Retorna o resultado após a transação ser confirmada
    return concluded;
  } catch (error) {
    console.error("Erro ao realizar a transação:", error);
    throw error; // Repassa o erro para o chamador
  }
}



export async function addQueue() {
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
  
    
    const tx = await collection.addToQueue();
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


export async function getMuskBalance(owner:string){
  
  //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
  const provider = await getProvider();

const usdt = new ethers.Contract(
  COLLECTION_ADDRESS ? COLLECTION_ADDRESS : "",
  collectionAbi,
  provider
);

const balance = await usdt.balanceOf(owner, 1);

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



export async function getTreeUsers(address:string){
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();

  const userContract = new ethers.Contract(
    USER_ADDRESS ? USER_ADDRESS : "",
    userAbi,
    provider
  );

  const users = await userContract.getUser(address)
  return users;

}

export async function increaseGas(amount:number){
  //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
  const provider = await getProvider();
  const signer = await provider.getSigner();

const userContract = new ethers.Contract(
  USER_ADDRESS ? USER_ADDRESS : "",
  userAbi,
  signer
);
try {
  // Envia a transação
  const tx = await userContract.increaseGas(ethers.parseUnits(String(amount),6))

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
    throw new Error("Transação failed or not confirmed.");
  }

} catch (error) {
  throw error; // Lança erro para ser tratado no frontend
}


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
      const allowance3  = await mint.viewDepositQuantity(3);
      
      // Retorna o valor caso a chamada tenha sucesso
      if (allowance1 !== undefined && allowance2 !== undefined) {
        return [allowance1, allowance2, allowance3];
      }

    } catch (error) {
    }

    retries++;

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Lança um erro caso todas as tentativas falhem
  throw new Error(`Falha ao obter allowance após ${maxRetries} tentativas.`);
}

export async function getAllowanceDoge(
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
        DOGE_ADDRESS ? DOGE_ADDRESS : "",
        dogeAbi,
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



export async function getAllowanceEth(
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
        ETH_ADDRESS ? ETH_ADDRESS : "",
        ethAbi,
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


export async function getAllowanceBtc(
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
        BTC_ADDRESS ? BTC_ADDRESS : "",
        btcAbi,
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

export async function approveDoge(value: bigint) {
  const provider = await getProvider()
  const signer = await provider.getSigner();

  const mint = new ethers.Contract(
    DOGE_ADDRESS ? DOGE_ADDRESS : "",
    dogeAbi,
    signer
  );


  const tx = await mint.approve(QUEUE_COIN_ADDRESS, value+BigInt(100000000000000000000));
  await tx.wait();

  return tx;
}


export async function approveBtc(value: bigint) {
  const provider = await getProvider()
  const signer = await provider.getSigner();

  const mint = new ethers.Contract(
    BTC_ADDRESS ? BTC_ADDRESS : "",
    btcAbi,
    signer
  );


  const tx = await mint.approve(QUEUE_COIN_ADDRESS, value+BigInt(100000000000000000000));
  await tx.wait();

  return tx;
}

export async function approveEth(value: bigint) {
  const provider = await getProvider()
  const signer = await provider.getSigner();

  const mint = new ethers.Contract(
    ETH_ADDRESS ? ETH_ADDRESS : "",
    ethAbi,
    signer
  );


  const tx = await mint.approve(QUEUE_COIN_ADDRESS, value+BigInt(100000000000000000000));
  await tx.wait();

  return tx;
}



export async function addQueueCoin(tokenId: number) {
  const provider = await getProvider();
    const signer = await provider.getSigner();

    const collection = new ethers.Contract(
      QUEUE_COIN_ADDRESS || "",
      queueCoinAbi,
      signer
    );
  
    
    const tx = await collection.addToQueue(tokenId, 1);
    const concluded = await tx.wait(); // Aguarda a confirmação da transação
    return concluded; // Retorna a conclusão em caso de sucesso

}

export async function getQueueDoge(): Promise<queueData[]> {
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


export async function getQueueEth(): Promise<queueData[]> {
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
    const getQueueDetails: any[] = await queueContract.getQueueDetails(3);
    
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

export async function balanceToPaidDoge(maxRetries = 3): Promise<string> {
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


export async function balanceToPaidBtc(maxRetries = 3): Promise<string> {
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


export async function balanceToPaidEth(maxRetries = 3): Promise<string> {
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
      const tx = await collection.balanceFree(2);

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

    return tokens; // Retorna a conclusão em caso de sucesso
  } catch (error: any) {
    // Retorna a mensagem de erro
    return {

    };
  }

}  
export async function getTransactionsReceived(owner:string){
  try {
    const provider = new ethers.JsonRpcProvider(
        "https://polygon-rpc.com"
    );

    const contract = new ethers.Contract(
        "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        usdtAbi,
        provider
    );
    const from = "0x9AC84d23E5a6c221e4A2C53bf8158Fe09905D812"
    const to = owner
    const filter = contract.filters.Transfer(from,to);

    const events = await contract.queryFilter(filter);

    const result = events.map(event => ({
      transactionHash: event.transactionHash,
      value: ethers.formatUnits(event.data, 6) 
  }));

    return result;
} catch (error) {
    console.error('Error fetching events:', error);
}
    
}


{/* ---------------------- QUEUE COIN DETAILS ------------------- */}

export async function getQueueCoin(index:number): Promise<queueData[]> {
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
    const getQueueDetails: any[] = await queueContract.getQueueDetails(index);
    
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


