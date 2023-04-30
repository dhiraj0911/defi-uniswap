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

import { IWETHABI } from "./constants";
import ERC20 from "./ERC20.json";

import {getPrice} from "../Utils/fetchingPrice";
import {swapUpdatePrice} from "../Utils/swapUpdatePrice";
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
  const [topTokensList, setTopTokensList] = useState([]);

  const addToken = [
    // "0x44863F234b137A395e5c98359d16057A9A1fAc55",
    // "0x0c03eCB91Cb50835e560a7D52190EB1a5ffba797"
    "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    "0x68749665FF8D2d112Fa859AA293F07A622782F38",
    "0xc944E90C64B2c07662A292be6244BDf05Cda44a7"
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
         const symbol = await contract.symbol();
        const name = await contract.name();
          tokenData.push({
          name: name,
          symbol: symbol,
          tokenBalance: convertTokenBal,
          tokenAddress: el,
        });
        setTokenData(tokenData);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchingData();
  }, []);

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
        inputAmount.toString(),
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
        }
      );
      await transaction.waith();
      console.log(transaction);
      
      const balance = await dai.balanceOf(account);
      const transferAmount = BigNumber.from(balance).toString();
      const ethValue = ethers.utils.formatEther(transferAmount);
      setDai(ethValue);
      console.log("Dai balance: ", ethValue);

    } catch (error) {
      console.log(error) 
    }
  };

  return (
    <SwapTokenContext.Provider
      value={{
        singleSwapToken,
        connectWallet,
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