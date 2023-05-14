import React, { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import Web3Modal from "web3modal";
import {Token, CurrencyAmount, TradeType, Percent} from "@uniswap/sdk-core"

//INTERNAL IMPORT
import {
  checkIfWalletConnected,
  connectWallet,
  connectingWithBooToken,
  connectingWithLIfeToken,
  connectingWithSingleSwapToken,
  connectingWithIWTHToken,
  connectingWithDAIToken,
  connectingWithUserStorageContract,
  connectingWithMultiHopContract,
} from "../Utils/appFeatures";

import { getPrice } from "../Utils/fetchingPrice";
import { swapUpdatePrice } from "../Utils/swapUpdatePrice";
import { addLiquidityExternal } from "@/Utils/addLiquidity";
import { getLiquidity } from "@/Utils/checkLiquidity";
import { connectingWithPoolContract } from "@/Utils/deployPool";

import { IWETHABI } from "./constants";
import ERC20 from "./ERC20.json";

export const SwapTokenContext = React.createContext();

export const SwapTokenContextProvider = ({ children }) => {
  //USSTATE
  const [account, setAccount] = useState("");
  const [ether, setEther] = useState("");
  const [networkConnect, setNetworkConnect] = useState("");
  const [weth9, setWeth9] = useState("");
  const [dai, setDai] = useState("");

  const [tokenData, setTokenData] = useState([]);
  const [getAllLiquidity, setGetAllLiquidity] = useState([]);
  
  //TOP TOKENS
  // const [topTokensList, setTopTokensList] = useState([]);

  const addToken = [
    "0x5E5713a0d915701F464DEbb66015adD62B2e6AE9",
    "0x97fd63D049089cd70D9D139ccf9338c81372DE68",
    "0xC0BF43A4Ca27e0976195E6661b099742f10507e5",
  ];

  //FETCH DATA
  const fetchingData = async () => {
    try {
      //GET USER ACCOUNT
      const userAccount = await checkIfWalletConnected();
      setAccount(userAccount);
      //CREATE PROVIDER
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      //CHECK Balance
      const balance = await provider.getBalance(userAccount);
      const convertBal = BigNumber.from(balance).toString();
      const ethValue = ethers.utils.formatEther(convertBal);
      setEther(ethValue);

      //GET NETWORK
      const newtork = await provider.getNetwork();
      setNetworkConnect(newtork.name);

      //ALL TOKEN BALANCE AND DATA
      addToken.map(async (el, i) => {
        //GETTING CONTRACT
        const contract = new ethers.Contract(el, ERC20.abi, provider);
        //GETTING BALANCE OF TOKEN
        const userBalance = await contract.balanceOf(userAccount);
        const tokenLeft = BigNumber.from(userBalance).toString();
        const convertTokenBal = ethers.utils.formatEther(tokenLeft);
        //GET NAME AND SYMBOL

        const symbol = await  contract.symbol();
        const name = await contract.name();
        
        tokenData.push({
          name: name,
          symbol: symbol,
          tokenBalance: convertTokenBal,
          tokenAddress: el,
        });
        // setTokenData(tokenData);
      });
      
      // get liquidity
      const userStorageData = await connectingWithUserStorageContract();
      const userLiquidity = await userStorageData.getAllTransactions();
      // console.log(userLiquidity);
      userLiquidity.map(async(el, i) => {
        const liquidityData = await getLiquidity(
          el.poolAddress,
          el.tokenAddress0,
          el.tokenAddress1,
        );
        getAllLiquidity.push(liquidityData);
      });
      setGetAllLiquidity(getAllLiquidity);
      // console.log(getAllLiquidity);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchingData();
  }, []);

  //CREATE AND ADD LIQUIDITY
  const createLiquidityAndPool = async ({
    tokenAddress0,
    tokenAddress1,
    fee,
    tokenPrice1,
    tokenPrice2,
    slippage,
    deadline,
    tokenAmountOne,
    tokenAmountTwo,
  }) => {
    try {
      //createPool
      console.log(tokenAddress0,
        tokenAddress1,
        fee,
        tokenPrice1,
        tokenPrice2,
        slippage,
        deadline,
        tokenAmountOne,
        tokenAmountTwo);
      const createPool = await connectingWithPoolContract(
        tokenAddress0,
        tokenAddress1,
        fee,
        tokenPrice1,
        tokenPrice2,
        {
          gasLimit: 500000,
        }
      );
      const poolAddress = createPool;
      console.log("Connected to pool")
      console.log("poolAddress", poolAddress);

      
      //createLiquidity
      const info = await addLiquidityExternal(
        tokenAddress0,
        tokenAddress1,
        poolAddress,
        fee,
        tokenAmountOne,
        tokenAmountTwo,
      );
      console.log("added liquidity")
      console.log(info);
      //Add data
      const userStorageData = await connectingWithUserStorageContract();
      const userLiquidity = await userStorageData.addToBlockchain(
        poolAddress,
        tokenAddress0,
        tokenAddress1,
      );
      console.log("saved to blockchain");


    } catch (error) {
      console.log(error);
    }
  };

  //Single Swap Token
  const singleSwapToken = async({token1, token2, swapAmount}) => {
    console.log(token1.tokenAddress.tokenAddress, token2.tokenAddress.tokenAddress, swapAmount);

    try {
      let singleSwapToken;
      let weth;
      let dai;
      singleSwapToken = await connectingWithSingleSwapToken();
      weth = await connectingWithIWTHToken();
      dai = await connectingWithDAIToken();

      // const amountIn = 10n ** 18n; // 1 WETH
      const decimals0 = 18;
      const inputAmount = swapAmount;
      const amountIn = ethers.utils.parseUnits(
        inputAmount,
        decimals0
      );

      console.log(amountIn);

      // deposit 1 ether
      await weth.deposit({ value: amountIn});
      console.log("ether deposited");

      //approve 1 ether to singleSwapToken contract to spend weth token on behalf of user
      await weth.approve(singleSwapToken.address, amountIn);
      console.log("Approved");

      //swap
      const transaction =  await singleSwapToken.swapExactInputSingle(
        token1.tokenAddress.tokenAddress, 
        token2.tokenAddress.tokenAddress,
        amountIn, {
          gasLimit: 300000,
        },
      );
      await transaction.wait();
      // console.log(transaction);
      
      const balance = await dai.balanceOf(account);
      const transferAmount = BigNumber.from(balance);
      const ethValue = ethers.utils.formatEther(transferAmount);
      setDai(ethValue);
      console.log(`${token2.name} Balance: ${ethValue}`);
      // console.log(token2.tokenAddress.tokenBalance)

    } catch (error) {
      console.log(error) 
    }
  };

  return (
    <SwapTokenContext.Provider
      value={{
        singleSwapToken,
        connectWallet,
        getPrice,
        swapUpdatePrice,
        createLiquidityAndPool,
        getAllLiquidity,
        account,
        tokenData,
        networkConnect,
        weth9,
        dai,
        ether,
      }}
    >
      {children}
    </SwapTokenContext.Provider>
  );
};