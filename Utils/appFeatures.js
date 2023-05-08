// import {ethers} from "ethers";
// import Web3Modal from "web3modal";

// import  {
//     BooTokenAddress, 
//     BooTokenABI, 
//     LifeTokenAddress, 
//     LifeTokenABI,
//     SingleSwapTokenAddress,
//     SingleSwapTokenABI,
//     SwapMultiHopAddress,
//     SwapMultiHopABI,
//     IWETHAddress,
//     IWETHABI
// } from "../Context/constants";

// //check if the user has metamask installed
// export const checkIfWalletConnected = async() => {
//     try {
//         if(!window.ethereum) return console.log("Install MetaMask");
//         const accounts = await window.ethereum.request({method: "eth_accounts"});
//         const firstAccount = accounts[0];
//         return firstAccount;
//     }catch(error) {
//         console.log("Install Wallet");
//     }
// }

// //Connect Wallet
// export const connectWallet = async() => {
//     try {
//         if(!window.ethereum) return console.log("Install MetaMask");
//         const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
//         const firstAccount = accounts[0];
//         return firstAccount;
//     }catch(error) {
//         console.log(error);
//     }
// }

// //Fetching Contract
// //Boo token fetching
// export const fetchBooContract = (signerOrProvider) => new ethers.Contract(BooTokenAddress, BooTokenABI, signerOrProvider);
// //connecting with BOO token contract
// export const connectingWithBooToken = async() => {
//     try {
//         const web3modal = new Web3Modal();
//         const connection = await web3modal.connect();
//         const provider = new ethers.providers.Web3Provider(connection);
//         const signer = provider.getSigner();
//         const contract = fetchBooContract(signer);
//         return contract;
//     }catch(err) {
//         console.log(err);
//     }
// }

// //Fetching Contract
// //Life token fetching
// export const fetchLifeContract = (signerOrProvider) => new ethers.Contract(LifeTokenAddress, LifeTokenABI, signerOrProvider);
// //connecting with BOO token contract
// export const connectingWithLifeToken = async() => {
//     try {
//         const web3modal = new Web3Modal();
//         const connection = await web3modal.connect();
//         const provider = new ethers.providers.Web3Provider(connection);
//         const signer = provider.getSigner();
//         const contract = fetchLifeContract(signer);
//         return contract;
//     }catch(err) {
//         console.log(err);
//     }
// }


// //Fetching Contract
// //SingleSwap token fetching
// export const fetchSingleSwapContract = (signerOrProvider) => new ethers.Contract(SingleSwapTokenAddress, SingleSwapTokenABI, signerOrProvider);
// //connecting with BOO token contract
// export const connectingWithSingleSwapToken = async() => {
//     try {
//         const web3modal = new Web3Modal();
//         const connection = await web3modal.connect();
//         const provider = new ethers.providers.Web3Provider(connection);
//         const signer = provider.getSigner();
//         const contract = fetchSingleSwapContract(signer);
//         return contract;
//     }catch(err) {
//         console.log(err);
//     }
// }

// //Fetching Contract
// //MultiSwap token fetching
// export const fetchMultiSwapContract = (signerOrProvider) => new ethers.Contract(SwapMultiHopAddress, SwapMultiHopABI, signerOrProvider);
// //connecting with BOO token contract
// export const connectingWithMultiSwapToken = async() => {
//     try {
//         const web3modal = new Web3Modal();
//         const connection = await web3modal.connect();
//         const provider = new ethers.providers.Web3Provider(connection);
//         const signer = provider.getSigner();
//         const contract = fetchMultiSwapContract(signer);
//         return contract;
//     }catch(err) {
//         console.log(err);
//     }
// }

// //Fetching Contract
// //IWETH token fetching
// export const fetchIWETHContract = (signerOrProvider) => new ethers.Contract(IWETHAddress, IWETHABI, signerOrProvider);
// //connecting with BOO token contract
// export const connectingWithIWETHToken = async() => {
//     try {
//         const web3modal = new Web3Modal();
//         const connection = await web3modal.connect();
//         const provider = new ethers.providers.Web3Provider(connection);
//         const signer = provider.getSigner();
//         const contract = fetchIWETHContract(signer);
//         return contract;
//     }catch(err) {
//         console.log(err);
//     }
// }

// //Fetching Contract
// //DAI token fetching
// const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
// export const fetchDAIContract = (signerOrProvider) => new ethers.Contract(DAIAddress, IWETHABI, signerOrProvider);
// //connecting with BOO token contract
// export const connectingWithDAIToken = async() => {
//     try {
//         const web3modal = new Web3Modal();
//         const connection = await web3modal.connect();
//         const provider = new ethers.providers.Web3Provider(connection);
//         const signer = provider.getSigner();
//         const contract = fetchDAIContract(signer);
//         return contract;
//     }catch(err) {
//         console.log(err);
//     }
// }

