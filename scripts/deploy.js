const hre = require("hardhat");
//import ISwapRouterAddress
// const ISwapRouterAddress = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506";

async function main() {
  // ERC20 BOO TOKEN
  const BooToken = await hre.ethers.getContractFactory("BooToken");
  const booToken = await BooToken.deploy();
  await booToken.deployed();
  console.log(`BOO deployed to ${booToken.address}`);

  //ERC20 LIFE TOKEN
  const LifeToken = await hre.ethers.getContractFactory("LifeToken");
  const lifeToken = await LifeToken.deploy();
  await lifeToken.deployed();
  console.log(`Life deployed to ${lifeToken.address}`);

  //SingleSwapToken
  const SingleSwapToken = await hre.ethers.getContractFactory("SingleSwapToken");
  const singleSwapToken = await SingleSwapToken.deploy();
  await singleSwapToken.deployed();
  console.log(`SingleSwapToken deployed to ${singleSwapToken.address}`);

  //SwapMultiHop
  const SwapMultiHop = await hre.ethers.getContractFactory("SwapMultiHop");
  const swapMultiHop = await SwapMultiHop.deploy();
  await swapMultiHop.deployed();
  console.log(`swapMultiHop deployed to ${swapMultiHop.address}`);

  //IWETH
  // const IWETH = await hre.ethers.getContractFactory("IWETH");
  // const iWETH = await IWETH.deploy();
  // await iWETH.deployed();
  // console.log(`IWETH deployed to ${iWETH.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});