import { ethers } from "ethers";
import Web3Modal from "web3modal";

import {
  BooTokenAddress,
  BooTokenABI,
  LifeTokenAddress,
  LifeTokenABI,
  SingleSwapTokenAddress,
  SingleSwapTokenABI,
  SwapMultiHopAddress,
  SwapMultiHopABI,
  IWETHAddress,
  IWETHABI,
//   userStorageDataAddrss,
//   userStorageDataABI,
} from "../Context/constants";

//CHECK IF WALLET IS CONNECT
export const checkIfWalletConnected = async () => {
  try {
    if (!window.ethereum) return console.log("Install MetaMask");
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    const firstAccount = accounts[0];
    return firstAccount;
  } catch (error) {
    console.log(error);
  }
};

//CONNECT WALLET
export const connectWallet = async () => {
  try {
    if (!window.ethereum) return console.log("Install MetaMask");
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const firstAccount = accounts[0];
    return firstAccount;
  } catch (error) {
    console.log(error);
  }
};

//FETCHING CONTRACT------------------------

//BOO TOKEN FETCHING
export const fetchBooContract = (signerOrProvider) =>
  new ethers.Contract(BooTokenAddress, BooTokenABI, signerOrProvider);

//CONNECTING With BOO TOKEN CONTRACT
export const connectingWithBooToken = async () => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchBooContract(signer);
    return contract;
  } catch (error) {
    console.log(error);
  }
};

//FETCHING CONTRACT------------------------

//LIFE TOKEN FETCHING
export const fetchLifeContract = (signerOrProvider) =>
  new ethers.Contract(LifeTokenAddress, LifeTokenABI, signerOrProvider);

//CONNECTING With LIFE TOKEN CONTRACT
export const connectingWithLIfeToken = async () => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchLifeContract(signer);
    return contract;
  } catch (error) {
    console.log(error);
  }
};

//FETCHING CONTRACT------------------------

//SingleSwapToken TOKEN FETCHING
export const fetchSingleSwapContract = (signerOrProvider) =>
  new ethers.Contract(
    SingleSwapTokenAddress,
    SingleSwapTokenABI,
    signerOrProvider
  );

//CONNECTING With SingleSwapToken TOKEN CONTRACT
export const connectingWithSingleSwapToken = async () => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchSingleSwapContract(signer);
    return contract;
  } catch (error) {
    console.log(error);
  }
};

//FETCHING CONTRACT------------------------

//IWTH TOKEN FETCHING
export const fetchIWTHContract = (signerOrProvider) =>
  new ethers.Contract(IWETHAddress, IWETHABI, signerOrProvider);

//CONNECTING With SingleSwapToken TOKEN CONTRACT
export const connectingWithIWTHToken = async () => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchIWTHContract(signer);
    return contract;
  } catch (error) {
    console.log(error);
  }
};

//FETCHING CONTRACT------------------------

//DAI TOKEN FETCHING
const DAIAddress = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
export const fetchDAIContract = (signerOrProvider) =>
  new ethers.Contract(DAIAddress, IWETHABI, signerOrProvider);

//CONNECTING With SingleSwapToken TOKEN CONTRACT
export const connectingWithDAIToken = async () => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchDAIContract(signer);
    return contract;
  } catch (error) {
    console.log(error);
  }
};

// //USER CONTRACT CONNECTION---------
// export const fetchUserStorageContract = (signerOrProvider) =>
//   new ethers.Contract(
//     userStorageDataAddrss,
//     userStorageDataABI,
//     signerOrProvider
//   );

// //CONNECTING With SingleSwapToken TOKEN CONTRACT
// export const connectingWithUserStorageContract = async () => {
//   try {
//     const web3modal = new Web3Modal();
//     const connection = await web3modal.connect();
//     const provider = new ethers.providers.Web3Provider(connection);
//     const signer = provider.getSigner();
//     const contract = fetchUserStorageContract(signer);
//     return contract;
//   } catch (error) {
//     console.log(error);
//   }
// };

//NEW MULTIHOP
export const fetchMultiHopContract = (signerOrProvider) =>
  new ethers.Contract(SwapMultiHopAddress, SwapMultiHopABI, signerOrProvider);

//CONNECTING With SingleSwapToken TOKEN CONTRACT
export const connectingWithMultiHopContract = async () => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchMultiHopContract(signer);
    return contract;
  } catch (error) {
    console.log(error);
  }
};